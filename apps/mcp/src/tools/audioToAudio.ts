import type { InferSchema, ToolMetadata } from "xmcp";
import { z } from "zod";
import {
  extractAudioUrl,
  formatError,
  formatMediaResult,
  initializeFalClient,
  submitToFal,
  validateModel,
} from "../lib/utils/tool-base";

export const schema = {
  audioUrl: z.string().describe("URL of the input audio to transform"),
  model: z
    .string()
    .default("fal-ai/playai/inpaint/diffusion")
    .describe("Any fal-ai model ID for audio transformation"),
  parameters: z
    .record(z.any())
    .optional()
    .describe(
      "Additional model-specific parameters (e.g., prompt, strength, start_time, end_time, isolate, mode, duration_extension, target_voice)"
    ),
};

export const metadata: ToolMetadata = {
  name: "audioToAudio",
  description: `Transform and edit audio files with any fal.ai model.

The agent should discover which models and parameters work best through experimentation.
Different models may use different parameter names - let the API guide you.

Common parameter names to try:
• audio_url, audio - the input audio
• prompt - describe the transformation
• strength - transformation intensity
• start_time, end_time - for targeted edits
• isolate - what to isolate (e.g., "vocals")
• mode - operation mode (e.g., "inpaint", "outpaint")
• duration_extension - how much to extend
• target_voice - for voice modification

Remember: Error messages often reveal the correct parameter names and formats.`,
  annotations: {
    title: "Audio to Audio (Generic)",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function audioToAudio(params: InferSchema<typeof schema>) {
  const { audioUrl, model, parameters = {} } = params;
  const toolName = "audioToAudio";

  try {
    // Initialize and validate
    await validateModel(model, toolName);
    initializeFalClient(toolName);

    // Build input with whatever parameters the agent provides
    // Common parameter names include: audio_url, audio
    // Let the agent discover which ones work through experimentation
    const input = {
      ...parameters,
      // Try common parameter names - the API will tell us if we're wrong
      audio_url: audioUrl,
      audio: audioUrl,
    };

    // Submit to fal.ai
    const response = await submitToFal(model, input, toolName);

    // Extract audio URL
    const outputUrl = extractAudioUrl(response, toolName);

    return formatMediaResult(outputUrl);
  } catch (error: any) {
    return formatError(error, "Error transforming audio");
  }
}
