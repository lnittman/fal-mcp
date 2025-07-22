import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import * as fs from "fs-extra";
import * as path from "path";
import {
  initializeFalClient,
  validateModel,
  submitToFal,
  formatMediaResult,
  formatError,
  extractImageUrl,
} from "../utils/tool-base";

export const schema = {
  imageUrl: z.string().optional().describe("URL of the input image to upscale"),
  imagePath: z.string().optional().describe("Local file path of the input image to upscale"),
  model: z.string()
    .default("fal-ai/aura-sr")
    .describe("Model ID for upscaling. Use listModels with category='upscaling' to see all available models. Popular: aura-sr (fast), clarity-upscaler (quality), pasd (realistic), chain-of-zoom (8x)"),
  scaleFactor: z.number().min(2).max(8).default(4).describe("Upscaling factor (2x, 4x, etc.)"),
  overlappingFactor: z.number().min(0.1).max(0.9).default(0.5).describe("Overlapping factor for tiling (clarity model only)"),
  prompt: z.string().optional().describe("Optional prompt for guided upscaling (pasd model only)"),
  style: z.enum(["realistic", "artistic", "anime", "photographic"]).optional().describe("Style guidance for upscaling (pasd model only)"),
};

export const metadata: ToolMetadata = {
  name: "upscaleImage",
  description: `Enhance image resolution with AI super-resolution. Transform low-res images into high-quality, detailed versions perfect for printing, displays, and professional use.

CAPABILITIES:
• Increase resolution up to 8x while adding realistic details
• Restore and enhance old or compressed images
• Improve image clarity without introducing artifacts
• Preserve original style while enhancing quality
• Handle various image types from photos to artwork

USE CASES:
• Photography - Enlarge photos for printing without quality loss
• E-commerce - Upgrade product images to high resolution
• Restoration - Revive old family photos or historical images
• Design - Scale up graphics and illustrations cleanly
• Content Creation - Improve social media images for larger displays
• Archives - Digitize and enhance scanned documents

MODEL SELECTION:
• Aura SR (default): Fast, balanced quality, general purpose
• Clarity Upscaler: Maximum detail preservation, professional results
• PASD: Realistic enhancement with style control, best for photos
• Chain-of-Zoom: Extreme upscaling (up to 8x), sequential processing

SCALE FACTORS:
• 2x: Double resolution, fastest processing
• 4x: Quadruple resolution, most common choice
• 6x-8x: Maximum enhancement (model dependent)

ADVANCED FEATURES:
• Style guidance (PASD): Control the enhancement style
• Prompt-based enhancement (PASD): Guide details with text
• Overlapping tiles (Clarity): Better consistency in large images

TIPS FOR BEST RESULTS:
• Start with the highest quality source available
• Choose scale factor based on final use case
• For photos, use PASD with "photographic" style
• For maximum quality, use Clarity Upscaler
• Test different models for your specific content type`,
  annotations: {
    title: "Image Upscaling AI",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function upscaleImage(params: InferSchema<typeof schema>) {
  const { imageUrl, imagePath, model, scaleFactor, overlappingFactor, prompt, style } = params;
  const toolName = 'upscaleImage';
  
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
      if (!await fs.pathExists(imagePath)) {
        throw new Error(`File not found: ${imagePath}`);
      }
      
      // Read file and convert to base64 data URL
      const imageBuffer = await fs.readFile(imagePath);
      const ext = path.extname(imagePath).toLowerCase();
      const mimeType = ext === '.png' ? 'image/png' : 
                       ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
                       ext === '.webp' ? 'image/webp' : 'image/jpeg';
      actualImageUrl = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
    }

    // Prepare input based on model
    let input: any = {};
    
    if (model.includes("aura-sr")) {
      input = {
        image_url: actualImageUrl,
        scale: scaleFactor,
      };
    } else if (model.includes("clarity-upscaler")) {
      input = {
        image_url: actualImageUrl,
        scale: scaleFactor,
        overlapping_factor: overlappingFactor,
      };
    } else if (model.includes("pasd")) {
      input = {
        image_url: actualImageUrl,
        upscaling_factor: scaleFactor,
        prompt: prompt || `A high quality, ${style || 'realistic'} image`,
        style_preset: style,
      };
    } else if (model.includes("chain-of-zoom")) {
      input = {
        image_url: actualImageUrl,
        num_steps: Math.ceil(Math.log2(scaleFactor)), // Convert scale factor to steps
      };
    } else if (model.includes("supir")) {
      input = {
        image_url: actualImageUrl,
        scale: scaleFactor,
        restoration_weight: 0.5, // Default restoration weight
      };
    } else {
      // Default input for unknown models
      input = {
        image_url: actualImageUrl,
        scale: scaleFactor,
      };
    }

    // Submit to fal.ai
    const response = await submitToFal(model, input, toolName);
    
    // Extract image URL
    const resultUrl = extractImageUrl(response, toolName);
    
    return formatMediaResult(resultUrl);
  } catch (error: any) {
    return formatError(error, 'Error upscaling image');
  }
}