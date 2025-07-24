import { describe, it, expect, beforeEach } from 'vitest';
import courseModels from '../../tools/courseModels';

describe('courseModels', () => {
  beforeEach(() => {
    // Ensure we're in mock mode
    process.env.FAL_MCP_MOCK = 'true';
  });

  it('should provide general course introduction', async () => {
    const result = await courseModels({});

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('Welcome to the fal.ai Interactive Demo');
    expect(result.content[0].text).toMatch(/[1-4]\. .*?\n/);
  });

  it('should provide image generation course', async () => {
    const result = await courseModels({
      topic: 'image generation',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('Image Generation Course');
    expect(result.content[0].text).toContain('textToImage');
    expect(result.content[0].text).toContain('imageToImage');
  });

  it('should provide video creation course', async () => {
    const result = await courseModels({
      topic: 'video',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('Video Creation Course');
    expect(result.content[0].text).toContain('textToVideo');
    expect(result.content[0].text).toContain('imageToVideo');
  });

  it('should provide audio production course', async () => {
    const result = await courseModels({
      topic: 'audio',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('Audio Production Course');
    expect(result.content[0].text).toContain('textToSpeech');
    expect(result.content[0].text).toContain('textToAudio');
  });

  it('should provide batch processing course', async () => {
    const result = await courseModels({
      topic: 'batch',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('Batch Processing Course');
    expect(result.content[0].text).toContain('batchProcessImages');
    expect(result.content[0].text).toContain('workflowChain');
  });

  it('should handle numeric topic selection', async () => {
    const result = await courseModels({
      topic: '1',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('Image Generation Course');
  });
});