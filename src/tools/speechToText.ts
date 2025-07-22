import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import {
  initializeFalClient,
  validateModel,
  submitToFal,
  formatError,
} from "../utils/tool-base";
import { debug } from "../utils/debug";

export const schema = {
  audioUrl: z.string().describe("URL of the audio file to transcribe"),
  model: z.string()
    .default("fal-ai/whisper")
    .describe("Speech recognition model"),
  language: z.string().optional().describe("Language code (e.g., 'en', 'es', 'fr'). Leave empty for auto-detection"),
  translate: z.boolean().default(false).describe("Translate to English if source is another language"),
  includeTimestamps: z.boolean().default(false).describe("Include word-level timestamps"),
  task: z.enum(["transcribe", "translate"]).default("transcribe").describe("Task to perform"),
};

export const metadata: ToolMetadata = {
  name: "speechToText",
  description: `Convert speech and audio to accurate text transcriptions. Supports multiple languages with automatic detection and optional translation.

CAPABILITIES:
• Transcribe speech in 100+ languages with high accuracy
• Automatic language detection - no need to specify
• Real-time translation to English from any language
• Generate word-level timestamps for subtitles
• Handle various audio formats and qualities
• Process long-form content like podcasts and meetings

USE CASES:
• Content Creation - Transcribe podcasts, videos, and interviews
• Accessibility - Generate subtitles and closed captions
• Documentation - Convert meetings and lectures to text
• Translation - Transcribe and translate foreign content
• Research - Analyze spoken content at scale
• Archiving - Create searchable text from audio archives

SUPPORTED FORMATS:
• Audio files: MP3, WAV, M4A, FLAC, OGG, WebM
• Video files: MP4, MOV, AVI (audio track extracted)
• Various bitrates and sample rates
• Mono and stereo audio

LANGUAGE SUPPORT:
• 100+ languages including English, Spanish, French, German, Chinese, Japanese
• Automatic detection works well for clear speech
• Specify language code for better accuracy with accents
• Mixed language content supported

FEATURES:
• Word-level timestamps for precise subtitle generation
• Speaker diarization (in development)
• Punctuation and capitalization
• Handles background noise and multiple speakers

TIPS FOR BEST RESULTS:
• Use high-quality audio when possible (16kHz+ sample rate)
• Minimize background noise and echo
• For technical content, specify the language
• Use timestamps for video subtitle creation
• Choose translate task for instant translation`,
  annotations: {
    title: "Audio Transcription AI",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function speechToText(params: InferSchema<typeof schema>) {
  const { audioUrl, model, language, translate, includeTimestamps, task } = params;
  const toolName = 'speechToText';
  
  try {
    // Initialize and validate
    await validateModel(model, toolName);
    initializeFalClient(toolName);

    // Prepare input based on model
    let input: any = {};
    
    if (model.includes("whisper")) {
      input = {
        audio_url: audioUrl,
        task: translate ? "translate" : task,
        return_timestamps: includeTimestamps,
      };
      if (language) {
        input.language = language;
      }
    } else {
      // Generic speech-to-text model input
      input = {
        audio_url: audioUrl,
        task: translate ? "translate" : task,
        include_timestamps: includeTimestamps,
      };
      if (language) {
        input.language = language;
      }
    }
    
    debug(toolName, `Transcribing audio`, { model, task, language, includeTimestamps });

    // Submit to fal.ai
    const response = await submitToFal(model, input, toolName);

    // Extract transcription
    let text = '';
    if (response.text) {
      text = response.text;
    } else if (response.transcription) {
      text = response.transcription;
    } else if (response.chunks && Array.isArray(response.chunks)) {
      text = response.chunks.map((c: any) => c.text || c.transcript).join(' ');
    } else {
      throw new Error("No transcription found in response");
    }

    // Build simple response
    let result = text;
    
    // Add metadata if available
    const metadata: string[] = [];
    if (response.language) {
      metadata.push(`Language: ${response.language}`);
    }
    if (translate || task === "translate") {
      metadata.push("Translated to English");
    }
    if (includeTimestamps && (response.segments || response.timestamps)) {
      const segmentCount = response.segments?.length || response.timestamps?.length || 0;
      metadata.push(`${segmentCount} segments with timestamps`);
    }
    
    if (metadata.length > 0) {
      result += `\n\n[${metadata.join(', ')}]`;
    }

    return {
      content: [
        { type: "text", text: result },
      ],
    };
  } catch (error: any) {
    return formatError(error, 'Error transcribing audio');
  }
}