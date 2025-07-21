import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import * as fal from "@fal-ai/serverless-client";

export const schema = {
  prompt: z.string().describe("Text prompt describing the video to generate"),
  model: z.enum([
    "fal-ai/animatediff/text-to-video",
    "fal-ai/stable-video-diffusion", 
    "fal-ai/text-to-video"
  ])
    .default("fal-ai/animatediff/text-to-video")
    .describe("Video generation model"),
  duration: z.number().min(1).max(10).default(4).describe("Video duration in seconds"),
  fps: z.number().min(8).max(30).default(24).describe("Frames per second"),
  aspectRatio: z.enum(["16:9", "1:1", "9:16"]).default("16:9").describe("Video aspect ratio"),
  motionIntensity: z.number().min(0).max(1).default(0.5).describe("Motion intensity (0=static, 1=high motion)"),
};

export const metadata: ToolMetadata = {
  name: "textToVideo",
  description: "Generate a video from text description. Supports various styles and motion types through natural language prompts",
  annotations: {
    title: "Text to Video",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function textToVideo(params: InferSchema<typeof schema>) {
  const { prompt, model, duration, fps, aspectRatio, motionIntensity } = params;
  
  try {
    // Configure fal client
    fal.config({
      credentials: process.env.FAL_API_KEY,
    });

    // Prepare input based on model requirements
    const [width, height] = aspectRatio === "16:9" ? [1024, 576] : 
                           aspectRatio === "1:1" ? [768, 768] : 
                           [576, 1024];

    const input: any = {
      prompt,
      num_frames: Math.floor(duration * fps),
      fps,
      width,
      height,
      motion_scale: motionIntensity,
    };

    // Submit to fal.ai
    const status = await fal.subscribe(model, {
      input,
      logs: false,
    });

    if (!status.video || !status.video.url) {
      throw new Error("No video generated");
    }

    return {
      content: [
        { type: "text", text: status.video.url },
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
        { type: "text", text: `❌ Error generating video${statusCode ? ` (${statusCode})` : ''}: ${errorMessage}` },
      ],
    };
  }
}