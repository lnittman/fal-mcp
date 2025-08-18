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
  model: z
    .string()
    .default("fal-ai/birefnet")
    .describe("Any fal-ai model ID for background removal"),
  parameters: z.record(z.any()).optional().describe("Additional model-specific parameters"),
};

export const metadata: ToolMetadata = {
  name: "backgroundRemoval",
  description: `Remove backgrounds from images using any fal.ai model.

The agent should discover which models work best through experimentation.
Different models may expect different parameter names - let the API guide you.`,
  annotations: {
    title: "Background Removal (Generic)",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function backgroundRemoval(params: InferSchema<typeof schema>) {
  const { imageUrl, imagePath, model, parameters = {} } = params;
  const toolName = "backgroundRemoval";

  try {
    await validateModel(model, toolName);
    initializeFalClient(toolName);

    // Handle local file if provided
    let inputUrl = imageUrl;
    if (imagePath && !imageUrl) {
      const fs = await import("fs-extra");
      const path = await import("node:path");
      const os = await import("node:os");

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

    // Build input - let the agent discover what parameters work
    const input = {
      ...parameters,
      // Common parameter names - the API will guide us
      image_url: inputUrl,
      image: inputUrl,
      input_image: inputUrl,
    };

    debug(toolName, `Removing background with model ${model}`, { input });

    const response = await submitToFal(model, input, toolName);
    const resultUrl = extractImageUrl(response, toolName);

    return formatMediaResult(resultUrl);
  } catch (error: any) {
    return formatError(error, "Error removing background");
  }
}
