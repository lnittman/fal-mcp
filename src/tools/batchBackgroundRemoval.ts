import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import fs from "fs-extra";
import path from "path";
import os from "os";
import {
  initializeFalClient,
  validateModel,
  submitToFal,
  extractImageUrl,
  formatError,
} from "../lib/utils/tool-base";
import { debug } from "../lib/utils/debug";

export const schema = {
  directory: z.string().describe("Directory path containing images (use ~ for home directory)"),
  model: z.string()
    .default("fal-ai/birefnet")
    .describe("Model ID for background removal. Any fal-ai model that supports background removal. Popular: birefnet for highest quality, imageutils/rembg for speed"),
  outputSuffix: z.string().default("_nobg").describe("Suffix for output files"),
  outputFormat: z.enum(["png", "webp"]).default("png").describe("Output format (must support transparency)"),
  overwrite: z.boolean().default(false).describe("Overwrite existing output files"),
};

export const metadata: ToolMetadata = {
  name: "batchBackgroundRemoval",
  description: "Remove backgrounds from all images in a directory. Creates transparent PNG/WebP files",
  annotations: {
    title: "Batch Background Removal",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function batchBackgroundRemoval(params: InferSchema<typeof schema>) {
  const { directory, model, outputSuffix, outputFormat, overwrite } = params;
  const toolName = 'batchBackgroundRemoval';
  
  try {
    // Initialize and validate
    await validateModel(model, toolName);
    initializeFalClient(toolName);

    // Resolve directory path (handle ~ for home)
    const resolvedDir = directory.startsWith('~') 
      ? path.join(os.homedir(), directory.slice(1))
      : path.resolve(directory);

    // Check if directory exists
    if (!await fs.pathExists(resolvedDir)) {
      throw new Error(`Directory not found: ${resolvedDir}`);
    }

    // Get all image files
    const files = await fs.readdir(resolvedDir);
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

    if (imageFiles.length === 0) {
      return {
        content: [
          { type: "text", text: `No image files found in ${resolvedDir}` },
        ],
      };
    }

    let processedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Process each image
    for (const file of imageFiles) {
      try {
        // Check if output already exists
        const baseName = path.basename(file, path.extname(file));
        const outputFileName = `${baseName}${outputSuffix}.${outputFormat}`;
        const outputPath = path.join(resolvedDir, outputFileName);
        
        if (!overwrite && await fs.pathExists(outputPath)) {
          skippedCount++;
          continue;
        }

        const inputPath = path.join(resolvedDir, file);
        
        // Read and convert to base64
        const buffer = await fs.readFile(inputPath);
        const base64 = buffer.toString('base64');
        const mimeType = file.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
        const imageUrl = `data:${mimeType};base64,${base64}`;
        
        // Build input with common parameters
        // Let the agent discover which parameters work
        const input: any = {
          image_url: imageUrl,
          image: imageUrl,
          return_mask: false,
          output_format: outputFormat,
          format: outputFormat,
        };

        debug(toolName, `Processing ${file} with model ${model}`);

        // Submit to fal.ai
        const response = await submitToFal(model, input, toolName);
        
        // Extract result URL
        const resultUrl = extractImageUrl(response, toolName);

        // Download processed image
        const downloadResponse = await fetch(resultUrl);
        const arrayBuffer = await downloadResponse.arrayBuffer();
        
        // Save the processed image
        await fs.writeFile(outputPath, Buffer.from(arrayBuffer));
        
        processedCount++;
        debug(toolName, `Successfully processed ${file}`);
      } catch (error: any) {
        errorCount++;
        debug(toolName, `Error processing ${file}:`, error);
      }
    }

    // Build simple response
    let summary = `Removed backgrounds from ${processedCount}/${imageFiles.length} images`;
    if (skippedCount > 0) {
      summary += ` (${skippedCount} skipped)`;
    }
    if (errorCount > 0) {
      summary += ` (${errorCount} errors)`;
    }
    
    debug(toolName, `Batch processing complete:`, { processedCount, skippedCount, errorCount });
    
    return {
      content: [
        { type: "text", text: summary },
      ],
    };
  } catch (error: any) {
    return formatError(error, 'Error in batch background removal');
  }
}