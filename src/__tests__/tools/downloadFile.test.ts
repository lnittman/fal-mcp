import { beforeEach, describe, expect, it } from "vitest";
import downloadFile from "../../tools/downloadFile";

describe("downloadFile", () => {
  beforeEach(() => {
    // Ensure we're in mock mode
    process.env.FAL_MCP_MOCK = "true";
  });

  it("should download file from URL", async () => {
    const result = await downloadFile({
      url: "https://fal.media/files/test-image.png",
      outputPath: "/tmp/downloaded-image.png",
    });

    expect(result).toBeDefined();
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain("Downloaded successfully");
    expect(result.content[0].text).toContain("/tmp/downloaded-image.png");
  });

  it("should handle fal.ai storage URLs", async () => {
    const result = await downloadFile({
      url: "https://fal.media/files/zebra/abc123_image.png",
      outputPath: "~/Downloads/result.png",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("Downloaded successfully");
    expect(result.content[0].text).toContain("result.png");
  });

  it("should handle overwrite option", async () => {
    const result = await downloadFile({
      url: "https://example.com/file.pdf",
      outputPath: "/tmp/existing.pdf",
      overwrite: true,
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("Downloaded successfully");
  });

  it("should work with various file types", async () => {
    const downloads = [
      { url: "https://example.com/image.jpg", output: "/tmp/img.jpg" },
      { url: "https://example.com/video.mp4", output: "/tmp/vid.mp4" },
      { url: "https://example.com/audio.mp3", output: "/tmp/aud.mp3" },
      { url: "https://example.com/data.json", output: "/tmp/data.json" },
    ];

    for (const dl of downloads) {
      const result = await downloadFile({
        url: dl.url,
        outputPath: dl.output,
      });

      expect(result).toBeDefined();
      expect(result.content[0].text).toContain("Downloaded successfully");
    }
  });

  it("should support home directory expansion", async () => {
    const result = await downloadFile({
      url: "https://example.com/doc.pdf",
      outputPath: "~/Documents/download.pdf",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("Downloaded successfully");
    expect(result.content[0].text).toContain("Documents/download.pdf");
  });

  it("should download from various URL formats", async () => {
    const urls = [
      "https://fal.media/files/test.png",
      "https://example.com/api/download/file.zip",
      "https://cdn.example.com/assets/image.jpg",
      "http://localhost:3000/file.txt",
    ];

    for (const url of urls) {
      const result = await downloadFile({
        url,
        outputPath: "/tmp/test-download",
      });

      expect(result).toBeDefined();
      expect(result.content[0].text).toContain("Downloaded successfully");
    }
  });

  it("should handle large files", async () => {
    const result = await downloadFile({
      url: "https://example.com/large-file.zip",
      outputPath: "/tmp/big-download.zip",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("Downloaded successfully");
    expect(result.content[0].text).toContain("2.3 MB");
  });
});