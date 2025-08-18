import { beforeEach, describe, expect, it } from "vitest";
import imageToVideo from "../../tools/imageToVideo";

describe("imageToVideo", () => {
  beforeEach(() => {
    process.env.FAL_MCP_MOCK = "true";
  });

  it("should generate video from image URL", async () => {
    const result = await imageToVideo({
      imageUrl: "https://example.com/test.jpg",
      model: "fal-ai/wan-effects",
      parameters: {
        motion_prompt: "gentle wind blowing",
        duration: 4,
        fps: 24,
      },
    });

    expect(result).toBeDefined();
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain("https://fal.media/mock/");
    expect(result.content[0].text).toContain("/video.mp4");
  });

  it("should work with any fal-ai video model", async () => {
    const models = [
      "fal-ai/ltxv/image-to-video",
      "fal-ai/kling-video/v2.1/master",
      "fal-ai/minimax/hailuo-02/pro",
      "fal-ai/some-new-video-model",
    ];

    for (const model of models) {
      const result = await imageToVideo({
        imageUrl: "https://example.com/test.jpg",
        model,
        parameters: {
          custom_param: "test",
        },
      });

      expect(result).toBeDefined();
      expect(result.content[0].text).toContain("/video.mp4");
    }
  });

  it("should accept any parameters without validation", async () => {
    const result = await imageToVideo({
      imageUrl: "https://example.com/test.jpg",
      model: "fal-ai/experimental-video",
      parameters: {
        // These might not be valid parameters, but we don't validate
        totally_made_up: true,
        nested_config: { key: "value" },
        array_param: [1, 2, 3],
      },
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("/video.mp4");
  });

  it("should handle missing imageUrl", async () => {
    const result = await imageToVideo({
      imageUrl: "",
      model: "fal-ai/wan-effects",
      parameters: {},
    });

    expect(result.content[0].text).toContain("Either imageUrl or imagePath must be provided");
  });
});
