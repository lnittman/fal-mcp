import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import {
  initializeFalClient,
  validateModel,
  submitToFal,
  formatMediaResult,
  formatError,
  extractVideoUrl,
} from "../lib/utils/tool-base";

export const schema = {
  imageUrl: z.string().describe("URL of the static image to animate"),
  model: z.string()
    .default("fal-ai/wan-effects")
    .describe("Any fal-ai model ID for image-to-video generation"),
  parameters: z.record(z.any()).optional()
    .describe("Additional model-specific parameters (e.g., prompt, motion_prompt, duration, fps, aspect_ratio, etc.)"),
};

export const metadata: ToolMetadata = {
  name: "imageToVideo",
  description: `Transform static images into dynamic videos with any fal.ai model.

The agent should discover which models and parameters work best through experimentation.
Different models may use different parameter names - let the API guide you.

Common parameter names to try:
• prompt, motion_prompt - describe the desired motion
• duration - video length in seconds
• fps, frame_rate - frames per second
• num_frames - total number of frames
• first_frame_image, image - alternative image parameter names
• aspect_ratio - video dimensions

Remember: Error messages often reveal the correct parameter names and formats.`,
  annotations: {
    title: "Image to Video (Generic)",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function imageToVideo(params: InferSchema<typeof schema>) {
  const { imageUrl, model, parameters = {} } = params;
  const toolName = 'imageToVideo';
  
  try {
    // Validate input
    if (!imageUrl || imageUrl === '') {
      throw new Error("Either imageUrl or imagePath must be provided");
    }
    
    // Initialize and validate
    await validateModel(model, toolName);
    initializeFalClient(toolName);

    // Build input with whatever parameters the agent provides
    // Common parameter names include: image_url, image, first_frame_image, prompt, motion_prompt
    // Let the agent discover which ones work through experimentation
    const input = {
      ...parameters,
      // Try common parameter names - the API will tell us if we're wrong
      image_url: imageUrl,
      image: imageUrl,
      first_frame_image: imageUrl,
    };

    // Submit to fal.ai
    const response = await submitToFal(model, input, toolName);
    
    // Extract video URL
    const videoUrl = extractVideoUrl(response, toolName);
    
    return formatMediaResult(videoUrl);
  } catch (error: any) {
    return formatError(error, 'Error creating video');
  }
}