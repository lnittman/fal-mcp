import { describe, it, expect, beforeEach } from 'vitest';
import textToImage from '../../tools/textToImage';

describe('textToImage', () => {
  beforeEach(() => {
    // Ensure we're in mock mode
    process.env.FAL_MCP_MOCK = 'true';
  });

  it('should generate an image from text prompt', async () => {
    const result = await textToImage({
      prompt: 'A beautiful sunset',
      model: 'fal-ai/flux/dev',
      parameters: {
        image_size: 'square',
        num_inference_steps: 28,
      },
    });

    expect(result).toBeDefined();
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('https://fal.media/mock/');
    expect(result.content[0].text).toContain('/image.png');
  });

  it('should work with minimal parameters', async () => {
    const result = await textToImage({
      prompt: 'A cat',
      model: 'fal-ai/flux/dev',
      parameters: {},
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('https://fal.media/mock/');
  });

  it('should accept any model starting with fal-ai/', async () => {
    const result = await textToImage({
      prompt: 'Test prompt',
      model: 'fal-ai/some-new-model/v2',
      parameters: {
        custom_param: 'value',
      },
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('https://fal.media/mock/');
  });

  it('should handle invalid model format', async () => {
    const result = await textToImage({
      prompt: 'Test',
      model: 'invalid-model',
      parameters: {},
    });

    expect(result.content[0].text).toContain('Invalid model ID format');
  });

  it('should pass through any parameters without validation', async () => {
    // This test verifies our "no prescriptive logic" approach
    const result = await textToImage({
      prompt: 'Sunset',
      model: 'fal-ai/flux/schnell',
      parameters: {
        // These parameters might not be valid for the model,
        // but our tool doesn't validate them - the API does
        totally_made_up_param: 'test',
        another_param: 123,
        nested_param: { key: 'value' },
      },
    });

    // Should still return success in mock mode
    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('https://fal.media/mock/');
  });
});