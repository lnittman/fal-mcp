import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import * as fal from "@fal-ai/serverless-client";
import fs from "fs-extra";
import path from "path";
import os from "os";

export const schema = {
  directory: z.string().describe("Directory path containing images (use ~ for home directory)"),
  model: z.enum(["fal-ai/birefnet", "fal-ai/imageutils/rembg"])
    .default("fal-ai/birefnet")
    .describe("Model for background removal - birefnet for highest quality, rembg for speed"),
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
  
  try {
    // Configure fal client
    fal.config({
      credentials: process.env.FAL_API_KEY,
    });

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
        
        // Prepare input based on model
        let input: any = {};
        
        if (model === "fal-ai/birefnet") {
          input = {
            image_url: imageUrl,
            refine_foreground: true,
          };
        } else {
          input = {
            image_url: imageUrl,
          };
        }

        // Submit to fal.ai
        const status = await fal.subscribe(model, {
          input,
          logs: false,
        });
        
        // Extract result URL
        let resultUrl: string;
        if (status.image?.url) {
          resultUrl = status.image.url;
        } else if (status.images?.[0]?.url) {
          resultUrl = status.images[0].url;
        } else {
          throw new Error("No output generated");
        }

        // Download processed image
        const response = await fetch(resultUrl);
        const arrayBuffer = await response.arrayBuffer();
        
        // Save the processed image
        await fs.writeFile(outputPath, Buffer.from(arrayBuffer));
        
        processedCount++;
      } catch (error: any) {
        errorCount++;
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
    
    return {
      content: [
        { type: "text", text: summary },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        { type: "text", text: `Error in batch background removal: ${error.message}` },
      ],
    };
  }
}