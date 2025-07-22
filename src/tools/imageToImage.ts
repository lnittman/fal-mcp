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
  imageUrl: z.string().optional().describe("URL of the input image to transform"),
  imagePath: z.string().optional().describe("Local file path of the input image to transform"),
  prompt: z.string().describe("Transformation prompt (e.g., 'convert to pixel art', 'make it look like a watercolor painting', 'add glitter effects')"),
  model: z.string()
    .default("fal-ai/flux/dev/image-to-image")
    .describe("Model ID for image transformation. Any fal-ai model that supports image-to-image is accepted. Popular: flux/dev/image-to-image, flux-pro/kontext, flux-general"),
  strength: z.number().min(0).max(1).default(0.8).describe("Transformation strength (0=no change, 1=complete transformation)"),
  maskUrl: z.string().optional().describe("Optional mask URL for selective editing"),
  referenceImage: z.string().optional().describe("Optional reference image URL for style transfer"),
};

export const metadata: ToolMetadata = {
  name: "imageToImage",
  description: "Transform or edit an image using natural language prompts. Accepts either a URL (imageUrl) or local file path (imagePath). Can convert styles (pixel art, watercolor), add effects, edit specific areas with masks, or transfer styles from reference images",
  annotations: {
    title: "Image to Image",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function imageToImage(params: InferSchema<typeof schema>) {
  const { imageUrl, imagePath, prompt, model, strength, maskUrl, referenceImage } = params;
  const toolName = 'imageToImage';
  
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
    
    // Prepare input based on model capabilities
    const input: any = {
      image_url: actualImageUrl,
      prompt,
      strength,
    };

    // Add optional parameters
    if (maskUrl) {
      input.mask_url = maskUrl;
    }

    if (referenceImage) {
      input.reference_image = referenceImage;
    }

    // Submit to fal.ai
    const response = await submitToFal(model, input, toolName);
    
    // Extract image URL
    const resultUrl = extractImageUrl(response, toolName);
    
    return formatMediaResult(resultUrl);
  } catch (error: any) {
    return formatError(error, 'Error transforming image');
  }
}