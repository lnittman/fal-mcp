import { describe, it, expect, beforeEach, vi } from 'vitest';
import modelDocs from '../../tools/modelDocs';
import * as fs from 'fs/promises';
import * as path from 'path';

// Mock fs module
vi.mock('fs/promises', () => ({
  readFile: vi.fn(),
  access: vi.fn(),
}));

describe('modelDocs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should retrieve documentation for a model', async () => {
    const mockDocs = `# FLUX Dev Model

## Parameters
- prompt: Text description
- image_size: Image dimensions
- num_inference_steps: Quality steps`;

    vi.mocked(fs.access).mockResolvedValue(undefined);
    vi.mocked(fs.readFile).mockResolvedValue(mockDocs);

    const result = await modelDocs({
      modelId: 'fal-ai/flux/dev',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('FLUX Dev Model');
    expect(result.content[0].text).toContain('Parameters');
  });

  it('should handle missing documentation gracefully', async () => {
    vi.mocked(fs.access).mockRejectedValue(new Error('File not found'));

    const result = await modelDocs({
      modelId: 'fal-ai/new-undocumented-model',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('No specific documentation found');
    expect(result.content[0].text).toContain('fal-ai/new-undocumented-model');
  });

  it('should convert model IDs to filenames correctly', async () => {
    vi.mocked(fs.access).mockResolvedValue(undefined);
    vi.mocked(fs.readFile).mockResolvedValue('Test docs');

    await modelDocs({
      modelId: 'fal-ai/flux-pro/v1.1-ultra',
    });

    // Check that the file path was constructed correctly
    const calls = vi.mocked(fs.readFile).mock.calls;
    expect(calls[0][0]).toContain('flux-pro-v1.1-ultra.md');
  });

  it('should handle models with complex names', async () => {
    vi.mocked(fs.access).mockResolvedValue(undefined);
    vi.mocked(fs.readFile).mockResolvedValue('Complex model docs');

    const result = await modelDocs({
      modelId: 'fal-ai/stable-diffusion-xl/lightning-4step',
    });

    expect(result).toBeDefined();
    const calls = vi.mocked(fs.readFile).mock.calls;
    expect(calls[0][0]).toContain('stable-diffusion-xl-lightning-4step.md');
  });

});