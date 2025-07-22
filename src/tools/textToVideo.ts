import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import {
  initializeFalClient,
  validateModel,
  submitToFal,
  formatMediaResult,
  formatError,
  extractVideoUrl,
} from "../utils/tool-base";

export const schema = {
  prompt: z.string().describe("Detailed description of the video content, style, and motion. Be specific about camera movements, scene elements, and visual style"),
  model: z.string()
    .default("fal-ai/ltxv-13b-098-distilled")
    .describe("Video model: veo3 for highest quality, minimax for realism, kling for cinematic, ltxv for fast generation"),
  duration: z.number().min(2).max(10).default(5).describe("Video duration in seconds (model-dependent limits)"),
  fps: z.number().min(8).max(30).default(24).describe("Frames per second for smooth motion"),
  aspectRatio: z.enum(["16:9", "1:1", "9:16"]).default("16:9").describe("Video aspect ratio: 16:9 for landscape, 1:1 for square, 9:16 for portrait/mobile"),
  motionIntensity: z.number().min(0).max(1).default(0.5).describe("Motion amount: 0 for minimal movement, 1 for dynamic action"),
};

export const metadata: ToolMetadata = {
  name: "textToVideo",
  description: `Generate videos from text descriptions using AI. Create animations, scenes, and visual narratives through natural language.

CAPABILITIES:
• Generate realistic or stylized videos from text prompts
• Control camera movements and scene dynamics
• Create various video formats and aspect ratios
• Adjust motion intensity for different effects

INPUT GUIDANCE:
• Be specific about visual elements, colors, and style
• Describe camera movements (pan, zoom, rotate)
• Mention lighting and atmosphere
• Specify any text or titles to appear

USE CASES:
• Social media content creation
• Product demonstrations and animations
• Creative storytelling and narratives
• Marketing and promotional videos
• Educational content visualization
• Concept visualization and prototyping

STYLE EXAMPLES:
• "Cinematic drone shot over misty mountains at sunrise"
• "Hand-drawn animation of a bouncing ball, sketch style"
• "Futuristic cityscape with neon lights, cyberpunk aesthetic"
• "Slow-motion water splash, macro photography style"

TIPS:
• Include style keywords: cinematic, animated, realistic, artistic
• Specify motion: slow-motion, time-lapse, smooth tracking
• Add mood: dramatic, peaceful, energetic, mysterious
• Consider continuity for longer videos`,
  annotations: {
    title: "Text to Video AI",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function textToVideo(params: InferSchema<typeof schema>) {
  const { prompt, model, duration, fps, aspectRatio, motionIntensity } = params;
  const toolName = 'textToVideo';
  
  try {
    // Initialize and validate
    await validateModel(model, toolName);
    initializeFalClient(toolName);

    // Prepare input based on model
    let input: any = {};
    
    if (model.includes("veo3")) {
      input = {
        prompt,
        duration: duration,
        aspect_ratio: aspectRatio,
      };
    } else if (model.includes("minimax")) {
      input = {
        prompt,
        duration: duration,
      };
    } else if (model.includes("kling-video")) {
      input = {
        prompt,
        duration: duration,
        aspect_ratio: aspectRatio,
      };
    } else if (model.includes("seedance")) {
      input = {
        prompt,
        duration: duration,
        fps: fps,
      };
    } else if (model.includes("ltxv")) {
      input = {
        prompt,
        num_frames: Math.min(121, Math.floor(duration * fps)),
        frame_rate: fps,
        motion_intensity: motionIntensity,
      };
    } else if (model.includes("pixverse")) {
      input = {
        prompt,
        duration: duration,
        style: "realistic", // Default style
      };
    } else {
      // Default input for unknown models
      input = {
        prompt,
        duration: duration,
        fps: fps,
      };
    }

    // Submit to fal.ai
    const response = await submitToFal(model, input, toolName);
    
    // Extract video URL
    const videoUrl = extractVideoUrl(response, toolName);
    
    return formatMediaResult(videoUrl);
  } catch (error: any) {
    return formatError(error, 'Error generating video');
  }
}