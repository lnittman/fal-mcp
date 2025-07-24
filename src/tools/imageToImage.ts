import type { InferSchema, ToolMetadata } from "xmcp";
import { z } from "zod";
import { debug } from "../lib/utils/debug";
import {
  extractImageUrl,
  formatError,
  formatMediaResult,
  initializeFalClient,
  submitToFal,
  validateModel,
} from "../lib/utils/tool-base";

export const schema = {
  imageUrl: z.string().optional().describe("URL of the input image"),
  imagePath: z.string().optional().describe("Local file path of the input image"),
  prompt: z.string().describe("Transformation description"),
  model: z
    .string()
    .default("fal-ai/flux/dev/image-to-image")
    .describe("Any fal-ai model ID that supports image-to-image transformation"),
  parameters: z
    .record(z.any())
    .optional()
    .describe(
      "Additional model-specific parameters (e.g., strength, mask_url, reference_image, style, etc.)"
    ),
};

export const metadata: ToolMetadata = {
  name: "imageToImage",
  description: `Transform images using any fal.ai model. No assumptions, just possibilities.

The agent should experiment with:
- Different models for different effects
- Various parameter combinations
- Learning from error messages about what parameters each model expects

Let the API guide you - error messages often reveal the correct parameter names and formats.`,
  annotations: {
    title: "Image to Image (Generic)",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function imageToImage(params: InferSchema<typeof schema>) {
  const { imageUrl, imagePath, prompt, model, parameters = {} } = params;
  const toolName = "imageToImage";

  try {
    await validateModel(model, toolName);
    initializeFalClient(toolName);

    // Handle local file if provided
    let inputUrl = imageUrl;
    if (imagePath && !imageUrl) {
      const fs = await import("fs-extra");
      const path = await import("path");
      const os = await import("os");

      const resolvedPath = imagePath.startsWith("~")
        ? path.join(os.homedir(), imagePath.slice(1))
        : path.resolve(imagePath);

      if (!(await fs.pathExists(resolvedPath))) {
        throw new Error(`File not found: ${resolvedPath}`);
      }

      const buffer = await fs.readFile(resolvedPath);
      const base64 = buffer.toString("base64");
      const ext = path.extname(resolvedPath).toLowerCase();
      const mimeType = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";

      inputUrl = `data:${mimeType};base64,${base64}`;
    }

    if (!inputUrl) {
      throw new Error("Either imageUrl or imagePath must be provided");
    }

    // Build input with whatever parameters the agent provides
    // Common parameter names include: image_url, image, url, source_image, input_image
    // Let the agent discover which one works through experimentation
    const input = {
      prompt,
      ...parameters,
      // Try common parameter names - the API will tell us if we're wrong
      image_url: inputUrl,
      image: inputUrl,
    };

    debug(toolName, `Transforming image with model ${model}`, { input });

    const response = await submitToFal(model, input, toolName);
    const resultUrl = extractImageUrl(response, toolName);

    return formatMediaResult(resultUrl);
  } catch (error: any) {
    return formatError(error, "Error transforming image");
  }
}
