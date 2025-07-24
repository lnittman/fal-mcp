import { beforeEach, describe, expect, it } from "vitest";
import workflowChain from "../../tools/workflowChain";

describe("workflowChain", () => {
  beforeEach(() => {
    process.env.FAL_MCP_MOCK = "true";
  });

  it("should execute a simple generation workflow", async () => {
    const result = await workflowChain({
      steps: [
        {
          type: "generate",
          model: "fal-ai/flux/dev",
          parameters: {
            prompt: "A cute robot",
            image_size: "square",
          },
        },
      ],
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("https://fal.media/mock/");
  });

  it("should chain multiple operations", async () => {
    const result = await workflowChain({
      steps: [
        {
          type: "generate",
          model: "fal-ai/flux/schnell",
          parameters: {
            prompt: "A landscape",
          },
        },
        {
          type: "upscale",
          model: "fal-ai/aura-sr",
          parameters: {
            scale: 4,
          },
        },
        {
          type: "transform",
          model: "fal-ai/flux-general/image-to-image",
          parameters: {
            prompt: "Make it sunset",
            strength: 0.5,
          },
        },
      ],
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("https://fal.media/mock/");
  });

  it("should handle image to video workflow", async () => {
    const result = await workflowChain({
      steps: [
        {
          type: "generate",
          model: "fal-ai/flux/dev",
          parameters: {
            prompt: "A dancing cat",
          },
        },
        {
          type: "removeBackground",
          model: "fal-ai/birefnet",
          parameters: {},
        },
        {
          type: "animate",
          model: "fal-ai/wan-effects",
          parameters: {
            motion_prompt: "cat dancing",
            duration: 3,
          },
        },
      ],
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain(".mp4");
  });

  it("should require input image for non-generation workflows", async () => {
    const result = await workflowChain({
      steps: [
        {
          type: "upscale",
          model: "fal-ai/aura-sr",
          parameters: { scale: 2 },
        },
      ],
    });

    expect(result.content[0].text).toContain("Input image required");
  });

  it("should work with provided input image", async () => {
    const result = await workflowChain({
      inputImage: "https://example.com/start.jpg",
      steps: [
        {
          type: "removeBackground",
          model: "fal-ai/birefnet",
          parameters: {},
        },
        {
          type: "upscale",
          model: "fal-ai/clarity-upscaler",
          parameters: {
            scale: 2,
            overlapping_factor: 0.6,
          },
        },
      ],
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("https://fal.media/mock/");
  });

  it("should accept any model and parameters", async () => {
    const result = await workflowChain({
      steps: [
        {
          type: "generate",
          model: "fal-ai/brand-new-model",
          parameters: {
            custom_prompt_field: "test",
            experimental_param: true,
          },
        },
        {
          type: "transform",
          model: "fal-ai/another-new-model",
          parameters: {
            transformation_desc: "make it cool",
            intensity: 0.8,
          },
        },
      ],
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("https://fal.media/mock/");
  });
});
