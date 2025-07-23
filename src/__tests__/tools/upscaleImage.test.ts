import { describe, it, expect, beforeEach } from 'vitest';
import upscaleImage from '../../tools/upscaleImage';

describe('upscaleImage', () => {
  beforeEach(() => {
    // Ensure we're in mock mode
    process.env.FAL_MCP_MOCK = 'true';
  });

  it('should upscale image from URL', async () => {
    const result = await upscaleImage({
      imageUrl: 'https://example.com/low-res.jpg',
      model: 'fal-ai/aura-sr',
      parameters: {},
    });

    expect(result).toBeDefined();
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('https://fal.media/mock/');
    expect(result.content[0].text).toContain('/image.png');
  });

  // Removed: Local file tests require fs-extra

  it('should work with any fal-ai upscaling model', async () => {
    const result = await upscaleImage({
      imageUrl: 'https://example.com/tiny.png',
      model: 'fal-ai/new-upscaler/v2',
      parameters: {
        scale: 4,
      },
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('https://fal.media/mock/');
  });

  it('should pass through any parameters without validation', async () => {
    const result = await upscaleImage({
      imageUrl: 'https://example.com/image.jpg',
      model: 'fal-ai/clarity-upscaler',
      parameters: {
        // Discovery approach - try various parameter names
        scale: 8,
        upscaling_factor: 8,
        scale_factor: 8,
        num_steps: 50,
        num_inference_steps: 50,
        prompt: 'enhance details, sharp focus',
        guidance_prompt: 'high quality photo',
        style: 'photorealistic',
        style_preset: 'detailed',
        overlapping_factor: 0.5,
        restoration_weight: 0.7,
        denoise_strength: 0.3,
        seed: 42,
      },
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('https://fal.media/mock/');
  });

  it('should handle prompt-guided upscaling', async () => {
    const result = await upscaleImage({
      imageUrl: 'https://example.com/portrait.jpg',
      model: 'fal-ai/pasd',
      parameters: {
        prompt: 'professional photography, sharp details',
        scale: 4,
      },
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('.png');
  });

  it('should validate model format', async () => {
    const result = await upscaleImage({
      imageUrl: 'https://example.com/test.jpg',
      model: 'invalid-model',
      parameters: {},
    });

    expect(result.content[0].text).toContain('Invalid model ID format');
  });

  it('should handle missing image source', async () => {
    // @ts-expect-error - Testing error case
    const result = await upscaleImage({
      model: 'fal-ai/aura-sr',
      parameters: {},
    });

    expect(result.content[0].text).toContain('Either imageUrl or imagePath must be provided');
  });

  it('should handle minimal parameters', async () => {
    const result = await upscaleImage({
      imageUrl: 'https://example.com/small.jpg',
      model: 'fal-ai/aura-sr',
      parameters: {},
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('.png');
  });
});