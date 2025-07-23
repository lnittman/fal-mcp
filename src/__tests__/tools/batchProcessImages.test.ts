import { describe, it, expect, beforeEach, vi } from 'vitest';
import batchProcessImages from '../../tools/batchProcessImages';
import * as path from 'path';

// Mock fs-extra module
vi.mock('fs-extra', () => ({
  default: {
    pathExists: vi.fn(),
    readdir: vi.fn(),
    readFile: vi.fn(),
    writeFile: vi.fn(),
    mkdir: vi.fn(),
  },
  pathExists: vi.fn(),
  readdir: vi.fn(),
  readFile: vi.fn(),
  writeFile: vi.fn(),
  mkdir: vi.fn(),
}));

// Import fs-extra to use in tests
import fs from 'fs-extra';

describe('batchProcessImages', () => {
  beforeEach(() => {
    // Ensure we're in mock mode
    process.env.FAL_MCP_MOCK = 'true';
    vi.clearAllMocks();
  });

  it('should process all images in a directory', async () => {
    // Mock directory exists
    vi.mocked(fs.pathExists).mockResolvedValue(true);
    
    // Mock directory listing
    vi.mocked(fs.readdir).mockResolvedValue([
      'image1.jpg',
      'image2.png',
      'text.txt',
      'image3.webp',
    ] as any);

    // Mock file reading
    vi.mocked(fs.readFile).mockResolvedValue(Buffer.from('fake-image-data'));

    const result = await batchProcessImages({
      directory: '~/test-images',
      actionPrompt: 'convert to pixel art',
      model: 'fal-ai/flux-general/image-to-image',
      outputSuffix: '_pixel',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('Processed 3/3 images');
  });

  it('should work with any fal-ai model', async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(true);
    vi.mocked(fs.readdir).mockResolvedValue(['test.jpg'] as any);
    vi.mocked(fs.readFile).mockResolvedValue(Buffer.from('fake-image-data'));

    const result = await batchProcessImages({
      directory: '~/images',
      actionPrompt: 'vintage style',
      model: 'fal-ai/new-style-model/v2',
      strength: 0.7,
      outputFormat: 'webp',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('Processed 1/1 images');
  });

  it('should handle empty directory', async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(true);
    vi.mocked(fs.readdir).mockResolvedValue([]);

    const result = await batchProcessImages({
      directory: '~/empty-folder',
      actionPrompt: 'test',
      model: 'fal-ai/flux-general/image-to-image',
    });

    expect(result.content[0].text).toContain('No image files found');
  });

  it('should handle directory with no images', async () => {
    vi.mocked(fs.readdir).mockResolvedValue([
      { name: 'document.pdf', isFile: () => true } as any,
      { name: 'text.txt', isFile: () => true } as any,
    ]);

    const result = await batchProcessImages({
      directory: '~/documents',
      actionPrompt: 'test',
      model: 'fal-ai/flux-general/image-to-image',
    });

    expect(result.content[0].text).toContain('No image files found');
  });

  it('should validate model format', async () => {
    const result = await batchProcessImages({
      directory: '~/images',
      actionPrompt: 'test',
      model: 'invalid-model',
    });

    expect(result.content[0].text).toContain('Invalid model ID format');
  });

});