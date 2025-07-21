import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import * as fal from "@fal-ai/serverless-client";
import * as fs from "fs-extra";
import * as path from "path";

export const schema = {
  imageUrl: z.string().optional().describe("URL of the input image to transform"),
  imagePath: z.string().optional().describe("Local file path of the input image to transform"),
  prompt: z.string().describe("Transformation prompt (e.g., 'convert to pixel art', 'make it look like a watercolor painting', 'add glitter effects')"),
  model: z.enum(["fal-ai/flux/dev/image-to-image", "fal-ai/flux-general", "fal-ai/kontext"])
    .default("fal-ai/flux/dev/image-to-image")
    .describe("Model for image transformation"),
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
  
  try {
    // Validate input
    if (!imageUrl && !imagePath) {
      throw new Error("Either imageUrl or imagePath must be provided");
    }
    if (imageUrl && imagePath) {
      throw new Error("Only one of imageUrl or imagePath should be provided");
    }
    // Configure fal client
    fal.config({
      credentials: process.env.FAL_API_KEY,
    });

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
    
    // Debug logging
    console.error(`[imageToImage] Using model: ${model}`);
    console.error(`[imageToImage] Input prompt: ${prompt}`);
    console.error(`[imageToImage] Strength: ${strength}`);

    // Add optional parameters
    if (maskUrl) {
      input.mask_url = maskUrl;
    }

    if (referenceImage) {
      input.reference_image = referenceImage;
    }

    // Use subscribe instead of queue for better reliability
    console.error(`[imageToImage] Calling fal.subscribe with model: ${model}`);
    const status = await fal.subscribe(model, {
      input,
      logs: false,
    });

    if (!status.images || status.images.length === 0) {
      throw new Error("No images generated");
    }

    // Log for debugging
    console.error(`[imageToImage] Generated image URL: ${status.images[0].url}`);
    
    return {
      content: [
        { type: "text", text: status.images[0].url },
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
        { type: "text", text: `❌ Error transforming image${statusCode ? ` (${statusCode})` : ''}: ${errorMessage}` },
      ],
    };
  }
}