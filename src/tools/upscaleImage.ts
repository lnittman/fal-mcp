import * as fs from "fs-extra";
import * as path from "path";
import type { InferSchema, ToolMetadata } from "xmcp";
import { z } from "zod";
import {
  extractImageUrl,
  formatError,
  formatMediaResult,
  initializeFalClient,
  submitToFal,
  validateModel,
} from "../lib/utils/tool-base";

export const schema = {
  imageUrl: z.string().optional().describe("URL of the input image to upscale"),
  imagePath: z.string().optional().describe("Local file path of the input image to upscale"),
  model: z.string().default("fal-ai/aura-sr").describe("Any fal-ai model ID for image upscaling"),
  parameters: z
    .record(z.any())
    .optional()
    .describe(
      "Additional model-specific parameters (e.g., scale, upscaling_factor, num_steps, prompt, style, etc.)"
    ),
};

export const metadata: ToolMetadata = {
  name: "upscaleImage",
  description: `Enhance image resolution with any fal.ai upscaling model.

The agent should discover which models and parameters work best through experimentation.
Different models may have different approaches to upscaling - let the API guide you.

Common parameter names to try:
• scale, upscaling_factor, num_steps - for controlling output size
• prompt - for guided enhancement
• style, style_preset - for style control
• overlapping_factor, restoration_weight - for quality tuning

Remember: Error messages often reveal the correct parameter names and formats.`,
  annotations: {
    title: "Image Upscaling (Generic)",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function upscaleImage(params: InferSchema<typeof schema>) {
  const { imageUrl, imagePath, model, parameters = {} } = params;
  const toolName = "upscaleImage";

  try {
    // Validate input
    if (!imageUrl && !imagePath) {
      throw new Error("Either imageUrl or imagePath must be provided");
    }
    if (imageUrl && imagePath) {
      throw new Error("Only one of imageUrl or imagePath should be provided");
    }

    // Initialize and validate
    await validateModel(model, toolName);
    initializeFalClient(toolName);

    // Handle local image upload
    let actualImageUrl = imageUrl;
    if (imagePath) {
      // Check if file exists
      if (!(await fs.pathExists(imagePath))) {
        throw new Error(`File not found: ${imagePath}`);
      }

      // Read file and convert to base64 data URL
      const imageBuffer = await fs.readFile(imagePath);
      const ext = path.extname(imagePath).toLowerCase();
      const mimeType =
        ext === ".png"
          ? "image/png"
          : ext === ".jpg" || ext === ".jpeg"
            ? "image/jpeg"
            : ext === ".webp"
              ? "image/webp"
              : "image/jpeg";
      actualImageUrl = `data:${mimeType};base64,${imageBuffer.toString("base64")}`;
    }

    // Build input with whatever parameters the agent provides
    // Common parameter names include: image_url, image, scale, upscaling_factor, num_steps
    // Let the agent discover which ones work through experimentation
    const input = {
      ...parameters,
      // Try common parameter names - the API will tell us if we're wrong
      image_url: actualImageUrl,
      image: actualImageUrl,
    };

    // Submit to fal.ai
    const response = await submitToFal(model, input, toolName);

    // Extract image URL
    const resultUrl = extractImageUrl(response, toolName);

    return formatMediaResult(resultUrl);
  } catch (error: any) {
    return formatError(error, "Error upscaling image");
  }
}
