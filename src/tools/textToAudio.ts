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
import { debug } from "../utils/debug";

export const schema = {
  prompt: z.string().describe("Description of the music to generate (e.g., 'upbeat electronic music with synth leads', 'calm piano melody')"),
  model: z.string()
    .default("fal-ai/stable-audio")
    .describe("Model ID for audio generation. Popular: stable-audio, musicgen, audiocraft"),
  duration: z.number()
    .min(1)
    .max(30)
    .default(10)
    .describe("Duration of the audio in seconds"),
  format: z.enum(["mp3", "wav", "ogg"])
    .default("mp3")
    .describe("Output audio format"),
};

export const metadata: ToolMetadata = {
  name: "textToAudio",
  description: `Generate music and audio from text descriptions. Create original soundtracks, background music, and audio effects.

CAPABILITIES:
• Generate music in various genres and styles
• Create sound effects and ambient audio
• Control duration and format
• Produce high-quality audio output

USE CASES:
• Background music for videos and games
• Sound effects for multimedia projects
• Podcast intros and outros
• Ambient soundscapes
• Musical sketches and ideas

PROMPT EXAMPLES:
• "Upbeat electronic dance music with heavy bass"
• "Calm acoustic guitar with nature sounds"
• "Epic orchestral score for a battle scene"
• "8-bit retro game music"
• "Jazz piano in a smoky lounge"

TIPS:
• Be specific about instruments and mood
• Mention tempo (slow, fast, 120 BPM)
• Include genre and style references
• Describe the atmosphere you want`,
  annotations: {
    title: "Text to Audio Generation",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function textToAudio(params: InferSchema<typeof schema>) {
  const { prompt, model, duration, format } = params;
  const toolName = 'textToAudio';
  
  try {
    // Initialize and validate
    await validateModel(model, toolName);
    initializeFalClient(toolName);

    // Prepare input based on model
    let input: any = {};
    
    if (model.includes("stable-audio")) {
      input = {
        prompt,
        seconds_total: duration,
        output_format: format,
      };
    } else if (model.includes("musicgen")) {
      input = {
        prompt,
        duration: duration,
        format: format,
      };
    } else if (model.includes("audiocraft")) {
      input = {
        prompt,
        duration: duration,
        format: format,
      };
    } else {
      // Generic audio model input
      input = {
        prompt,
        duration_seconds: duration,
        output_format: format,
      };
    }
    
    debug(toolName, `Generating audio with prompt: ${prompt}`, { model, duration, format });

    // Submit to fal.ai
    const response = await submitToFal(model, input, toolName);

    // Extract audio URL
    const audioUrl = extractAudioUrl(response, toolName);

    return formatMediaResult(audioUrl);
  } catch (error: any) {
    return formatError(error, 'Error generating audio');
  }
}