import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import * as fal from "@fal-ai/serverless-client";

export const schema = {
  prompt: z.string().describe("Text prompt for image generation"),
  model: z.enum(["fal-ai/flux/dev", "fal-ai/flux/schnell", "fal-ai/flux/pro"])
    .default("fal-ai/flux/dev")
    .describe("fal model to use"),
  imageSize: z.enum(["square", "landscape_4_3", "portrait_4_3", "landscape_16_9", "portrait_16_9"])
    .optional()
    .describe("Aspect ratio for the generated image"),
  numInferenceSteps: z.number().min(1).max(50).optional().describe("Number of inference steps"),
  guidanceScale: z.number().min(1).max(20).optional().describe("Guidance scale for generation"),
};

export const metadata: ToolMetadata = {
  name: "textToImage",
  description: "Generate an image from text using fal.ai models. You can specify any style in the prompt (e.g., 'pixel art cat', '8-bit style dog', 'watercolor landscape')",
  annotations: {
    title: "Text to Image",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function textToImage(params: InferSchema<typeof schema>) {
  const { prompt, model, imageSize, numInferenceSteps, guidanceScale } = params;
  
  try {
    // Configure fal client
    fal.config({
      credentials: process.env.FAL_API_KEY,
    });

    // Prepare input based on model
    const input: any = {
      prompt,
    };

    if (imageSize) {
      input.image_size = imageSize;
    }

    if (numInferenceSteps !== undefined) {
      input.num_inference_steps = numInferenceSteps;
    }

    if (guidanceScale !== undefined) {
      input.guidance_scale = guidanceScale;
    }

    // Use subscribe instead of queue for better reliability
    const status = await fal.subscribe(model, {
      input,
      logs: false,
    });

    if (!status.images || status.images.length === 0) {
      throw new Error("No images generated");
    }

    // Log for debugging
    console.error(`[textToImage] Generated image URL: ${status.images[0].url}`);
    
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
        { type: "text", text: `❌ Error generating image${statusCode ? ` (${statusCode})` : ''}: ${errorMessage}` },
      ],
    };
  }
}