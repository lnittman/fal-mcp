import { describe, it, expect, beforeEach } from 'vitest';
import audioToAudio from '../../tools/audioToAudio';

describe('audioToAudio', () => {
  beforeEach(() => {
    // Ensure we're in mock mode
    process.env.FAL_MCP_MOCK = 'true';
  });

  it('should transform audio files', async () => {
    const result = await audioToAudio({
      audioUrl: 'https://example.com/song.mp3',
      model: 'fal-ai/playai/inpaint/diffusion',
      parameters: {},
    });

    expect(result).toBeDefined();
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('https://fal.media/mock/');
    expect(result.content[0].text).toContain('.mp3');
  });

  it('should work with any fal-ai audio transformation model', async () => {
    const result = await audioToAudio({
      audioUrl: 'https://example.com/voice.wav',
      model: 'fal-ai/new-audio-transform/v2',
      parameters: {
        prompt: 'remove background noise',
      },
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('https://fal.media/mock/');
  });

  it('should pass through any parameters without validation', async () => {
    const result = await audioToAudio({
      audioUrl: 'https://example.com/music.mp3',
      model: 'fal-ai/playai/inpaint/diffusion',
      parameters: {
        // Discovery approach - try various parameter names
        prompt: 'isolate vocals',
        strength: 0.8,
        intensity: 0.8,
        start_time: 10,
        startTime: 10,
        begin: 10,
        end_time: 30,
        endTime: 30,
        finish: 30,
        isolate: 'vocals',
        remove: 'instruments',
        mode: 'inpaint',
        operation: 'isolate',
        target_voice: 'female',
        voice_type: 'soprano',
      },
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('https://fal.media/mock/');
  });

  it('should handle voice modification', async () => {
    const result = await audioToAudio({
      audioUrl: 'https://example.com/speech.wav',
      model: 'fal-ai/voice-changer',
      parameters: {
        target_voice: 'deep male',
        strength: 0.7,
      },
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('.mp3');
  });

  it('should handle audio extension', async () => {
    const result = await audioToAudio({
      audioUrl: 'https://example.com/short-clip.mp3',
      model: 'fal-ai/audio-extend',
      parameters: {
        mode: 'outpaint',
        duration_extension: 10,
      },
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('.mp3');
  });

  it('should validate model format', async () => {
    const result = await audioToAudio({
      audioUrl: 'https://example.com/audio.mp3',
      model: 'invalid-model',
      parameters: {},
    });

    expect(result.content[0].text).toContain('Invalid model ID format');
  });

  // Note: Required field validation happens at the schema level before our code runs
  // In real usage, the MCP framework validates required fields
});