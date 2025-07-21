import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import * as fal from "@fal-ai/serverless-client";

export const schema = {
  imageUrl: z.string().describe("URL of the input image to animate"),
  motionPrompt: z.string().optional().describe("Description of motion to add (e.g., 'gentle breeze', 'zoom in slowly', 'pan left')"),
  model: z.enum([
    "fal-ai/wan-effects",
    "fal-ai/veo3",
    "fal-ai/veo2/image-to-video",
    "fal-ai/kling-video/v2.1/master/image-to-video",
    "fal-ai/minimax/hailuo-02/standard/image-to-video",
    "fal-ai/wan-pro/image-to-video",
    "fal-ai/pixverse/v4.5/image-to-video",
    "fal-ai/bytedance/seedance/v1/pro/image-to-video",
    "fal-ai/stable-video-diffusion/image-to-video",
    "fal-ai/animatediff/image-to-video"
  ])
    .default("fal-ai/wan-effects")
    .describe("Video generation model - wan-effects for effects, veo3 for highest quality"),
  duration: z.number().min(1).max(6).default(3).describe("Video duration in seconds"),
  fps: z.number().min(8).max(30).default(24).describe("Frames per second"),
  motionBucketId: z.number().min(1).max(255).default(127).describe("Motion amount (1=minimal, 255=maximum)"),
};

export const metadata: ToolMetadata = {
  name: "imageToVideo",
  description: "Animate a static image into a video with optional motion control. Can add various motion effects through natural language",
  annotations: {
    title: "Image to Video",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function imageToVideo(params: InferSchema<typeof schema>) {
  const { imageUrl, motionPrompt, model, duration, fps, motionBucketId } = params;
  
  try {
    // Configure fal client
    fal.config({
      credentials: process.env.FAL_API_KEY,
    });

    // Prepare input
    const input: any = {
      image_url: imageUrl,
      num_frames: Math.floor(duration * fps),
      fps,
      motion_bucket_id: motionBucketId,
    };

    // Add motion prompt if provided
    if (motionPrompt) {
      input.motion_prompt = motionPrompt;
    }

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
        { type: "text", text: `❌ Error creating video${statusCode ? ` (${statusCode})` : ''}: ${errorMessage}` },
      ],
    };
  }
}