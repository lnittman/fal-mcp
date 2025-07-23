import { describe, it, expect, beforeEach } from 'vitest';
import imageToImage from '../../tools/imageToImage';

describe('imageToImage', () => {
  beforeEach(() => {
    // Ensure we're in mock mode
    process.env.FAL_MCP_MOCK = 'true';
  });

  it('should transform image from URL', async () => {
    const result = await imageToImage({
      imageUrl: 'https://example.com/photo.jpg',
      prompt: 'convert to pixel art style',
      model: 'fal-ai/flux/dev/image-to-image',
      parameters: {},
    });

    expect(result).toBeDefined();
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('https://fal.media/mock/');
    expect(result.content[0].text).toContain('/image.png');
  });

  // Removed: Local file tests require fs-extra

  it('should work with any fal-ai model', async () => {
    const result = await imageToImage({
      imageUrl: 'https://example.com/test.png',
      prompt: 'anime style',
      model: 'fal-ai/new-style-transfer/v3',
      parameters: {
        strength: 0.8,
      },
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('https://fal.media/mock/');
  });

  it('should pass through any parameters without validation', async () => {
    const result = await imageToImage({
      imageUrl: 'https://example.com/image.jpg',
      prompt: 'cyberpunk style',
      model: 'fal-ai/flux/dev/image-to-image',
      parameters: {
        // Discovery approach - try various parameter names
        strength: 0.7,
        intensity: 0.7,
        style_strength: 0.7,
        mask_url: 'https://example.com/mask.png',
        mask: 'https://example.com/mask.png',
        reference_image: 'https://example.com/ref.jpg',
        style_reference: 'https://example.com/style.jpg',
        guidance_scale: 7.5,
        num_inference_steps: 50,
        seed: 42,
      },
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('https://fal.media/mock/');
  });

  it('should handle style transfer', async () => {
    const result = await imageToImage({
      imageUrl: 'https://example.com/portrait.jpg',
      prompt: 'in the style of Van Gogh',
      model: 'fal-ai/flux-pro/kontext',
      parameters: {
        style: 'impressionist',
      },
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('.png');
  });

  it('should validate model format', async () => {
    const result = await imageToImage({
      imageUrl: 'https://example.com/test.jpg',
      prompt: 'test',
      model: 'invalid-model',
      parameters: {},
    });

    expect(result.content[0].text).toContain('Invalid model ID format');
  });

  it('should handle missing image source', async () => {
    // @ts-expect-error - Testing error case
    const result = await imageToImage({
      prompt: 'test transformation',
      model: 'fal-ai/flux/dev/image-to-image',
      parameters: {},
    });

    expect(result.content[0].text).toContain('Either imageUrl or imagePath must be provided');
  });

  // Removed: Required field validation happens at MCP level
});