import { describe, it, expect, beforeEach } from 'vitest';
import imageToJson from '../../tools/imageToJson';

describe('imageToJson', () => {
  beforeEach(() => {
    // Ensure we're in mock mode
    process.env.FAL_MCP_MOCK = 'true';
  });

  it('should analyze image and return structured data', async () => {
    const result = await imageToJson({
      imageUrl: 'https://example.com/chart.png',
      model: 'fal-ai/bagel/understand',
    });

    expect(result).toBeDefined();
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('Mock analysis');
  });

  it('should work with any fal-ai vision model', async () => {
    const result = await imageToJson({
      imageUrl: 'https://example.com/photo.jpg',
      prompt: 'What objects are in this image?',
      model: 'fal-ai/new-vision-model/v2',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('Mock analysis');
  });

  it('should handle different output formats', async () => {
    const result = await imageToJson({
      imageUrl: 'https://example.com/data.png',
      prompt: 'Extract all text from this image',
      outputFormat: 'json',
      model: 'fal-ai/bagel/understand',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('Mock analysis');
  });

  it('should pass through prompt parameter variations', async () => {
    const result = await imageToJson({
      imageUrl: 'https://example.com/scene.jpg',
      prompt: 'Describe the mood and atmosphere',
      model: 'fal-ai/bagel/understand',
      outputFormat: 'structured',
    });

    expect(result).toBeDefined();
    // Tool should try multiple parameter names internally:
    // prompt, question, query, text
    expect(result.content[0].text).toContain('Mock analysis');
  });

  it('should handle object detection prompts', async () => {
    const result = await imageToJson({
      imageUrl: 'https://example.com/crowd.jpg',
      prompt: 'Count the number of people and describe what they are doing',
      model: 'fal-ai/bagel/understand',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('Mock analysis');
  });

  it('should handle raw output format', async () => {
    const result = await imageToJson({
      imageUrl: 'https://example.com/image.jpg',
      outputFormat: 'raw',
      model: 'fal-ai/bagel/understand',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('Mock analysis');
  });

  it('should use default prompt when not provided', async () => {
    const result = await imageToJson({
      imageUrl: 'https://example.com/test.jpg',
      model: 'fal-ai/bagel/understand',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('Mock analysis');
  });

  it('should validate model format', async () => {
    const result = await imageToJson({
      imageUrl: 'https://example.com/test.jpg',
      model: 'invalid-model',
    });

    expect(result.content[0].text).toContain('Invalid model ID format');
  });

  // Removed: Required field validation happens at MCP level

  it('should handle content moderation prompts', async () => {
    const result = await imageToJson({
      imageUrl: 'https://example.com/content.jpg',
      prompt: 'Is this image safe for work? Explain why',
      model: 'fal-ai/bagel/understand',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('Mock analysis');
  });

  it('should handle chart analysis', async () => {
    const result = await imageToJson({
      imageUrl: 'https://example.com/chart.png',
      prompt: 'Extract all data points from this chart',
      outputFormat: 'json',
      model: 'fal-ai/bagel/understand',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('Mock analysis');
  });
});
