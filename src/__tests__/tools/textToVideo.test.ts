import { beforeEach, describe, expect, it } from "vitest";
import textToVideo from "../../tools/textToVideo";

describe("textToVideo", () => {
  beforeEach(() => {
    // Ensure we're in mock mode
    process.env.FAL_MCP_MOCK = "true";
  });

  it("should generate video from text prompt", async () => {
    const result = await textToVideo({
      prompt: "waves crashing on a beach at sunset",
      model: "fal-ai/ltxv-13b-098-distilled",
      parameters: {},
    });

    expect(result).toBeDefined();
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain("https://fal.media/mock/");
    expect(result.content[0].text).toContain(".mp4");
  });

  it("should work with any fal-ai video model", async () => {
    const result = await textToVideo({
      prompt: "cat playing with yarn",
      model: "fal-ai/new-video-gen/v2",
      parameters: {
        duration: 5,
        fps: 24,
      },
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("https://fal.media/mock/");
    expect(result.content[0].text).toContain(".mp4");
  });

  it("should pass through any parameters without validation", async () => {
    const result = await textToVideo({
      prompt: "futuristic city flythrough",
      model: "fal-ai/ltxv-13b-098-distilled",
      parameters: {
        // Discovery approach - try multiple parameter names
        duration: 10,
        seconds: 10,
        length: 10,
        fps: 30,
        frame_rate: 30,
        frames_per_second: 30,
        aspect_ratio: "16:9",
        resolution: "1920x1080",
        motion_intensity: 0.8,
        camera_movement: "smooth",
      },
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("https://fal.media/mock/");
  });

  it("should handle minimal parameters", async () => {
    const result = await textToVideo({
      prompt: "simple animation",
      model: "fal-ai/ltxv-13b-098-distilled",
      parameters: {},
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain(".mp4");
  });

  it("should validate model format", async () => {
    const result = await textToVideo({
      prompt: "test",
      model: "invalid-model",
      parameters: {},
    });

    expect(result.content[0].text).toContain("Invalid model ID format");
  });

  // Removed: Required field validation happens at MCP level

  it("should accept style and quality parameters", async () => {
    const result = await textToVideo({
      prompt: "cinematic landscape shot",
      model: "fal-ai/ltxv-13b-098-distilled",
      parameters: {
        style: "cinematic",
        quality: "high",
        num_frames: 120,
      },
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain(".mp4");
  });
});
