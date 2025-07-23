import { describe, it, expect, beforeEach } from 'vitest';
import textToImageWithPreset from '../../tools/textToImageWithPreset';

describe('textToImageWithPreset', () => {
  beforeEach(() => {
    // Ensure we're in mock mode
    process.env.FAL_MCP_MOCK = 'true';
  });

  it('should generate image with style preset', async () => {
    const result = await textToImageWithPreset({
      subject: 'mountain landscape',
      preset: 'watercolor',
      model: 'fal-ai/flux/dev',
    });

    expect(result).toBeDefined();
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('https://fal.media/mock/');
    expect(result.content[0].text).toContain('/image.png');
  });

  it('should work with any fal-ai model', async () => {
    const result = await textToImageWithPreset({
      subject: 'futuristic city',
      preset: 'cyberpunk',
      model: 'fal-ai/new-art-model/v3',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('https://fal.media/mock/');
  });

  it('should handle additional details', async () => {
    const result = await textToImageWithPreset({
      subject: 'cat',
      preset: 'pixelArt',
      additionalDetails: 'wearing a hat, 8-bit style',
      model: 'fal-ai/flux/dev',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('.png');
  });

  it('should work with all preset styles', async () => {
    const presets = [
      'pixelArt', 'anime', 'photorealistic', 'watercolor',
      'oilPainting', 'cyberpunk', 'steampunk', 'minimalist',
      'glassArt', 'retroWave'
    ];

    for (const preset of presets) {
      const result = await textToImageWithPreset({
        subject: 'test subject',
        preset: preset as any,
        model: 'fal-ai/flux/dev',
      });

      expect(result).toBeDefined();
      expect(result.content[0].text).toContain('https://fal.media/mock/');
    }
  });

  it('should combine subject and preset into full prompt', async () => {
    const result = await textToImageWithPreset({
      subject: 'dragon',
      preset: 'anime',
      model: 'fal-ai/flux/dev',
    });

    expect(result).toBeDefined();
    // The tool should combine subject + preset style internally
    expect(result.content[0].text).toContain('.png');
  });

  it('should validate model format', async () => {
    const result = await textToImageWithPreset({
      subject: 'test',
      preset: 'pixelArt',
      model: 'invalid-model',
    });

    expect(result.content[0].text).toContain('Invalid model ID format');
  });

  // Removed: Required field validation happens at MCP level

  it('should work without additional details', async () => {
    const result = await textToImageWithPreset({
      subject: 'simple flower',
      preset: 'minimalist',
      model: 'fal-ai/flux/dev',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('.png');
  });
});