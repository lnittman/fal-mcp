import * as fsExtra from "fs-extra";
import { beforeEach, describe, expect, it, vi } from "vitest";
import modelDocs from "../../tools/modelDocs";

// Mock fs-extra module
vi.mock("fs-extra", () => ({
  default: {
    readFile: vi.fn(),
    pathExists: vi.fn(),
  },
  readFile: vi.fn(),
  pathExists: vi.fn(),
}));

describe("modelDocs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve documentation for a model", async () => {
    const mockDocs = `# FLUX Dev Model

## Parameters
- prompt: Text description
- image_size: Image dimensions
- num_inference_steps: Quality steps`;

    // Mock that the file exists
    vi.mocked(fsExtra.pathExists).mockResolvedValue(true);
    vi.mocked(fsExtra.default.pathExists).mockResolvedValue(true);

    // Mock reading the file
    vi.mocked(fsExtra.readFile).mockResolvedValue(mockDocs);
    vi.mocked(fsExtra.default.readFile).mockResolvedValue(Buffer.from(mockDocs));

    const result = await modelDocs({
      modelId: "fal-ai/flux/dev",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("FLUX Dev Model");
    expect(result.content[0].text).toContain("Parameters");
  });

  it("should handle missing documentation gracefully", async () => {
    // Mock that the file doesn't exist
    vi.mocked(fsExtra.pathExists).mockResolvedValue(false);
    vi.mocked(fsExtra.default.pathExists).mockResolvedValue(false);

    const result = await modelDocs({
      modelId: "fal-ai/new-undocumented-model",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("No specific documentation found");
    expect(result.content[0].text).toContain("fal-ai/new-undocumented-model");
  });

  it("should convert model IDs to filenames correctly", async () => {
    vi.mocked(fsExtra.pathExists).mockResolvedValue(true);
    vi.mocked(fsExtra.default.pathExists).mockResolvedValue(true);
    vi.mocked(fsExtra.readFile).mockResolvedValue("Test docs");
    vi.mocked(fsExtra.default.readFile).mockResolvedValue(Buffer.from("Test docs"));

    await modelDocs({
      modelId: "fal-ai/flux-pro/v1.1-ultra",
    });

    // Check that the file path was constructed correctly
    const calls = vi.mocked(fsExtra.readFile).mock.calls;
    const defaultCalls = vi.mocked(fsExtra.default.readFile).mock.calls;
    expect(calls.length > 0 || defaultCalls.length > 0).toBe(true);
    if (calls.length > 0) {
      expect(String(calls[0][0])).toContain("flux-pro-v1.1-ultra.md");
    } else {
      expect(String(defaultCalls[0][0])).toContain("flux-pro-v1.1-ultra.md");
    }
  });

  it("should handle models with complex names", async () => {
    vi.mocked(fsExtra.pathExists).mockResolvedValue(true);
    vi.mocked(fsExtra.default.pathExists).mockResolvedValue(true);
    vi.mocked(fsExtra.readFile).mockResolvedValue("Complex model docs");
    vi.mocked(fsExtra.default.readFile).mockResolvedValue(Buffer.from("Complex model docs"));

    const result = await modelDocs({
      modelId: "fal-ai/stable-diffusion-xl/lightning-4step",
    });

    expect(result).toBeDefined();
    const calls = vi.mocked(fsExtra.readFile).mock.calls;
    const defaultCalls = vi.mocked(fsExtra.default.readFile).mock.calls;
    expect(calls.length > 0 || defaultCalls.length > 0).toBe(true);
  });
});
