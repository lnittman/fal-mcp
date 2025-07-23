import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  submitToFal,
  extractImageUrl,
  extractVideoUrl,
  extractAudioUrl,
  formatMediaResult,
  formatError,
  validateModel,
} from '../../lib/utils/tool-base';

describe('tool-base utilities', () => {
  beforeEach(() => {
    process.env.FAL_MCP_MOCK = 'true';
  });

  describe('submitToFal', () => {
    it('should return mock response in mock mode', async () => {
      const result = await submitToFal(
        'fal-ai/flux/dev',
        { prompt: 'test' },
        'test-tool'
      );

      expect(result).toBeDefined();
      expect(result.images).toBeDefined();
      expect(result.images[0].url).toContain('https://fal.media/mock/');
    });

    it('should return appropriate mock for video models', async () => {
      const result = await submitToFal(
        'fal-ai/kling-video/v2',
        { prompt: 'test' },
        'test-tool'
      );

      expect(result.video).toBeDefined();
      expect(result.video.url).toContain('.mp4');
    });

    it('should return appropriate mock for audio models', async () => {
      const result = await submitToFal(
        'fal-ai/stable-audio',
        { prompt: 'test' },
        'test-tool'
      );

      expect(result.audio_url).toBeDefined();
      expect(result.audio_url).toContain('.mp3');
    });
  });

  describe('extractImageUrl', () => {
    it('should extract from images array', () => {
      const response = {
        images: [{ url: 'https://example.com/image.png' }],
      };
      const url = extractImageUrl(response, 'test');
      expect(url).toBe('https://example.com/image.png');
    });

    it('should extract from image object', () => {
      const response = {
        image: { url: 'https://example.com/image.png' },
      };
      const url = extractImageUrl(response, 'test');
      expect(url).toBe('https://example.com/image.png');
    });

    it('should extract from direct image string', () => {
      const response = {
        image: 'https://example.com/image.png',
      };
      const url = extractImageUrl(response, 'test');
      expect(url).toBe('https://example.com/image.png');
    });

    it('should extract from output.image', () => {
      const response = {
        output: { image: 'https://example.com/image.png' },
      };
      const url = extractImageUrl(response, 'test');
      expect(url).toBe('https://example.com/image.png');
    });

    it('should extract from url field', () => {
      const response = {
        url: 'https://example.com/image.png',
      };
      const url = extractImageUrl(response, 'test');
      expect(url).toBe('https://example.com/image.png');
    });

    it('should handle string response', () => {
      const response = 'https://example.com/image.png';
      const url = extractImageUrl(response, 'test');
      expect(url).toBe('https://example.com/image.png');
    });

    it('should throw error when no URL found', () => {
      const response = { nothing: 'here' };
      expect(() => extractImageUrl(response, 'test')).toThrow('No image URL found');
    });
  });

  describe('extractVideoUrl', () => {
    it('should extract from video object', () => {
      const response = {
        video: { url: 'https://example.com/video.mp4' },
      };
      const url = extractVideoUrl(response, 'test');
      expect(url).toBe('https://example.com/video.mp4');
    });

    it('should extract from videos array', () => {
      const response = {
        videos: [{ url: 'https://example.com/video.mp4' }],
      };
      const url = extractVideoUrl(response, 'test');
      expect(url).toBe('https://example.com/video.mp4');
    });

    it('should extract from output.video_url', () => {
      const response = {
        output: { video_url: 'https://example.com/video.mp4' },
      };
      const url = extractVideoUrl(response, 'test');
      expect(url).toBe('https://example.com/video.mp4');
    });

    it('should throw error when no URL found', () => {
      const response = { nothing: 'here' };
      expect(() => extractVideoUrl(response, 'test')).toThrow('No video URL found');
    });
  });

  describe('extractAudioUrl', () => {
    it('should extract from audio_url', () => {
      const response = {
        audio_url: 'https://example.com/audio.mp3',
      };
      const url = extractAudioUrl(response, 'test');
      expect(url).toBe('https://example.com/audio.mp3');
    });

    it('should extract from audio object', () => {
      const response = {
        audio: { url: 'https://example.com/audio.mp3' },
      };
      const url = extractAudioUrl(response, 'test');
      expect(url).toBe('https://example.com/audio.mp3');
    });

    it('should extract from audio array', () => {
      const response = {
        audio: [{ url: 'https://example.com/audio.mp3' }],
      };
      const url = extractAudioUrl(response, 'test');
      expect(url).toBe('https://example.com/audio.mp3');
    });

    it('should throw error when no URL found', () => {
      const response = { nothing: 'here' };
      expect(() => extractAudioUrl(response, 'test')).toThrow('No audio URL found');
    });
  });

  describe('formatMediaResult', () => {
    it('should format URL as MCP response', () => {
      const result = formatMediaResult('https://example.com/media.png');
      expect(result).toEqual({
        content: [
          { type: 'text', text: 'https://example.com/media.png' },
        ],
      });
    });
  });

  describe('formatError', () => {
    it('should format error message', () => {
      const error = new Error('Something went wrong');
      const result = formatError(error, 'Test error');
      expect(result.content[0].text).toContain('Test error');
      expect(result.content[0].text).toContain('Something went wrong');
    });

    it('should handle non-Error objects', () => {
      const error = { message: 'Custom error' };
      const result = formatError(error, 'Test error');
      expect(result.content[0].text).toContain('Custom error');
    });
  });

  describe('validateModel', () => {
    it('should accept valid fal-ai model IDs', async () => {
      await expect(validateModel('fal-ai/flux/dev', 'test')).resolves.not.toThrow();
      await expect(validateModel('fal-ai/some-model/v2', 'test')).resolves.not.toThrow();
    });

    it('should reject invalid model IDs', async () => {
      await expect(validateModel('invalid-model', 'test')).rejects.toThrow('Invalid model ID format');
      await expect(validateModel('', 'test')).rejects.toThrow('Invalid model ID format');
    });
  });
});