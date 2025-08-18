import type { InferSchema, ToolMetadata } from "xmcp";
import { z } from "zod";
import { debug } from "../lib/utils/debug";
import {
  extractAudioUrl,
  formatError,
  formatMediaResult,
  initializeFalClient,
  submitToFal,
  validateModel,
} from "../lib/utils/tool-base";

export const schema = {
  prompt: z.string().describe("Description of the music to generate"),
  model: z
    .string()
    .default("fal-ai/stable-audio")
    .describe("Any fal-ai model ID for audio generation"),
  parameters: z
    .record(z.any())
    .optional()
    .describe(
      "Additional model-specific parameters (e.g., duration, seconds_total, duration_seconds, format, output_format)"
    ),
};

export const metadata: ToolMetadata = {
  name: "textToAudio",
  description: `Generate music and audio from text with any fal.ai model.

The agent should discover which models and parameters work best through experimentation.
Different models may use different parameter names - let the API guide you.

Common parameter names to try:
• duration, seconds_total, duration_seconds - audio length
• format, output_format - audio format (mp3, wav, ogg)
• tempo, bpm - beats per minute
• genre, style - musical style hints

Remember: Error messages often reveal the correct parameter names and formats.`,
  annotations: {
    title: "Text to Audio (Generic)",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function textToAudio(params: InferSchema<typeof schema>) {
  const { prompt, model, parameters = {} } = params;
  const toolName = "textToAudio";

  try {
    // Initialize and validate
    await validateModel(model, toolName);
    initializeFalClient(toolName);

    debug(toolName, `Generating audio with prompt: ${prompt}`);

    // Build input with whatever parameters the agent provides
    const input = {
      prompt,
      ...parameters,
    };

    // Submit to fal.ai
    const response = await submitToFal(model, input, toolName);

    // Extract audio URL
    const audioUrl = extractAudioUrl(response, toolName);

    return formatMediaResult(audioUrl);
  } catch (error: any) {
    return formatError(error, "Error generating audio");
  }
}
