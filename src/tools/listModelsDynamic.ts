import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { formatError } from "../utils/tool-base";
import { debug } from "../utils/debug";
import { inferModelCategory, getDynamicModelSuggestions } from "../utils/models";

export const schema = {
  category: z.string().optional().describe("Category hint (e.g., 'text-to-image', 'video', 'audio')"),
  useCase: z.string().optional().describe("Describe what you want to do"),
};

export const metadata: ToolMetadata = {
  name: "listModelsDynamic",
  description: `Dynamic model discovery helper. No hardcoded lists - provides patterns and guidance.

TRULY DYNAMIC:
• No hardcoded model database
• Suggests patterns based on category
• All fal-ai models work automatically
• New models available instantly

USAGE:
• Get patterns: {category: "text-to-image"}
• Get suggestions: {useCase: "create anime artwork"}
• General help: {} (no parameters)

BENEFITS:
• Always up-to-date
• Zero maintenance
• Discovers new models automatically`,
  annotations: {
    title: "Dynamic Model List",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function listModelsDynamic(params: InferSchema<typeof schema>) {
  const { category, useCase } = params;
  const toolName = 'listModelsDynamic';
  
  try {
    debug(toolName, `Listing models`, { category, useCase });
    let output: string[] = [];
    
    if (useCase) {
      // Get dynamic suggestions based on use case
      const suggestions = getDynamicModelSuggestions(useCase);
      output.push(`Dynamic suggestions for "${useCase}":\n`);
      suggestions.forEach(s => output.push(s));
    } else if (category) {
      // Provide patterns for the category
      output.push(`Model patterns for ${category}:\n`);
      
      const patterns: Record<string, string[]> = {
        "text-to-image": [
          "• fal-ai/flux/* - FLUX family models",
          "• fal-ai/stable-diffusion-* - Stable Diffusion variants",
          "• fal-ai/ideogram/* - Text rendering models",
          "• fal-ai/recraft/* - Vector and design models",
          "• fal-ai/*-lora - LoRA models",
        ],
        "image-to-video": [
          "• fal-ai/kling-video/* - Kling video models",
          "• fal-ai/wan-* - WAN animation models",
          "• fal-ai/minimax/* - MiniMax video models",
          "• fal-ai/*/image-to-video - Any I2V endpoints",
        ],
        "text-to-video": [
          "• fal-ai/*/text-to-video - T2V endpoints",
          "• fal-ai/veo* - Google Veo models",
          "• fal-ai/ltxv-* - LTX video models",
        ],
        "audio": [
          "• fal-ai/whisper - Speech to text",
          "• fal-ai/stable-audio - Music generation",
          "• fal-ai/musicgen - Meta's music model",
          "• fal-ai/*/voice-clone - Voice cloning",
        ],
        "upscaling": [
          "• fal-ai/*-sr - Super resolution models",
          "• fal-ai/*/upscale* - Upscaling endpoints",
          "• fal-ai/clarity-* - Clarity upscalers",
          "• fal-ai/pasd - Prompt-guided upscaling",
        ],
      };
      
      const categoryPatterns = patterns[category.toLowerCase()] || [
        `• fal-ai/*/${category} - Direct category endpoints`,
        `• fal-ai/*-${category} - Category-specific models`,
      ];
      
      categoryPatterns.forEach(p => output.push(p));
      
      output.push("\nRemember: These are just patterns!");
      output.push("ANY model starting with 'fal-ai/' will work.");
    } else {
      // General help
      output.push("Dynamic Model Discovery\n");
      output.push("This tool doesn't have a hardcoded model list.");
      output.push("Instead, it helps you discover models dynamically!\n");
      
      output.push("How to find models:");
      output.push("• Visit https://fal.ai to browse all models");
      output.push("• Try any ID starting with 'fal-ai/'");
      output.push("• Use patterns like 'fal-ai/flux/*'");
      output.push("• Models are validated when you use them\n");
      
      output.push("Common patterns:");
      output.push("• Images: fal-ai/flux/*, fal-ai/stable-diffusion-*");
      output.push("• Video: fal-ai/kling-video/*, fal-ai/wan-*");
      output.push("• Audio: fal-ai/whisper, fal-ai/musicgen");
      output.push("• Upscaling: fal-ai/*-sr, fal-ai/clarity-*\n");
      
      output.push("The beauty of dynamic discovery:");
      output.push("New models work instantly without updates!");
    }
    
    return {
      content: [
        { type: "text", text: output.join("\n") },
      ],
    };
  } catch (error: any) {
    return formatError(error, 'Error listing models');
  }
}