import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { formatError } from "../lib/utils/tool-base";
import { debug } from "../lib/utils/debug";

export const schema = {
  task: z.string().describe("What you want to accomplish"),
  context: z.record(z.any()).optional().describe("Any additional context like previous attempts, errors encountered, or specific requirements"),
};

export const metadata: ToolMetadata = {
  name: "recommendModel",
  description: `Help the agent discover appropriate models through exploration.

This tool provides discovery strategies, not prescriptive recommendations.
The agent should use this to learn HOW to find models, not WHICH models to use.

The agent is encouraged to:
1. Use listModelsDynamic and discoverModelsDynamic for exploration
2. Try models and learn from their responses
3. Build its own knowledge through experience
4. Share what it has learned from previous attempts`,
  annotations: {
    title: "Model Discovery Helper",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function recommendModel(params: InferSchema<typeof schema>) {
  const { task, context = {} } = params;
  const toolName = 'recommendModel';
  
  try {
    debug(toolName, `Helping with discovery for: ${task}`, { context });
    
    const guidance: string[] = [];
    
    guidance.push(`**Discovery Strategy for: "${task}"**\n`);
    
    guidance.push("**How to Discover Models:**");
    guidance.push("1. Use listModelsDynamic to explore model patterns");
    guidance.push("2. Use modelDocs to get detailed documentation for specific models");
    guidance.push("3. Use discoverModelsDynamic to validate model IDs");
    guidance.push("4. Try models with generic parameters first");
    guidance.push("5. Learn from error messages - they often reveal correct parameter names");
    guidance.push("6. Iterate based on results\n");
    
    guidance.push("**Discovery Process:**");
    guidance.push("• Start broad: Try models that seem related to your task");
    guidance.push("• Check docs: Use modelDocs tool for detailed parameter info");
    guidance.push("• Test hypotheses: If a model name contains relevant keywords, try it");
    guidance.push("• Learn from errors: API errors often show expected parameters");
    guidance.push("• Build knowledge: What you learn applies to similar models\n");
    
    guidance.push("**Common Model Patterns:**");
    guidance.push("• flux/* - High-quality image generation");
    guidance.push("• stable-diffusion/* - Versatile image generation");
    guidance.push("• whisper/* - Speech transcription");
    guidance.push("• kling-video/*, wan-* - Video generation");
    guidance.push("• stable-audio/*, musicgen/* - Audio/music generation");
    guidance.push("• birefnet, rembg - Background removal");
    guidance.push("• aura-sr, clarity-upscaler - Image upscaling\n");
    
    guidance.push("**Remember:**");
    guidance.push("• Every fal-ai/* model is available to try");
    guidance.push("• Model names often hint at their purpose");
    guidance.push("• Use modelDocs for detailed parameter information");
    guidance.push("• There's no 'wrong' model to try - experiment freely");
    guidance.push("• Success comes from exploration, not prescription");
    
    if (context.previousAttempts) {
      guidance.push("\n**Learning from Your Previous Attempts:**");
      guidance.push("• What error messages did you receive?");
      guidance.push("• Did the errors suggest parameter names?");
      guidance.push("• Have you checked modelDocs for this model?");
      guidance.push("• Can you try similar models with adjusted parameters?");
    }
    
    guidance.push("\n**Next Steps:**");
    guidance.push("1. List available models for your task category");
    guidance.push("2. Use modelDocs to understand a model's parameters");
    guidance.push("3. Pick one that seems relevant and try it");
    guidance.push("4. Adjust based on the response");
    guidance.push("5. Try alternatives if needed");
    guidance.push("6. Build your own understanding of what works");
    
    return {
      content: [
        { type: "text", text: guidance.join("\n") },
      ],
    };
  } catch (error: any) {
    return formatError(error, 'Error in discovery helper');
  }
}