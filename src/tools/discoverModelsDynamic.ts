import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { formatError } from "../utils/tool-base";
import { debug } from "../utils/debug";
import { validateModelDynamic, inferModelCategory } from "../utils/models";
import { getModelSuggestionsAI } from "../utils/fal-client";

export const schema = {
  operation: z.enum(["validate", "suggest", "infer"])
    .describe("Operation: validate (check model), suggest (get recommendations), infer (get category from model ID)"),
  modelId: z.string().optional().describe("Model ID to validate or analyze"),
  useCase: z.string().optional().describe("Describe your use case for suggestions"),
};

export const metadata: ToolMetadata = {
  name: "discoverModelsDynamic",
  description: `Truly dynamic model discovery for fal.ai. No hardcoded lists - validates models in real-time.

OPERATIONS:
• validate - Check if a model ID is valid format
• suggest - Get usage suggestions for your use case
• infer - Infer category from model ID

HOW IT WORKS:
• No hardcoded model database
• Accepts ANY fal-ai model ID
• Validation happens when you use the model
• True dynamic discovery

EXAMPLES:
• Validate: {operation: "validate", modelId: "fal-ai/flux/dev"}
• Suggest: {operation: "suggest", useCase: "create anime artwork"}
• Infer: {operation: "infer", modelId: "fal-ai/kling-video/v2.1/master"}

BENEFITS:
• Always up-to-date with latest models
• No maintenance needed
• Discover new models as they're released
• Zero hardcoded limitations`,
  annotations: {
    title: "Dynamic Model Discovery",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function discoverModelsDynamic(params: InferSchema<typeof schema>) {
  const { operation, modelId, useCase } = params;
  const toolName = 'discoverModelsDynamic';
  
  try {
    debug(toolName, `Performing ${operation} operation`, { modelId, useCase });
    let results: string[] = [];
    
    switch (operation) {
      case "validate": {
        if (!modelId) {
          throw new Error("Model ID is required for validation");
        }
        
        const isValid = await validateModelDynamic(modelId);
        
        if (isValid) {
          results.push(`Model ID format is valid: "${modelId}"`);
          results.push(`\nThis model ID follows the fal-ai naming convention.`);
          results.push(`The actual model will be validated when you use it.`);
          
          const category = inferModelCategory(modelId);
          if (category !== 'unknown') {
            results.push(`\nInferred category: ${category}`);
          }
        } else {
          results.push(`Invalid model ID format: "${modelId}"`);
          results.push(`\nModel IDs should start with 'fal-ai/'`);
          results.push(`Example: fal-ai/flux/dev`);
        }
        break;
      }
      
      case "suggest": {
        if (!useCase) {
          results.push("Model Discovery Tips:\n");
          results.push("• Visit https://fal.ai to browse available models");
          results.push("• Try any model ID that starts with 'fal-ai/'");
          results.push("• Common patterns:");
          results.push("  - Text to Image: fal-ai/flux/*, fal-ai/stable-diffusion-*");
          results.push("  - Video: fal-ai/kling-video/*, fal-ai/wan-*");
          results.push("  - Audio: fal-ai/whisper, fal-ai/musicgen");
          results.push("  - Upscaling: fal-ai/aura-sr, fal-ai/clarity-upscaler");
        } else {
          const suggestions = await getModelSuggestionsAI(useCase);
          results.push(`Suggestions for "${useCase}":\n`);
          suggestions.forEach(s => results.push(`• ${s}`));
        }
        break;
      }
      
      case "infer": {
        if (!modelId) {
          throw new Error("Model ID is required for inference");
        }
        
        const category = inferModelCategory(modelId);
        results.push(`Model: ${modelId}`);
        results.push(`Inferred Category: ${category}`);
        
        if (category !== 'unknown') {
          results.push(`\nThis appears to be a ${category.replace('-', ' ')} model.`);
          results.push(`You can use it with the appropriate tool.`);
        } else {
          results.push(`\nCategory couldn't be inferred, but you can still try using it.`);
          results.push(`The model will be validated when you attempt to use it.`);
        }
        break;
      }
    }
    
    results.push("\n\nRemember: This is truly dynamic!");
    results.push("Any valid fal-ai model ID will work, even brand new ones.");
    
    return {
      content: [
        { type: "text", text: results.join("\n") },
      ],
    };
  } catch (error: any) {
    return formatError(error, 'Error in model discovery');
  }
}