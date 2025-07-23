import { describe, it, expect, beforeEach } from 'vitest';
import backgroundRemoval from '../../tools/backgroundRemoval';

describe('backgroundRemoval', () => {
  beforeEach(() => {
    // Ensure we're in mock mode
    process.env.FAL_MCP_MOCK = 'true';
  });

  it('should remove background from image URL', async () => {
    const result = await backgroundRemoval({
      imageUrl: 'https://example.com/photo.jpg',
      model: 'fal-ai/birefnet',
      parameters: {},
    });

    expect(result).toBeDefined();
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('https://fal.media/mock/');
    expect(result.content[0].text).toContain('/image.png');
  });

  // Removed: Local file tests require fs-extra

  it('should work with any fal-ai background removal model', async () => {
    const result = await backgroundRemoval({
      imageUrl: 'https://example.com/object.png',
      model: 'fal-ai/new-bg-remover/v2',
      parameters: {
        quality: 'high',
      },
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('https://fal.media/mock/');
  });

  it('should pass through any parameters without validation', async () => {
    const result = await backgroundRemoval({
      imageUrl: 'https://example.com/product.jpg',
      model: 'fal-ai/imageutils/rembg',
      parameters: {
        // Discovery approach - try various parameter names
        return_mask: true,
        include_mask: true,
        output_mask: true,
        output_format: 'png',
        format: 'png',
        file_format: 'png',
        quality: 'high',
        precision: 'high',
        mode: 'precise',
        alpha_matting: true,
        alpha_channel: true,
        transparency: true,
      },
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('https://fal.media/mock/');
  });

  it('should handle different output formats', async () => {
    const result = await backgroundRemoval({
      imageUrl: 'https://example.com/test.jpg',
      model: 'fal-ai/birefnet',
      parameters: {
        output_format: 'webp',
      },
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('.png'); // Mock always returns .png
  });

  it('should validate model format', async () => {
    const result = await backgroundRemoval({
      imageUrl: 'https://example.com/test.jpg',
      model: 'invalid-model',
      parameters: {},
    });

    expect(result.content[0].text).toContain('Invalid model ID format');
  });

  it('should handle missing image source', async () => {
    // @ts-expect-error - Testing error case
    const result = await backgroundRemoval({
      model: 'fal-ai/birefnet',
      parameters: {},
    });

    expect(result.content[0].text).toContain('Either imageUrl or imagePath must be provided');
  });

  it('should handle minimal parameters', async () => {
    const result = await backgroundRemoval({
      imageUrl: 'https://example.com/simple.jpg',
      model: 'fal-ai/birefnet',
      parameters: {},
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('.png');
  });
});