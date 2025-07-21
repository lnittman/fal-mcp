import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import * as fal from "@fal-ai/serverless-client";

export const schema = {
  imageUrl: z.string().optional().describe("URL of the input image to remove background from"),
  imagePath: z.string().optional().describe("Local file path of the input image to remove background from"),
  model: z.enum([
    "fal-ai/birefnet",
    "fal-ai/imageutils/rembg"
  ])
    .default("fal-ai/birefnet")
    .describe("Model for background removal - birefnet for high quality, rembg for fast processing"),
  returnMask: z.boolean().default(false).describe("Return the mask image along with the result"),
  outputFormat: z.enum(["png", "webp"]).default("png").describe("Output format (must support transparency)"),
};

export const metadata: ToolMetadata = {
  name: "backgroundRemoval",
  description: "Remove background from images automatically. Perfect for product photos, portraits, and creating transparent assets",
  annotations: {
    title: "Background Removal",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function backgroundRemoval(params: InferSchema<typeof schema>) {
  const { imageUrl, imagePath, model, returnMask, outputFormat } = params;
  
  try {
    // Configure fal client
    fal.config({
      credentials: process.env.FAL_API_KEY,
    });

    // Validate input
    if (!imageUrl && !imagePath) {
      throw new Error("Either imageUrl or imagePath must be provided");
    }

    // Handle local file
    let inputUrl = imageUrl;
    if (imagePath && !imageUrl) {
      const fs = await import("fs-extra");
      const path = await import("path");
      const os = await import("os");
      
      // Resolve path (handle ~ for home)
      const resolvedPath = imagePath.startsWith('~') 
        ? path.join(os.homedir(), imagePath.slice(1))
        : path.resolve(imagePath);
      
      // Read and convert to base64
      const buffer = await fs.readFile(resolvedPath);
      const base64 = buffer.toString('base64');
      const ext = path.extname(resolvedPath).toLowerCase();
      const mimeType = ext === '.png' ? 'image/png' : 
                       ext === '.webp' ? 'image/webp' : 
                       'image/jpeg';
      
      inputUrl = `data:${mimeType};base64,${base64}`;
    }

    // Prepare input based on model
    let input: any = {};
    if (model === "fal-ai/birefnet") {
      input = {
        image_url: inputUrl,
        model: "General Use (Light)",
        output_format: outputFormat,
        return_mask: returnMask,
      };
    } else {
      // rembg model
      input = {
        image_url: inputUrl,
      };
    }

    // Submit to fal.ai
    const status = await fal.subscribe(model, {
      input,
      logs: false,
    });

    // Handle response based on model
    let resultUrl: string;
    let maskUrl: string | undefined;

    if (model === "fal-ai/birefnet") {
      if (!status.image || !status.image.url) {
        throw new Error("No output generated");
      }
      resultUrl = status.image.url;
      maskUrl = status.mask?.url;
    } else {
      // rembg returns direct URL
      if (!status.image) {
        throw new Error("No output generated");
      }
      resultUrl = status.image;
    }

    // Return appropriate response
    if (returnMask && maskUrl) {
      return {
        content: [
          { type: "text", text: resultUrl },
          { type: "text", text: `Mask: ${maskUrl}` },
        ],
      };
    }

    return {
      content: [
        { type: "text", text: resultUrl },
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
        { type: "text", text: `❌ Error removing background${statusCode ? ` (${statusCode})` : ''}: ${errorMessage}` },
      ],
    };
  }
}