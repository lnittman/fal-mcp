import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import * as fal from "@fal-ai/serverless-client";

export const schema = {
  text: z.string().describe("Text to convert to speech"),
  voice: z.enum([
    "alloy", "echo", "fable", "nova", "onyx", "shimmer",
    "male1", "male2", "female1", "female2", "child"
  ])
    .default("nova")
    .describe("Voice to use for speech"),
  model: z.enum([
    "fal-ai/text-to-speech",
    "fal-ai/wizmodel-v2",
    "fal-ai/tortoise-tts"
  ])
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
  
  try {
    // Configure fal client
    fal.config({
      credentials: process.env.FAL_API_KEY,
    });

    // Prepare input
    const input: any = {
      text,
      voice,
      speed,
      language,
    };

    // Add emotion if specified and model supports it
    if (emotion && emotion !== "neutral") {
      input.emotion = emotion;
    }

    // Submit to fal.ai
    const status = await fal.subscribe(model, {
      input,
      logs: false,
    });

    if (!status.audio || !status.audio.url) {
      throw new Error("No audio generated");
    }

    // Calculate approximate duration
    const wordCount = text.split(/\s+/).length;
    const approxDuration = Math.round((wordCount / 150) * 60 / speed);

    return {
      content: [
        { type: "text", text: status.audio.url },
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
        { type: "text", text: `❌ Error generating speech${statusCode ? ` (${statusCode})` : ''}: ${errorMessage}` },
      ],
    };
  }
}