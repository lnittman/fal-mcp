import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { formatError } from "../lib/utils/tool-base";
import { debug } from "../lib/utils/debug";

export const schema = {
  prompt: z.string().describe("Original prompt to enhance"),
  model: z.string().optional().describe("Target model (e.g., 'fal-ai/flux/dev') for model-specific optimization"),
  type: z.enum(["image", "video", "audio"]).optional().describe("Media type for context-aware enhancement"),
  preset: z.string().optional().describe("Optional style preset (e.g., 'pixel-art', 'photography', 'anime')"),
};

export const metadata: ToolMetadata = {
  name: "enhancePrompt",
  description: `Optimize prompts for fal.ai models using structured XML format.
  
CAPABILITIES:
• Enhances prompts with structured XML tags for better model understanding
• Adds model-specific optimizations based on best practices
• Incorporates style presets for consistent outputs
• Provides negative prompts to avoid unwanted artifacts

USAGE EXAMPLES:
• Basic enhancement: { prompt: "cat" }
• Model-specific: { prompt: "landscape", model: "fal-ai/flux/dev" }
• With preset: { prompt: "character", preset: "pixel-art" }

OUTPUT FORMAT:
Returns XML-structured prompt with:
<subject> - Core subject
<style> - Visual style and artistic direction
<composition> - Layout and framing
<negative> - Elements to avoid
<details> - Additional specifics

BENEFITS:
• Consistently higher quality outputs
• Better adherence to artistic intent
• Reduced need for iterations
• Model-optimized formatting`,
  annotations: {
    title: "Prompt Enhancer",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function enhancePrompt(params: InferSchema<typeof schema>) {
  const { prompt, model, type, preset } = params;
  const toolName = 'enhancePrompt';
  
  try {
    debug(toolName, `Enhancing prompt`, { prompt, model, type, preset });
    
    // Determine media type if not provided
    const mediaType = type || (model?.includes('video') ? 'video' : 
                              model?.includes('audio') ? 'audio' : 'image');
    
    // Build enhanced prompt based on model and preset
    let enhancedPrompt = `<prompt>`;
    
    // Add subject
    enhancedPrompt += `<subject>${prompt}</subject>`;
    
    // Add style based on preset and model
    let style = "";
    if (preset === "pixel-art") {
      style = "pixel art, 8-bit, limited color palette, retro game aesthetic";
      if (model?.includes("flux")) {
        style += ", clean pixels, no anti-aliasing, sharp edges";
      }
    } else if (preset === "photography") {
      style = "professional photography, high resolution, detailed";
    } else if (preset === "anime") {
      style = "anime style, vibrant colors, detailed character design";
    } else if (preset === "watercolor") {
      style = "watercolor painting, soft edges, flowing colors";
    } else {
      // Generic enhancement based on model
      if (model?.includes("flux")) {
        style = "high quality, detailed, professional";
      } else {
        style = "detailed, high quality";
      }
    }
    enhancedPrompt += `<style>${style}</style>`;
    
    // Add composition guidance
    enhancedPrompt += `<composition>well composed, balanced, visually appealing</composition>`;
    
    // Add negative prompts based on media type
    let negative = "";
    if (mediaType === "image") {
      negative = "blurry, low quality, distorted proportions, extra limbs, bad anatomy";
      if (preset === "pixel-art") {
        negative += ", modern, realistic, anti-aliased, smooth gradients";
      }
    } else if (mediaType === "video") {
      negative = "blurry, low quality, choppy motion, inconsistent lighting";
    } else if (mediaType === "audio") {
      negative = "distorted, low quality, clipping, background noise";
    }
    enhancedPrompt += `<negative>${negative}</negative>`;
    
    // Add details based on model
    if (model?.includes("flux")) {
      enhancedPrompt += `<details>highly detailed, sharp focus, professional quality</details>`;
    }
    
    enhancedPrompt += `</prompt>`;
    
    return {
      content: [
        { type: "text", text: enhancedPrompt },
      ],
    };
  } catch (error: any) {
    return formatError(error, 'Error enhancing prompt');
  }
}