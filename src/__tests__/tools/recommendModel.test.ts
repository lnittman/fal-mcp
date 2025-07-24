import { beforeEach, describe, expect, it } from "vitest";
import recommendModel from "../../tools/recommendModel";

describe("recommendModel", () => {
  beforeEach(() => {
    // Ensure we're in mock mode
    process.env.FAL_MCP_MOCK = "true";
  });

  it("should provide discovery strategies for a task", async () => {
    const result = await recommendModel({
      task: "create anime artwork",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("Discovery Strategy");
    // Should provide exploration guidance, not prescriptive model lists
    expect(result.content[0].text).toMatch(/explore|try|experiment|discover/i);
  });

  it("should handle context information", async () => {
    const result = await recommendModel({
      task: "upscale images",
      context: {
        previousAttempts: ["fal-ai/aura-sr failed with error"],
        requirements: "Need 8x upscaling",
      },
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("Discovery Strategy");
  });

  it("should provide guidance for video tasks", async () => {
    const result = await recommendModel({
      task: "generate videos from text prompts",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("Discovery Strategy");
    expect(result.content[0].text).toMatch(/video|animation|motion/i);
  });

  it("should provide guidance for audio tasks", async () => {
    const result = await recommendModel({
      task: "convert text to speech with emotions",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("Discovery Strategy");
    expect(result.content[0].text).toMatch(/speech|voice|audio/i);
  });

  it("should encourage experimentation over prescription", async () => {
    const result = await recommendModel({
      task: "remove backgrounds from images",
    });

    expect(result).toBeDefined();
    // Should not contain hardcoded model recommendations
    expect(result.content[0].text).not.toMatch(/use fal-ai\/birefnet/i);
    // Should encourage discovery
    expect(result.content[0].text).toMatch(/try|explore|experiment/i);
  });

  // Removed: Required field validation happens at MCP level

  it("should provide learning-focused advice", async () => {
    const result = await recommendModel({
      task: "I need the fastest image generation model",
    });

    expect(result).toBeDefined();
    // Should guide toward discovery patterns
    expect(result.content[0].text).toMatch(/model names.*hint|pattern|suffix/i);
  });
});
