import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import * as fal from "@fal-ai/serverless-client";

export const schema = {
  imageUrl: z.string().optional().describe("URL of the input image to upscale"),
  imagePath: z.string().optional().describe("Local file path of the input image to upscale"),
  model: z.enum([
    "fal-ai/aura-sr",
    "fal-ai/clarity-upscaler",
    "fal-ai/pasd",
    "fal-ai/chain-of-zoom"
  ])
    .default("fal-ai/aura-sr")
    .describe("Upscaling model - aura-sr for general use, clarity for high fidelity, pasd for realistic, chain-of-zoom for extreme upscaling"),
  scaleFactor: z.number().min(2).max(8).default(4).describe("Upscaling factor (2x, 4x, etc.)"),
  overlappingFactor: z.number().min(0.1).max(0.9).default(0.5).describe("Overlapping factor for tiling (clarity model only)"),
  prompt: z.string().optional().describe("Optional prompt for guided upscaling (pasd model only)"),
  style: z.enum(["realistic", "artistic", "anime", "photographic"]).optional().describe("Style guidance for upscaling (pasd model only)"),
};

export const metadata: ToolMetadata = {
  name: "upscaleImage",
  description: "Upscale images with AI to increase resolution while preserving or enhancing details. Multiple quality enhancers available",
  annotations: {
    title: "Upscale Image",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function upscaleImage(params: InferSchema<typeof schema>) {
  const { imageUrl, imagePath, model, scaleFactor, overlappingFactor, prompt, style } = params;
  
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
    
    switch (model) {
      case "fal-ai/aura-sr":
        input = {
          image_url: inputUrl,
          upscaling_factor: scaleFactor,
        };
        break;
        
      case "fal-ai/clarity-upscaler":
        input = {
          image_url: inputUrl,
          scale: scaleFactor,
          overlapping_factor: overlappingFactor,
        };
        break;
        
      case "fal-ai/pasd":
        input = {
          image_url: inputUrl,
          upscale_factor: scaleFactor,
          prompt: prompt || "",
          style_preset: style,
        };
        break;
        
      case "fal-ai/chain-of-zoom":
        input = {
          image_url: inputUrl,
          scale_factor: scaleFactor,
          num_inference_steps: 50,
        };
        break;
        
      default:
        throw new Error(`Unknown model: ${model}`);
    }

    // Submit to fal.ai
    const status = await fal.subscribe(model, {
      input,
      logs: false,
    });

    // Extract result URL based on model response format
    let resultUrl: string;
    
    if (status.image?.url) {
      resultUrl = status.image.url;
    } else if (status.images?.[0]?.url) {
      resultUrl = status.images[0].url;
    } else if (typeof status.image === 'string') {
      resultUrl = status.image;
    } else {
      throw new Error("No output generated");
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
        { type: "text", text: `❌ Error upscaling image${statusCode ? ` (${statusCode})` : ''}: ${errorMessage}` },
      ],
    };
  }
}