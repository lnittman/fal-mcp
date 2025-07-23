import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import {
  initializeFalClient,
  validateModel,
  submitToFal,
  formatMediaResult,
  formatError,
  extractImageUrl,
} from "../lib/utils/tool-base";
import { debug } from "../lib/utils/debug";

export const schema = {
  prompt: z.string().describe("Complete prompt including subject and style"),
  model: z.string()
    .default("fal-ai/flux/dev")
    .describe("Any fal-ai model ID for image generation"),
  parameters: z.record(z.any()).optional()
    .describe("Additional model-specific parameters (e.g., image_size, num_inference_steps, guidance_scale, style modifiers)"),
};

export const metadata: ToolMetadata = {
  name: "textToImageStyled",
  description: `Generate images with style exploration. The agent should discover style modifiers through experimentation.

Style Discovery Tips:
• Try combining descriptive terms: "pixel art style", "watercolor painting", "anime illustration"
• Experiment with technical terms: "8k resolution", "cel shading", "impasto technique"
• Mix artistic movements: "impressionist", "art nouveau", "bauhaus"
• Add mood and atmosphere: "dreamy", "dramatic lighting", "ethereal"

Remember: The best styles come from creative experimentation, not fixed presets.`,
  annotations: {
    title: "Text to Image Style Explorer",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function textToImageStyled(params: InferSchema<typeof schema>) {
  const { prompt, model, parameters = {} } = params;
  const toolName = 'textToImageStyled';
  
  try {
    // Initialize and validate
    await validateModel(model, toolName);
    initializeFalClient(toolName);

    debug(toolName, `Generating styled image with prompt: ${prompt}`);

    // Build input with whatever parameters the agent provides
    const input = {
      prompt,
      ...parameters,
    };

    // Submit to fal.ai
    const response = await submitToFal(model, input, toolName);
    
    // Extract image URL
    const imageUrl = extractImageUrl(response, toolName);

    return formatMediaResult(imageUrl);
  } catch (error: any) {
    return formatError(error, 'Error generating styled image');
  }
}