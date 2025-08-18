import { beforeEach, describe, expect, it } from "vitest";
import textToAudio from "../../tools/textToAudio";

describe("textToAudio", () => {
  beforeEach(() => {
    // Ensure we're in mock mode
    process.env.FAL_MCP_MOCK = "true";
  });

  it("should generate audio from text prompt", async () => {
    const result = await textToAudio({
      prompt: "upbeat electronic dance music",
      model: "fal-ai/stable-audio",
      parameters: {},
    });

    expect(result).toBeDefined();
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain("https://fal.media/mock/");
    expect(result.content[0].text).toContain(".mp3");
  });

  it("should work with any fal-ai audio model", async () => {
    const result = await textToAudio({
      prompt: "peaceful piano melody",
      model: "fal-ai/new-music-model/v3",
      parameters: {
        duration: 30,
        format: "wav",
      },
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("https://fal.media/mock/");
  });

  it("should pass through any parameters without validation", async () => {
    const result = await textToAudio({
      prompt: "jazz improvisation",
      model: "fal-ai/stable-audio",
      parameters: {
        // Discovery approach - try any parameters
        duration: 60,
        seconds_total: 60,
        duration_seconds: 60,
        tempo: 120,
        bpm: 120,
        genre: "jazz",
        style: "improvisation",
        custom_param: "value",
      },
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("https://fal.media/mock/");
  });

  it("should handle minimal parameters", async () => {
    const result = await textToAudio({
      prompt: "drum beat",
      model: "fal-ai/stable-audio",
      parameters: {},
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain(".mp3");
  });

  it("should validate model format", async () => {
    const result = await textToAudio({
      prompt: "test",
      model: "invalid-model",
      parameters: {},
    });

    expect(result.content[0].text).toContain("Invalid model ID format");
  });

  // Removed: Required field validation happens at MCP level
});
