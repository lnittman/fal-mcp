import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import * as fs from "fs-extra";
import * as path from "path";
import * as os from "os";
import {
  initializeFalClient,
  validateModel,
  submitToFal,
  formatMediaResult,
  formatError,
  extractImageUrl,
} from "../utils/tool-base";
import { debug } from "../utils/debug";

export const schema = {
  imageUrl: z.string().optional().describe("URL of the input image to process. Accepts direct URLs or data URLs"),
  imagePath: z.string().optional().describe("Local file path of the input image. Supports ~ for home directory. Either imageUrl or imagePath must be provided"),
  maskUrl: z.string().describe("URL of a mask image defining removal areas. White pixels = remove, black pixels = keep. Use external tools to generate masks first"),
  model: z.string()
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
  const toolName = 'objectRemoval';
  
  try {
    // Initialize and validate
    await validateModel(model, toolName);
    initializeFalClient(toolName);

    // Validate input
    if (!imageUrl && !imagePath) {
      throw new Error("Either imageUrl or imagePath must be provided");
    }

    // Handle local file
    let inputUrl = imageUrl;
    if (imagePath && !imageUrl) {
      // Resolve path (handle ~ for home)
      const resolvedPath = imagePath.startsWith('~') 
        ? path.join(os.homedir(), imagePath.slice(1))
        : path.resolve(imagePath);
      
      // Check if file exists
      if (!await fs.pathExists(resolvedPath)) {
        throw new Error(`File not found: ${resolvedPath}`);
      }
      
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
    
    if (model.includes("lama")) {
      // LAMA model input
      input = {
        image_url: inputUrl,
        mask_url: maskUrl,
        dilate_mask: dilateAmount > 0,
        dilate_amount: dilateAmount,
      };
    } else if (model.includes("stable-diffusion") && model.includes("inpainting")) {
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
    } else {
      // Generic inpainting model
      input = {
        image_url: inputUrl,
        mask_url: maskUrl,
        prompt: backgroundPrompt,
      };
    }
    
    debug(toolName, `Removing objects with model ${model}`);

    // Submit to fal.ai
    const response = await submitToFal(model, input, toolName);

    // Extract result URL
    const resultUrl = extractImageUrl(response, toolName);

    return formatMediaResult(resultUrl);
  } catch (error: any) {
    return formatError(error, 'Error removing object');
  }
}