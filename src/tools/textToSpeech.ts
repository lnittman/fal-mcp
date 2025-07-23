import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import {
  initializeFalClient,
  validateModel,
  submitToFal,
  formatMediaResult,
  formatError,
  extractAudioUrl,
} from "../lib/utils/tool-base";
import { debug } from "../lib/utils/debug";

export const schema = {
  text: z.string().describe("Text to convert to speech"),
  voice: z.enum([
    "alloy", "echo", "fable", "nova", "onyx", "shimmer",
    "male1", "male2", "female1", "female2", "child"
  ])
    .default("nova")
    .describe("Voice to use for speech"),
  model: z.string()
    .default("fal-ai/text-to-speech")
    .describe("Speech synthesis model"),
  speed: z.number().min(0.5).max(2).default(1).describe("Speech speed (0.5=slow, 2=fast)"),
  emotion: z.enum(["neutral", "happy", "sad", "angry", "surprised", "calm"])
    .optional()
    .describe("Emotional tone for speech"),
  language: z.enum(["en", "es", "fr", "de", "it", "pt", "pl", "tr", "ru", "nl", "cs", "ar", "zh", "ja", "ko"])
    .default("en")
    .describe("Language for speech"),
};

export const metadata: ToolMetadata = {
  name: "textToSpeech",
  description: "Convert text to natural sounding speech with various voices and emotions. Supports multiple languages",
  annotations: {
    title: "Text to Speech",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function textToSpeech(params: InferSchema<typeof schema>) {
  const { text, voice, model, speed, emotion, language } = params;
  const toolName = 'textToSpeech';
  
  try {
    // Initialize and validate
    await validateModel(model, toolName);
    initializeFalClient(toolName);

    // Build input with common parameters
    // Let the agent discover which parameters work
    const input: any = {
      text,
      // Try different voice parameter names
      voice,
      speaker: voice,
      voice_id: voice,
      // Speed parameters
      speed,
      rate: speed,
      speech_rate: speed,
      // Language parameters
      language,
      lang: language,
      language_code: language,
    };

    // Add emotion if specified
    if (emotion && emotion !== "neutral") {
      input.emotion = emotion;
      input.style = emotion;
      input.mood = emotion;
    }
    
    debug(toolName, `Generating speech for text: "${text.substring(0, 50)}..."`, { voice, language, speed });

    // Submit to fal.ai
    const response = await submitToFal(model, input, toolName);

    // Extract audio URL
    const audioUrl = extractAudioUrl(response, toolName);

    return formatMediaResult(audioUrl);
  } catch (error: any) {
    return formatError(error, 'Error generating speech');
  }
}