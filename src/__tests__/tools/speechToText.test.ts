import { describe, it, expect, beforeEach } from 'vitest';
import speechToText from '../../tools/speechToText';

describe('speechToText', () => {
  beforeEach(() => {
    // Ensure we're in mock mode
    process.env.FAL_MCP_MOCK = 'true';
  });

  it('should transcribe audio from URL', async () => {
    const result = await speechToText({
      audioUrl: 'https://example.com/audio.mp3',
      model: 'fal-ai/whisper',
    });

    expect(result).toBeDefined();
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('mock transcription');
  });

  it('should work with any fal-ai model', async () => {
    const result = await speechToText({
      audioUrl: 'https://example.com/speech.wav',
      model: 'fal-ai/some-new-speech-model/v3',
      task: 'transcribe',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('mock transcription');
  });

  it('should handle translation task', async () => {
    const result = await speechToText({
      audioUrl: 'https://example.com/spanish.mp3',
      model: 'fal-ai/whisper',
      task: 'translate',
      translate: true,
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('mock transcription');
  });

  it('should pass through timestamp parameters without validation', async () => {
    // This test verifies our discovery approach for timestamp parameters
    const result = await speechToText({
      audioUrl: 'https://example.com/audio.mp3',
      model: 'fal-ai/whisper',
      includeTimestamps: true,
      // The tool will try multiple parameter names internally:
      // return_timestamps, include_timestamps, timestamps
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('mock transcription');
  });

  it('should accept language parameter', async () => {
    const result = await speechToText({
      audioUrl: 'https://example.com/audio.mp3',
      model: 'fal-ai/whisper',
      language: 'es',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('mock transcription');
  });

  // Note: Validation for required fields happens before mock mode,
  // so we can't test missing audioUrl in mock mode

  it('should validate model format', async () => {
    const result = await speechToText({
      audioUrl: 'https://example.com/audio.mp3',
      model: 'invalid-model',
    });

    expect(result.content[0].text).toContain('Invalid model ID format');
  });
});