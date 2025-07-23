import { describe, it, expect, beforeEach } from 'vitest';
import discoverModelsDynamic from '../../tools/discoverModelsDynamic';

describe('discoverModelsDynamic', () => {
  beforeEach(() => {
    // Ensure we're in mock mode
    process.env.FAL_MCP_MOCK = 'true';
  });

  it('should validate model ID format', async () => {
    const result = await discoverModelsDynamic({
      operation: 'validate',
      modelId: 'fal-ai/flux/dev',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('valid');
    expect(result.content[0].text).toContain('fal-ai/flux/dev');
  });

  it('should reject invalid model ID format', async () => {
    const result = await discoverModelsDynamic({
      operation: 'validate',
      modelId: 'invalid-model-id',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('invalid');
  });

  it('should provide usage suggestions', async () => {
    const result = await discoverModelsDynamic({
      operation: 'suggest',
      useCase: 'create anime artwork',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('Discovery');
    // Should encourage exploration
    expect(result.content[0].text).toMatch(/try|explore|experiment/i);
  });

  it('should infer category from model ID', async () => {
    const result = await discoverModelsDynamic({
      operation: 'infer',
      modelId: 'fal-ai/kling-video/v2.1/master',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toMatch(/video|animation/i);
  });

  it('should infer audio models', async () => {
    const result = await discoverModelsDynamic({
      operation: 'infer',
      modelId: 'fal-ai/stable-audio',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toMatch(/audio|music|sound/i);
  });

  it('should infer image models', async () => {
    const result = await discoverModelsDynamic({
      operation: 'infer',
      modelId: 'fal-ai/flux/dev',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toMatch(/image|visual/i);
  });

  it('should handle missing operation', async () => {
    // @ts-expect-error - Testing error case
    const result = await discoverModelsDynamic({
      modelId: 'fal-ai/flux/dev',
    });

    expect(result.content[0].text).toContain('Required');
  });

  it('should handle validate without modelId', async () => {
    const result = await discoverModelsDynamic({
      operation: 'validate',
    });

    expect(result.content[0].text).toContain('modelId required');
  });

  it('should handle suggest without useCase', async () => {
    const result = await discoverModelsDynamic({
      operation: 'suggest',
    });

    expect(result).toBeDefined();
    // Should still provide general discovery guidance
    expect(result.content[0].text).toContain('Discovery');
  });

  it('should emphasize true dynamic discovery', async () => {
    const result = await discoverModelsDynamic({
      operation: 'suggest',
      useCase: 'something completely new',
    });

    expect(result).toBeDefined();
    // Should not have hardcoded model lists
    expect(result.content[0].text).not.toMatch(/here are the models:/i);
    // Should encourage discovery
    expect(result.content[0].text).toMatch(/any fal-ai|explore|discover/i);
  });
});