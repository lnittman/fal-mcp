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
  imageUrl: z.string().describe("URL of the static image to animate. Works with photos, illustrations, or any visual content"),
  motionPrompt: z.string().optional().describe("Natural language description of desired motion (e.g., 'gentle swaying in the wind', 'slow zoom into the subject', 'camera panning from left to right')"),
  model: z.string()
    .default("fal-ai/wan-effects")
    .describe("Model ID for video generation. Use listModels with category='image-to-video' to see all available models. Popular: wan-effects, kling-video/v2.1/master, minimax/hailuo-02/pro"),
  duration: z.number().min(2).max(6).default(4).describe("Video duration in seconds (model-dependent limits)"),
  fps: z.number().min(8).max(30).default(24).describe("Frames per second - higher values create smoother motion"),
  motionBucketId: z.number().min(1).max(255).default(127).describe("Motion intensity control: 1-50 for subtle, 50-150 for moderate, 150-255 for dramatic motion"),
};

export const metadata: ToolMetadata = {
  name: "imageToVideo",
  description: `Transform static images into dynamic videos with AI-driven animation. Bring photos to life with natural motion and cinematic effects.

CAPABILITIES:
• Animate any static image with realistic motion
• Add camera movements (pan, zoom, rotate)
• Create natural environmental effects (wind, water, fire)
• Generate smooth transitions and movements
• Preserve image quality while adding motion

INPUT REQUIREMENTS:
• High-quality input image (minimum 512x512)
• Clear subjects work best
• Good lighting and composition help

MOTION TYPES:
• Environmental: Wind, water ripples, fire flickering, clouds moving
• Camera: Zoom in/out, pan left/right/up/down, rotate, dolly
• Subject: Subtle breathing, eye movements, hair flowing
• Abstract: Morphing, pulsing, swirling effects

USE CASES:
• Social media content - Make static posts more engaging
• Product showcases - Add dynamic interest to product photos
• Portrait animation - Bring photos to life with subtle movements
• Landscape cinematics - Add atmospheric motion to scenes
• Creative storytelling - Transform stills into video narratives
• Marketing materials - Eye-catching animated visuals

MOTION PROMPT EXAMPLES:
• "Gentle breeze moving through hair and clothes"
• "Slow zoom into the subject's eyes with subtle blink"
• "Ocean waves gently lapping, clouds drifting slowly"
• "Camera slowly panning across the landscape"
• "Flickering candlelight with dancing shadows"
• "Subtle breathing motion for portraits"

TIPS FOR BEST RESULTS:
• Start with high-quality, well-composed images
• Use specific, descriptive motion prompts
• Match motion intensity to image content
• Consider the story you want to tell
• Test different motion intensities for optimal results`,
  annotations: {
    title: "Image Animation AI",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function imageToVideo(params: InferSchema<typeof schema>) {
  const { imageUrl, motionPrompt, model, duration, fps, motionBucketId } = params;
  const toolName = 'imageToVideo';
  
  try {
    // Initialize and validate
    await validateModel(model, toolName);
    initializeFalClient(toolName);

    // Prepare input based on model
    let input: any = {};
    
    if (model.includes("wan-effects") || model.includes("wan-i2v")) {
      input = {
        image_url: imageUrl,
        motion_prompt: motionPrompt,
        duration: duration,
        fps: 24,
      };
    } else if (model.includes("wan-pro")) {
      input = {
        image_url: imageUrl,
        prompt: motionPrompt || "Animate the image",
        duration: duration,
      };
    } else if (model.includes("kling-video")) {
      input = {
        image_url: imageUrl,
        prompt: motionPrompt || "Natural motion",
        duration: duration,
        aspect_ratio: "16:9",
      };
    } else if (model.includes("minimax")) {
      input = {
        prompt: motionPrompt || "Animate the image with natural motion",
        first_frame_image: imageUrl,
      };
    } else if (model.includes("veo2")) {
      input = {
        image_url: imageUrl,
        prompt: motionPrompt || "Bring the image to life with natural motion",
      };
    } else if (model.includes("seedance")) {
      input = {
        image_url: imageUrl,
        prompt: motionPrompt || "Bring the image to life",
        fps: fps,
        duration: duration,
      };
    } else if (model.includes("pixverse")) {
      input = {
        image: imageUrl,
        prompt: motionPrompt || "Animate with smooth motion",
        duration: duration,
      };
    } else if (model.includes("ltxv")) {
      input = {
        image_url: imageUrl,
        prompt: motionPrompt || "Animate the scene",
        num_frames: Math.min(121, Math.floor(duration * fps)),
        frame_rate: fps,
      };
    } else {
      // Default input structure for unknown models
      input = {
        image_url: imageUrl,
        prompt: motionPrompt || "Animate the image",
        duration: duration,
      };
    }

    // Submit to fal.ai
    const response = await submitToFal(model, input, toolName);
    
    // Extract video URL
    const videoUrl = extractVideoUrl(response, toolName);
    
    return formatMediaResult(videoUrl);
  } catch (error: any) {
    return formatError(error, 'Error creating video');
  }
}