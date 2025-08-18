import os from "node:os";
import path from "node:path";
import fs from "fs-extra";
import type { InferSchema, ToolMetadata } from "xmcp";
import { z } from "zod";
import { debug } from "../lib/utils/debug";
import {
  extractImageUrl,
  formatError,
  initializeFalClient,
  submitToFal,
  validateModel,
} from "../lib/utils/tool-base";

export const schema = {
  directory: z.string().describe("Directory path containing images (use ~ for home directory)"),
  actionPrompt: z
    .string()
    .describe(
      "Transformation to apply to all images (e.g., 'convert to pixel art', 'make it look vintage', 'add neon glow')"
    ),
  model: z
    .string()
    .default("fal-ai/flux-general/image-to-image")
    .describe(
      "Model ID for image processing. Any fal-ai model that supports image-to-image. Popular: flux-general/image-to-image, flux-pro/kontext"
    ),
  strength: z.number().min(0).max(1).default(0.8).describe("Transformation strength"),
  outputSuffix: z.string().default("_processed").describe("Suffix for output files"),
  outputFormat: z.enum(["png", "jpg", "webp"]).default("png").describe("Output image format"),
};

export const metadata: ToolMetadata = {
  name: "batchProcessImages",
  description:
    "Process all images in a directory with the same transformation prompt. Supports any style or effect through natural language",
  annotations: {
    title: "Batch Process Images",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function batchProcessImages(params: InferSchema<typeof schema>) {
  const { directory, actionPrompt, model, strength, outputSuffix, outputFormat } = params;
  const toolName = "batchProcessImages";

  try {
    // Initialize and validate
    await validateModel(model, toolName);
    initializeFalClient(toolName);

    // Resolve directory path (handle ~ for home)
    const resolvedDir = directory.startsWith("~")
      ? path.join(os.homedir(), directory.slice(1))
      : path.resolve(directory);

    // Check if directory exists
    if (!(await fs.pathExists(resolvedDir))) {
      throw new Error(`Directory not found: ${resolvedDir}`);
    }

    // Get all image files
    const files = await fs.readdir(resolvedDir);
    const imageFiles = files.filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));

    if (imageFiles.length === 0) {
      return {
        content: [{ type: "text", text: `No image files found in ${resolvedDir}` }],
      };
    }

    const processedFiles: string[] = [];
    const errors: string[] = [];

    // Process each image
    for (const file of imageFiles) {
      try {
        const inputPath = path.join(resolvedDir, file);

        // Read and convert to base64
        const buffer = await fs.readFile(inputPath);
        const base64 = buffer.toString("base64");
        const mimeType = file.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
        const imageUrl = `data:${mimeType};base64,${base64}`;

        // Prepare input based on model
        const input: any = {
          image_url: imageUrl,
          prompt: actionPrompt,
          strength: strength,
        };

        debug(toolName, `Processing ${file} with prompt: ${actionPrompt}`);

        // Submit to fal.ai
        const response = await submitToFal(model, input, toolName);

        // Extract result URL
        const resultUrl = extractImageUrl(response, toolName);

        // Download processed image
        const downloadResponse = await fetch(resultUrl);
        const arrayBuffer = await downloadResponse.arrayBuffer();

        // Generate output filename
        const baseName = path.basename(file, path.extname(file));
        const outputFileName = `${baseName}${outputSuffix}.${outputFormat}`;
        const outputPath = path.join(resolvedDir, outputFileName);

        // Save the processed image
        await fs.writeFile(outputPath, Buffer.from(arrayBuffer));

        processedFiles.push(outputFileName);
        debug(toolName, `Successfully processed ${file}`);
      } catch (error: any) {
        errors.push(`${file}: ${error.message}`);
        debug(toolName, `Error processing ${file}:`, error);
      }
    }

    // Build response - simple summary
    let summary = `Processed ${processedFiles.length}/${imageFiles.length} images in ${resolvedDir}`;
    if (errors.length > 0) {
      summary += ` (${errors.length} errors)`;
    }

    debug(toolName, `Batch processing complete:`, {
      processedCount: processedFiles.length,
      errorCount: errors.length,
    });

    return {
      content: [{ type: "text", text: summary }],
    };
  } catch (error: any) {
    return formatError(error, "Error in batch processing");
  }
}
