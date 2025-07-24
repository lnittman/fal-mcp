import { beforeEach, describe, expect, it } from "vitest";
import listModelsDynamic from "../../tools/listModelsDynamic";

describe("listModelsDynamic", () => {
  beforeEach(() => {
    // Ensure we're in mock mode
    process.env.FAL_MCP_MOCK = "true";
  });

  it("should provide exploration guidance without query", async () => {
    const result = await listModelsDynamic({});

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("exploration");
    expect(result.content[0].text).toMatch(/any fal-ai|discover|explore/i);
  });

  it("should provide pattern-based guidance with query", async () => {
    const result = await listModelsDynamic({
      query: "video",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toMatch(/video|pattern|explore/i);
    // Should not return a fixed list
    expect(result.content[0].text).not.toMatch(/here are all the video models:/i);
  });

  it("should handle image-related queries", async () => {
    const result = await listModelsDynamic({
      query: "image generation",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toMatch(/image|generation|pattern/i);
    expect(result.content[0].text).toMatch(/explore|try|experiment/i);
  });

  it("should handle audio queries", async () => {
    const result = await listModelsDynamic({
      query: "speech",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toMatch(/speech|audio|voice/i);
  });

  it("should emphasize dynamic discovery", async () => {
    const result = await listModelsDynamic({
      query: "fast models",
    });

    expect(result).toBeDefined();
    // Should guide pattern recognition
    expect(result.content[0].text).toMatch(/pattern|naming|convention/i);
    // Should mention common patterns like 'schnell', 'fast', 'lightning'
    expect(result.content[0].text).toMatch(/schnell|fast|lightning|quick/i);
  });

  it("should handle style queries", async () => {
    const result = await listModelsDynamic({
      query: "anime",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toMatch(/anime|style/i);
    // Should encourage experimentation
    expect(result.content[0].text).toMatch(/try|experiment|explore/i);
  });

  it("should remind about true discovery", async () => {
    const result = await listModelsDynamic({
      query: "all models",
    });

    expect(result).toBeDefined();
    // Should emphasize ANY model works
    expect(result.content[0].text).toMatch(/ANY.*fal-ai|all.*models.*work/i);
    // Should not provide exhaustive lists
    expect(result.content[0].text).not.toMatch(/complete list of models/i);
  });
});
