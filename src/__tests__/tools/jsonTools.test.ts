import { describe, it, expect, beforeEach } from 'vitest';
import { ffmpegLoudnorm, ffmpegWaveform, ffmpegMetadata } from '../../tools/jsonTools';

describe('jsonTools - FFmpeg utilities', () => {
  beforeEach(() => {
    // Ensure we're in mock mode
    process.env.FAL_MCP_MOCK = 'true';
  });

  describe('ffmpegLoudnorm', () => {
    it('should analyze audio loudness', async () => {
      const result = await ffmpegLoudnorm({
        audioUrl: 'https://example.com/audio.mp3',
      });

      expect(result).toBeDefined();
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      // Mock returns JSON string
      const data = JSON.parse(result.content[0].text);
      expect(data).toBeDefined();
    });
  });

  describe('ffmpegWaveform', () => {
    it('should generate waveform data', async () => {
      const result = await ffmpegWaveform({
        audioUrl: 'https://example.com/audio.mp3',
        durationSeconds: 60,
        pixelsPerSecond: 10,
      });

      expect(result).toBeDefined();
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
    });
  });

  describe('ffmpegMetadata', () => {
    it('should extract media metadata', async () => {
      const result = await ffmpegMetadata({
        mediaUrl: 'https://example.com/video.mp4',
      });

      expect(result).toBeDefined();
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
    });
  });
});