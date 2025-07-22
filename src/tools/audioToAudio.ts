import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import {
  initializeFalClient,
  validateModel,
  submitToFal,
  formatMediaResult,
  formatError,
  extractAudioUrl,
} from "../utils/tool-base";

export const schema = {
  audioUrl: z.string().describe("URL of the input audio to transform"),
  model: z.string()
    .default("fal-ai/playai/inpaint/diffusion")
    .describe("Model ID for audio transformation. Popular: playai/inpaint/diffusion, ace-step/audio-to-audio, elevenlabs/audio-isolation"),
  prompt: z.string()
    .optional()
    .describe("Text description of the desired transformation (model-dependent)"),
  strength: z.number()
    .min(0)
    .max(1)
    .default(0.7)
    .describe("Transformation strength (0=no change, 1=complete transformation)"),
  startTime: z.number()
    .optional()
    .describe("Start time in seconds for modification (for inpainting models)"),
  endTime: z.number()
    .optional()
    .describe("End time in seconds for modification (for inpainting models)"),
};

export const metadata: ToolMetadata = {
  name: "audioToAudio",
  description: `Transform and edit audio files using AI. Modify music, isolate tracks, extend audio, and apply creative effects.

CAPABILITIES:
• Audio inpainting - modify portions of audio
• Audio extension - extend beginning or end
• Track isolation - separate vocals, instruments
• Style transfer - change musical style
• Audio effects and enhancements

MODELS:
• playai/inpaint/diffusion - Smooth audio editing
• ace-step/audio-to-audio - Music transformation
• ace-step/audio-inpaint - Modify audio portions
• ace-step/audio-outpaint - Extend audio
• elevenlabs/audio-isolation - Isolate tracks
• dia-tts/voice-clone - Clone and modify voices

USE CASES:
• Remove or replace parts of a song
• Extend music tracks seamlessly
• Isolate vocals or instruments
• Change musical style or genre
• Fix audio issues
• Create remixes and variations

TIPS:
• Use lower strength for subtle changes
• Specify time ranges for targeted edits
• Combine with prompt for guided transformation
• Chain multiple transformations for complex edits`,
  annotations: {
    title: "Audio to Audio AI",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function audioToAudio(params: InferSchema<typeof schema>) {
  const { audioUrl, model, prompt, strength, startTime, endTime } = params;
  const toolName = 'audioToAudio';
  
  try {
    // Initialize and validate
    await validateModel(model, toolName);
    initializeFalClient(toolName);

    // Prepare input based on model
    let input: any = {};
    
    if (model.includes("playai/inpaint")) {
      input = {
        audio_url: audioUrl,
        prompt: prompt || "Smooth audio transition",
        strength: strength,
        start_time: startTime,
        end_time: endTime,
      };
    } else if (model.includes("ace-step/audio-inpaint")) {
      input = {
        audio_url: audioUrl,
        prompt: prompt || "Fix audio",
        start_time: startTime,
        end_time: endTime,
        mode: "inpaint",
      };
    } else if (model.includes("ace-step/audio-outpaint")) {
      input = {
        audio_url: audioUrl,
        prompt: prompt || "Extend naturally",
        duration_extension: 5, // Default 5 seconds extension
        mode: "outpaint",
      };
    } else if (model.includes("elevenlabs/audio-isolation")) {
      input = {
        audio: audioUrl,
        isolate: prompt || "vocals", // Default to isolating vocals
      };
    } else if (model.includes("voice-clone")) {
      input = {
        audio_url: audioUrl,
        target_voice: prompt || "neutral",
        strength: strength,
      };
    } else {
      // Default input for unknown models
      input = {
        audio_url: audioUrl,
        prompt: prompt,
        strength: strength,
      };
    }

    // Submit to fal.ai
    const response = await submitToFal(model, input, toolName);
    
    // Extract audio URL
    const outputUrl = extractAudioUrl(response, toolName);
    
    return formatMediaResult(outputUrl);
  } catch (error: any) {
    return formatError(error, 'Error transforming audio');
  }
}