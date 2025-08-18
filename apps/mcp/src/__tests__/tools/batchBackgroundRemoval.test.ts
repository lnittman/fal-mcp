import { beforeEach, describe, expect, it, vi } from "vitest";
import batchBackgroundRemoval from "../../tools/batchBackgroundRemoval";

// Mock fs-extra module
vi.mock("fs-extra", () => ({
  default: {
    pathExists: vi.fn(),
    readdir: vi.fn(),
    readFile: vi.fn(),
    writeFile: vi.fn(),
    mkdir: vi.fn(),
    access: vi.fn(),
  },
  pathExists: vi.fn(),
  readdir: vi.fn(),
  readFile: vi.fn(),
  writeFile: vi.fn(),
  mkdir: vi.fn(),
  access: vi.fn(),
}));

// Import fs-extra to use in tests
import fs from "fs-extra";

describe("batchBackgroundRemoval", () => {
  beforeEach(() => {
    // Ensure we're in mock mode
    process.env.FAL_MCP_MOCK = "true";
    vi.clearAllMocks();
  });

  it("should remove backgrounds from all images in directory", async () => {
    // Mock directory exists
    vi.mocked(fs.pathExists).mockResolvedValue(true);

    // Mock directory listing
    vi.mocked(fs.readdir).mockResolvedValue([
      "product1.jpg",
      "product2.png",
      "readme.txt",
      "product3.webp",
    ] as any);

    // Mock file reading
    vi.mocked(fs.readFile).mockResolvedValue(Buffer.from("fake-image-data"));

    // Mock output file doesn't exist
    vi.mocked(fs.pathExists)
      .mockResolvedValueOnce(true) // directory exists
      .mockResolvedValue(false); // output files don't exist

    const result = await batchBackgroundRemoval({
      directory: "~/product-photos",
      model: "fal-ai/birefnet",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("Removed backgrounds from 3/3 images");
  });

  it("should work with any fal-ai background removal model", async () => {
    vi.mocked(fs.pathExists)
      .mockResolvedValue(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValue(false);
    vi.mocked(fs.readdir).mockResolvedValue(["test.jpg"] as any);
    vi.mocked(fs.readFile).mockResolvedValue(Buffer.from("fake-image-data"));

    const result = await batchBackgroundRemoval({
      directory: "~/images",
      model: "fal-ai/new-remover/v3",
      outputFormat: "webp",
      outputSuffix: "_transparent",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("Removed backgrounds from 1/1 images");
  });

  it("should handle empty directory", async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(true);
    vi.mocked(fs.readdir).mockResolvedValue([]);

    const result = await batchBackgroundRemoval({
      directory: "~/empty-folder",
      model: "fal-ai/birefnet",
    });

    expect(result.content[0].text).toContain("No image files found");
  });

  it("should skip existing files when overwrite is false", async () => {
    vi.mocked(fs.readdir).mockResolvedValue(["image1.jpg", "image2.jpg"] as any);
    vi.mocked(fs.readFile).mockResolvedValue(Buffer.from("fake-image-data"));

    // Mock directory exists, then file existence checks
    vi.mocked(fs.pathExists)
      .mockResolvedValueOnce(true) // directory exists
      .mockResolvedValueOnce(true) // image1_nobg.png exists
      .mockResolvedValueOnce(false); // image2_nobg.png doesn't exist

    const result = await batchBackgroundRemoval({
      directory: "~/images",
      model: "fal-ai/birefnet",
      overwrite: false,
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("Removed backgrounds from 1/2 images");
    expect(result.content[0].text).toContain("1 skipped");
  });

  it("should handle custom output settings", async () => {
    vi.mocked(fs.pathExists)
      .mockResolvedValue(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValue(false);
    vi.mocked(fs.readdir).mockResolvedValue(["photo.jpg"] as any);
    vi.mocked(fs.readFile).mockResolvedValue(Buffer.from("fake-image-data"));

    const result = await batchBackgroundRemoval({
      directory: "~/photos",
      model: "fal-ai/imageutils/rembg",
      outputFormat: "webp",
      outputSuffix: "_cutout",
      overwrite: true,
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("Removed backgrounds from 1/1 images");
  });

  it("should validate model format", async () => {
    const result = await batchBackgroundRemoval({
      directory: "~/images",
      model: "invalid-model",
    });

    expect(result.content[0].text).toContain("Invalid model ID format");
  });

  // Removed: Required field validation happens at MCP level

  it("should only process image files", async () => {
    vi.mocked(fs.pathExists)
      .mockResolvedValue(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValue(false);
    vi.mocked(fs.readdir).mockResolvedValue([
      "image.jpg",
      "document.pdf",
      "video.mp4",
      "image.png",
      "subfolder",
    ] as any);
    vi.mocked(fs.readFile).mockResolvedValue(Buffer.from("fake-image-data"));

    const result = await batchBackgroundRemoval({
      directory: "~/mixed-files",
      model: "fal-ai/birefnet",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("Removed backgrounds from 2/2 images");
  });
});
