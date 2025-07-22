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
  imageUrl: z.string().optional().describe("URL of the input image to remove background from"),
  imagePath: z.string().optional().describe("Local file path of the input image to remove background from"),
  model: z.string()
    .default("fal-ai/birefnet")
    .describe("Model ID for background removal. Use listModels with category='background-removal' to see available models. Popular: birefnet (quality), imageutils/rembg (fast)"),
  returnMask: z.boolean().default(false).describe("Return the mask image along with the result"),
  outputFormat: z.enum(["png", "webp"]).default("png").describe("Output format (must support transparency)"),
};

export const metadata: ToolMetadata = {
  name: "backgroundRemoval",
  description: `Remove backgrounds from images with AI precision. Create transparent PNGs perfect for e-commerce, design work, and content creation.

CAPABILITIES:
• Remove complex backgrounds with high accuracy
• Preserve fine details like hair, fur, and transparent objects
• Handle challenging edges and semi-transparent areas
• Process both simple and complex scenes effectively
• Maintain original image quality in the subject

USE CASES:
• E-commerce - Clean product photos for online stores
• Portraits - Professional headshots with transparent backgrounds
• Design Work - Assets for graphics, presentations, and marketing
• Social Media - Profile pictures and content creation
• Photo Editing - Composite images and creative projects

BEST PRACTICES:
• Use high-contrast images for best results
• Ensure subject is well-lit and clearly defined
• Avoid heavily compressed input images
• Consider the model choice based on your needs

MODEL SELECTION:
• BiRefNet (default): Superior quality, handles complex edges, best for professional use
• RemBG: Faster processing, good for bulk operations, suitable for simpler images

OUTPUT OPTIONS:
• PNG format preserves transparency (default)
• WebP for smaller file sizes with transparency
• Optional mask output for further editing

TIPS FOR BEST RESULTS:
• Clear subject separation improves accuracy
• Well-lit subjects produce cleaner cutouts
• Avoid motion blur or extremely low resolution
• For hair/fur, BiRefNet performs significantly better`,
  annotations: {
    title: "Background Removal AI",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function backgroundRemoval(params: InferSchema<typeof schema>) {
  const { imageUrl, imagePath, model, returnMask, outputFormat } = params;
  const toolName = 'backgroundRemoval';
  
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
    
    if (model.includes("birefnet")) {
      input = {
        image_url: actualImageUrl,
        model: "u2net", // BiRefNet uses this internally
        return_mask: returnMask,
        output_format: outputFormat,
      };
    } else if (model.includes("rembg")) {
      input = {
        image_url: actualImageUrl,
        model: "u2net",
        alpha_matting: false,
        return_mask: returnMask,
      };
    } else {
      // Default input for unknown models
      input = {
        image_url: actualImageUrl,
        return_mask: returnMask,
      };
    }

    // Submit to fal.ai
    const response = await submitToFal(model, input, toolName);
    
    // Extract result URL
    const resultUrl = extractImageUrl(response, toolName);
    
    // Handle mask return if requested
    if (returnMask && response.mask) {
      const maskUrl = response.mask.url || response.mask;
      return {
        content: [
          { type: "text", text: resultUrl },
          { type: "text", text: `Mask: ${maskUrl}` },
        ],
      };
    }
    
    return formatMediaResult(resultUrl);
  } catch (error: any) {
    return formatError(error, 'Error removing background');
  }
}