import * as fs from "fs-extra";
import { beforeEach, describe, expect, it, vi } from "vitest";
import saveImage from "../../tools/saveImage";

// Mock modules
vi.mock("fs-extra", async () => {
  return {
    default: {
      ensureDir: vi.fn(),
      writeFile: vi.fn(),
      stat: vi.fn().mockResolvedValue({ size: 1024 }),
    },
    ensureDir: vi.fn(),
    writeFile: vi.fn(),
    stat: vi.fn().mockResolvedValue({ size: 1024 }),
  };
});

vi.mock("os", () => ({
  default: {
    homedir: vi.fn(() => "/home/user"),
  },
  homedir: vi.fn(() => "/home/user"),
}));

// Mock fetch
global.fetch = vi.fn();

// Mock sharp
vi.mock("sharp", () => {
  return {
    default: vi.fn(() => ({
      resize: vi.fn().mockReturnThis(),
      toFormat: vi.fn().mockReturnThis(),
      toBuffer: vi.fn().mockResolvedValue(Buffer.from("processed-image")),
    })),
  };
});

describe("saveImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful fetch
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
    } as any);

    // Mock fs-extra functions
    vi.mocked(fs.ensureDir).mockResolvedValue(undefined);
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);
    vi.mocked(fs.stat).mockResolvedValue({ size: 1024 } as any);
    vi.mocked(fs.default.ensureDir).mockResolvedValue(undefined);
    vi.mocked(fs.default.writeFile).mockResolvedValue(undefined);
    vi.mocked(fs.default.stat).mockResolvedValue({ size: 1024 } as any);
  });

  it("should save image from URL to local path", async () => {
    const result = await saveImage({
      imageUrl: "https://example.com/image.jpg",
      outputPath: "~/Desktop/saved.jpg",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("Saved image to:");
    expect(result.content[0].text).toContain("/home/user/Desktop/saved.jpg");
    expect(result.content[0].text).toContain("1.0 KB");
  });

  it("should resize image when dimensions provided", async () => {
    const result = await saveImage({
      imageUrl: "https://example.com/large.png",
      outputPath: "~/Desktop/thumbnail.png",
      width: 100,
      height: 100,
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("Saved image to:");
  });

  it("should convert image format", async () => {
    const result = await saveImage({
      imageUrl: "https://example.com/photo.jpg",
      outputPath: "~/Desktop/converted.webp",
      format: "webp",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("Saved image to:");
    expect(result.content[0].text).toContain(".webp");
  });

  it("should handle favicon sizes", async () => {
    const result = await saveImage({
      imageUrl: "https://example.com/logo.png",
      outputPath: "~/Desktop/favicon.ico",
      width: 32,
      height: 32,
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("Saved image to:");
  });

  it("should handle fetch errors", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 404,
    } as any);

    const result = await saveImage({
      imageUrl: "https://example.com/missing.jpg",
      outputPath: "~/Desktop/test.jpg",
    });

    expect(result.content[0].text).toContain("Failed to download image: 404");
  });

  // Removed: Required field validation happens at MCP level

  it("should create directories if they don't exist", async () => {
    const result = await saveImage({
      imageUrl: "https://example.com/image.jpg",
      outputPath: "~/new/deep/path/image.jpg",
    });

    expect(result).toBeDefined();
  });
});
