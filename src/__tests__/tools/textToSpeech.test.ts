import { beforeEach, describe, expect, it } from "vitest";
import textToSpeech from "../../tools/textToSpeech";

describe("textToSpeech", () => {
  beforeEach(() => {
    // Ensure we're in mock mode
    process.env.FAL_MCP_MOCK = "true";
  });

  it("should convert text to speech", async () => {
    const result = await textToSpeech({
      text: "Hello, this is a test.",
      model: "fal-ai/text-to-speech",
    });

    expect(result).toBeDefined();
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain("https://fal.media/mock/");
    expect(result.content[0].text).toContain(".mp3");
  });

  it("should work with any fal-ai TTS model", async () => {
    const result = await textToSpeech({
      text: "Testing new model",
      model: "fal-ai/new-tts-model/v2",
      voice: "nova",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("https://fal.media/mock/");
  });

  it("should handle voice parameters", async () => {
    const result = await textToSpeech({
      text: "Different voice test",
      voice: "echo",
      language: "en",
      speed: 1.2,
      emotion: "happy",
      model: "fal-ai/text-to-speech",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain(".mp3");
  });

  it("should handle multiple languages", async () => {
    const result = await textToSpeech({
      text: "Hola, esto es una prueba",
      language: "es",
      model: "fal-ai/text-to-speech",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain(".mp3");
  });

  it("should pass through various voice parameter names", async () => {
    const result = await textToSpeech({
      text: "Testing parameter discovery",
      model: "fal-ai/wizmodel/tts",
      voice: "alloy",
      language: "en",
      speed: 0.8,
      emotion: "calm",
    });

    expect(result).toBeDefined();
    // Tool should try multiple parameter variations internally
    expect(result.content[0].text).toContain("https://fal.media/mock/");
  });

  it("should handle minimal parameters", async () => {
    const result = await textToSpeech({
      text: "Simple test",
      model: "fal-ai/text-to-speech",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain(".mp3");
  });

  it("should validate model format", async () => {
    const result = await textToSpeech({
      text: "test",
      model: "invalid-model",
    });

    expect(result.content[0].text).toContain("Invalid model ID format");
  });

  // Removed: Required field validation happens at MCP level

  it("should handle emotion parameters", async () => {
    const result = await textToSpeech({
      text: "I am very excited!",
      emotion: "happy",
      model: "fal-ai/text-to-speech",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain(".mp3");
  });

  it("should handle speed variations", async () => {
    const result = await textToSpeech({
      text: "Speaking very slowly",
      speed: 0.5,
      model: "fal-ai/text-to-speech",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain(".mp3");
  });
});
