import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import * as fal from "@fal-ai/serverless-client";
import fs from "fs-extra";
import path from "path";
import os from "os";

export const schema = {
  directory: z.string().describe("Directory path containing images (use ~ for home directory)"),
  actionPrompt: z.string().describe("Transformation to apply to all images (e.g., 'convert to pixel art', 'make it look vintage', 'add neon glow')"),
  model: z.enum(["fal-ai/flux-general/image-to-image", "fal-ai/kontext"])
    .default("fal-ai/flux-general/image-to-image")
    .describe("Model to use for processing"),
  strength: z.number().min(0).max(1).default(0.8).describe("Transformation strength"),
  outputSuffix: z.string().default("_processed").describe("Suffix for output files"),
  outputFormat: z.enum(["png", "jpg", "webp"]).default("png").describe("Output image format"),
};

export const metadata: ToolMetadata = {
  name: "batchProcessImages",
  description: "Process all images in a directory with the same transformation prompt. Supports any style or effect through natural language",
  annotations: {
    title: "Batch Process Images",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function batchProcessImages(params: InferSchema<typeof schema>) {
  const { directory, actionPrompt, model, strength, outputSuffix, outputFormat } = params;
  
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
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));

    if (imageFiles.length === 0) {
      return {
        content: [
          { type: "text", text: `ℹ️ No image files found in ${resolvedDir}` },
        ],
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
        const base64 = buffer.toString('base64');
        const mimeType = file.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
        
        // Submit to fal.ai
        const status = await fal.subscribe(model, {
          input: {
            image_url: `data:${mimeType};base64,${base64}`,
            prompt: actionPrompt,
            strength,
          },
          logs: false,
        });
        
        if (!status.images || status.images.length === 0) {
          throw new Error("No output generated");
        }

        // Download processed image
        const response = await fetch(status.images[0].url);
        const arrayBuffer = await response.arrayBuffer();
        
        // Generate output filename
        const baseName = path.basename(file, path.extname(file));
        const outputFileName = `${baseName}${outputSuffix}.${outputFormat}`;
        const outputPath = path.join(resolvedDir, outputFileName);
        
        // Save the processed image
        await fs.writeFile(outputPath, Buffer.from(arrayBuffer));
        
        processedFiles.push(outputFileName);
      } catch (error: any) {
        errors.push(`${file}: ${error.message}`);
      }
    }

    // Build response - simple summary
    let summary = `Processed ${processedFiles.length}/${imageFiles.length} images in ${resolvedDir}`;
    if (errors.length > 0) {
      summary += ` (${errors.length} errors)`;
    }
    
    return {
      content: [
        { type: "text", text: summary },
      ],
    };
  } catch (error: any) {
    // Extract more detailed error information
    let errorMessage = error.message || 'Unknown error';
    let statusCode = '';
    
    if (error.response) {
      statusCode = error.response.status || '';
      errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
    }
    
    if (error.body) {
      errorMessage = error.body.detail || error.body.message || errorMessage;
    }
    
    // Check for specific error types
    if (statusCode === 404 || errorMessage.includes('Not Found')) {
      errorMessage = `Model '${model}' not found. This might be due to:\n- Invalid model ID\n- Model deprecated or renamed\n- API key doesn't have access to this model\n\nTry using a different model or check fal.ai documentation for current model IDs.`;
    } else if (statusCode === 401 || errorMessage.includes('Unauthorized')) {
      errorMessage = 'Authentication failed. Please check your FAL_API_KEY.';
    }
    
    return {
      content: [
        { type: "text", text: `❌ Error in batch processing${statusCode ? ` (${statusCode})` : ''}: ${errorMessage}` },
      ],
    };
  }
}