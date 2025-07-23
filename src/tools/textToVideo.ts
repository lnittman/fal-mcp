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
  prompt: z.string().describe("Description of the video content, style, and motion"),
  model: z.string()
    .default("fal-ai/ltxv-13b-098-distilled")
    .describe("Any fal-ai model ID for video generation"),
  parameters: z.record(z.any()).optional()
    .describe("Additional model-specific parameters (e.g., duration, fps, aspect_ratio, num_frames, frame_rate, motion_intensity, style)"),
};

export const metadata: ToolMetadata = {
  name: "textToVideo",
  description: `Generate videos from text with any fal.ai model.

The agent should discover which models and parameters work best through experimentation.
Different models may use different parameter names - let the API guide you.

Common parameter names to try:
• duration - video length in seconds
• fps, frame_rate - frames per second
• num_frames - total number of frames
• aspect_ratio - video dimensions ("16:9", "1:1", "9:16")
• motion_intensity - control motion amount
• style - visual style preference

Remember: Error messages often reveal the correct parameter names and formats.`,
  annotations: {
    title: "Text to Video (Generic)",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function textToVideo(params: InferSchema<typeof schema>) {
  const { prompt, model, parameters = {} } = params;
  const toolName = 'textToVideo';
  
  try {
    // Initialize and validate
    await validateModel(model, toolName);
    initializeFalClient(toolName);

    // Build input with whatever parameters the agent provides
    const input = {
      prompt,
      ...parameters,
    };

    // Submit to fal.ai
    const response = await submitToFal(model, input, toolName);
    
    // Extract video URL
    const videoUrl = extractVideoUrl(response, toolName);
    
    return formatMediaResult(videoUrl);
  } catch (error: any) {
    return formatError(error, 'Error generating video');
  }
}