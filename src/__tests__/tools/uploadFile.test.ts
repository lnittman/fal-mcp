import { beforeEach, describe, expect, it } from "vitest";
import uploadFile from "../../tools/uploadFile";

describe("uploadFile", () => {
  beforeEach(() => {
    // Ensure we're in mock mode
    process.env.FAL_MCP_MOCK = "true";
  });

  it("should upload a file and return URL", async () => {
    const result = await uploadFile({
      filePath: "/tmp/test-image.png",
    });

    expect(result).toBeDefined();
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain("https://fal.media/mock/");
    expect(result.content[0].text).toContain("File uploaded successfully");
  });

  it("should handle file with custom content type", async () => {
    const result = await uploadFile({
      filePath: "/tmp/document.pdf",
      contentType: "application/pdf",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("https://fal.media/mock/");
    expect(result.content[0].text).toContain("application/pdf");
  });

  it("should expand home directory path", async () => {
    const result = await uploadFile({
      filePath: "~/test-file.jpg",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("https://fal.media/mock/");
    expect(result.content[0].text).toContain("test-file.jpg");
  });

  it("should work with various file types", async () => {
    const fileTypes = [
      { path: "/tmp/image.jpg", type: "image/jpeg" },
      { path: "/tmp/video.mp4", type: "video/mp4" },
      { path: "/tmp/audio.mp3", type: "audio/mpeg" },
      { path: "/tmp/data.json", type: "application/json" },
    ];

    for (const file of fileTypes) {
      const result = await uploadFile({
        filePath: file.path,
      });

      expect(result).toBeDefined();
      expect(result.content[0].text).toContain("https://fal.media/mock/");
    }
  });

  it("should support large files", async () => {
    const result = await uploadFile({
      filePath: "/tmp/large-video.mov",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("https://fal.media/mock/");
    expect(result.content[0].text).toContain("large-video.mov");
  });

  it("should handle files without extension", async () => {
    const result = await uploadFile({
      filePath: "/tmp/no-extension-file",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("https://fal.media/mock/");
    expect(result.content[0].text).toContain("no-extension-file");
  });
});