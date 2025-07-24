import { describe, it, expect, beforeEach } from 'vitest';
import enhancePrompt from '../../tools/enhancePrompt';

describe('enhancePrompt', () => {
  beforeEach(() => {
    // Ensure we're in mock mode
    process.env.FAL_MCP_MOCK = 'true';
  });

  it('should enhance a basic prompt', async () => {
    const result = await enhancePrompt({
      prompt: 'cat',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('<prompt>');
    expect(result.content[0].text).toContain('<subject>cat</subject>');
    expect(result.content[0].text).toContain('<style>');
    expect(result.content[0].text).toContain('<composition>');
    expect(result.content[0].text).toContain('<negative>');
  });

  it('should enhance with model-specific optimizations', async () => {
    const result = await enhancePrompt({
      prompt: 'landscape',
      model: 'fal-ai/flux/dev',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('high quality');
    expect(result.content[0].text).toContain('detailed');
  });

  it('should apply pixel art preset', async () => {
    const result = await enhancePrompt({
      prompt: 'character',
      preset: 'pixel-art',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('pixel art');
    expect(result.content[0].text).toContain('8-bit');
  });

  it('should handle different media types', async () => {
    const result = await enhancePrompt({
      prompt: 'music',
      type: 'audio',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('distorted');
    expect(result.content[0].text).toContain('low quality');
  });

  it('should apply model-specific optimizations for pixel art', async () => {
    const result = await enhancePrompt({
      prompt: 'robot',
      model: 'fal-ai/flux/dev',
      preset: 'pixel-art',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('pixel art');
    expect(result.content[0].text).toContain('clean pixels');
    expect(result.content[0].text).toContain('no anti-aliasing');
  });
});