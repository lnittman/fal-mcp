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
  prompt: z.string().describe("Text description of the desired image"),
  model: z.string()
    .default("fal-ai/flux/dev")
    .describe("Any fal-ai model ID for image generation"),
  // Generic parameters object that accepts any additional parameters
  parameters: z.record(z.any()).optional()
    .describe("Additional parameters specific to the chosen model (e.g., image_size, num_inference_steps, guidance_scale)"),
};

export const metadata: ToolMetadata = {
  name: "textToImage",
  description: `Generate images from text descriptions using any fal.ai model.

The agent should:
1. Choose an appropriate model based on the task
2. Set parameters based on model documentation or trial and error
3. Learn from responses and adapt

Common models include flux/*, stable-diffusion-*, ideogram/*, recraft/* and many more.
Let the model's error messages guide you to the correct parameters.`,
  annotations: {
    title: "Text to Image (Generic)",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function textToImage(params: InferSchema<typeof schema>) {
  const { prompt, model, parameters = {} } = params;
  const toolName = 'textToImage';
  
  try {
    await validateModel(model, toolName);
    initializeFalClient(toolName);
    
    // Simply pass through whatever parameters the agent provides
    const input = {
      prompt,
      ...parameters
    };
    
    debug(toolName, `Generating image with model ${model}`, { input });
    
    const response = await submitToFal(model, input, toolName);
    const imageUrl = extractImageUrl(response, toolName);
    
    return formatMediaResult(imageUrl);
  } catch (error: any) {
    return formatError(error, 'Error generating image');
  }
}