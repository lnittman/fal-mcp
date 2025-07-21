import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import * as fal from "@fal-ai/serverless-client";

export const schema = {
  imageUrl: z.string().optional().describe("URL of the input image to process. Accepts direct URLs or data URLs"),
  imagePath: z.string().optional().describe("Local file path of the input image. Supports ~ for home directory. Either imageUrl or imagePath must be provided"),
  maskUrl: z.string().describe("URL of a mask image defining removal areas. White pixels = remove, black pixels = keep. Use external tools to generate masks first"),
  model: z.enum([
    "fal-ai/imageutils/lama",
    "fal-ai/stable-diffusion-v3-medium-diffusers-inpainting"
  ])
    .default("fal-ai/imageutils/lama")
    .describe("Model selection: 'imageutils/lama' for automatic inpainting (best for general removal), 'stable-diffusion' for creative replacement with custom prompts"),
  dilateAmount: z.number().min(0).max(50).default(10).describe("Pixels to expand the mask area for cleaner edges. Higher values remove more context around objects"),
  backgroundPrompt: z.string().optional().describe("For stable-diffusion only: Description of what should replace the removed area (e.g., 'grassy field', 'wooden floor', 'clear blue sky')"),
};

export const metadata: ToolMetadata = {
  name: "objectRemoval",
  description: `Remove unwanted objects from images with AI-powered inpainting. This tool intelligently fills removed areas to match the surrounding context.

CAPABILITIES:
• Remove people, objects, text, watermarks, or any unwanted elements
• Automatic content-aware filling that matches surrounding areas
• Support for both simple removal and creative replacement

INPUT METHODS:
• Provide either a URL (imageUrl) or local file path (imagePath)
• Optional mask for precise control over removal areas

USE CASES:
• Clean up product photos by removing distractions
• Remove photobombers from personal photos
• Eliminate watermarks or text overlays
• Create clean backgrounds for e-commerce
• Remove power lines, trash, or other unwanted elements

MODELS:
• LAMA (default): Best for general object removal with automatic inpainting
• Stable Diffusion: For creative replacement with custom backgrounds (requires mask)

EXAMPLES:
• Simple removal: Remove "person in red shirt" or "car in background"
• Multiple objects: Remove "all text and logos" or "people in the background"
• Creative replacement: Replace removed areas with specific textures or patterns`,
  annotations: {
    title: "AI Object Removal",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function objectRemoval(params: InferSchema<typeof schema>) {
  const { imageUrl, imagePath, model, maskUrl, dilateAmount, backgroundPrompt } = params;
  
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
    let modelId = model;
    
    if (model === "fal-ai/imageutils/lama") {
      // LAMA model input
      input = {
        image_url: inputUrl,
        mask_url: maskUrl,
        dilate_mask: dilateAmount > 0,
        dilate_amount: dilateAmount,
      };
    } else if (model === "fal-ai/stable-diffusion-v3-medium-diffusers-inpainting") {
      // Stable Diffusion inpainting input
      input = {
        image_url: inputUrl,
        mask_url: maskUrl,
        prompt: backgroundPrompt || "clean natural background that matches the surroundings",
        negative_prompt: "blurry, artifacts, distorted",
        strength: 0.85,
        guidance_scale: 7.5,
        num_inference_steps: 25,
      };
    }

    // Submit to fal.ai
    const status = await fal.subscribe(modelId, {
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
        { type: "text", text: `❌ Error removing object${statusCode ? ` (${statusCode})` : ''}: ${errorMessage}` },
      ],
    };
  }
}