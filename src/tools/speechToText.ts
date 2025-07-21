import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import * as fal from "@fal-ai/serverless-client";

export const schema = {
  audioUrl: z.string().describe("URL of the audio file to transcribe"),
  model: z.enum([
    "fal-ai/whisper",
    "fal-ai/speech-to-text"
  ])
    .default("fal-ai/whisper")
    .describe("Speech recognition model"),
  language: z.string().optional().describe("Language code (e.g., 'en', 'es', 'fr'). Leave empty for auto-detection"),
  translate: z.boolean().default(false).describe("Translate to English if source is another language"),
  includeTimestamps: z.boolean().default(false).describe("Include word-level timestamps"),
  task: z.enum(["transcribe", "translate"]).default("transcribe").describe("Task to perform"),
};

export const metadata: ToolMetadata = {
  name: "speechToText",
  description: "Transcribe audio/speech to text with automatic language detection. Can also translate to English",
  annotations: {
    title: "Speech to Text",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function speechToText(params: InferSchema<typeof schema>) {
  const { audioUrl, model, language, translate, includeTimestamps, task } = params;
  
  try {
    // Configure fal client
    fal.config({
      credentials: process.env.FAL_API_KEY,
    });

    // Prepare input
    const input: any = {
      audio_url: audioUrl,
      task: translate ? "translate" : task,
      include_timestamps: includeTimestamps,
    };

    // Add language if specified
    if (language) {
      input.language = language;
    }

    // Submit to fal.ai
    const status = await fal.subscribe(model, {
      input,
      logs: false,
    });

    if (!status.text) {
      throw new Error("No transcription generated");
    }

    const content: any[] = [
      { type: "text", text: `📝 Transcription complete` },
      { type: "text", text: `🔤 Text: "${status.text}"` },
    ];

    // Add detected language if available
    if (status.language) {
      content.push({ type: "text", text: `🌐 Detected language: ${status.language}` });
    }

    // Add timestamps if requested and available
    if (includeTimestamps && status.segments) {
      const timestampInfo = `⏱️ ${status.segments.length} segments with timestamps`;
      content.push({ type: "text", text: timestampInfo });
    }

    // Add translation note if translated
    if (translate || task === "translate") {
      content.push({ type: "text", text: `🔄 Translated to English` });
    }

    return { content };
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
        { type: "text", text: `❌ Error transcribing audio${statusCode ? ` (${statusCode})` : ''}: ${errorMessage}` },
      ],
    };
  }
}