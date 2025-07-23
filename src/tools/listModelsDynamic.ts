import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { formatError } from "../lib/utils/tool-base";
import { debug } from "../lib/utils/debug";

export const schema = {
  query: z.string().optional().describe("Optional search query to explore models"),
};

export const metadata: ToolMetadata = {
  name: "listModelsDynamic",
  description: `Explore fal.ai models through true discovery, not prescriptive lists.

This tool encourages exploration rather than providing fixed lists.
The agent should use this as a starting point for discovery, not as a definitive catalog.

Remember: ANY model starting with 'fal-ai/' can be used!`,
  annotations: {
    title: "Dynamic Model Explorer",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function listModelsDynamic(params: InferSchema<typeof schema>) {
  const { query } = params;
  const toolName = 'listModelsDynamic';
  
  try {
    debug(toolName, `Exploring models`, { query });
    
    const output: string[] = [];
    
    output.push("**Dynamic Model Discovery**\n");
    output.push("This is not a complete list - it's a starting point for exploration!");
    output.push("ANY model ID starting with 'fal-ai/' will work.\n");
    
    if (query) {
      output.push(`**Exploration suggestions for "${query}":**\n`);
      output.push("Based on common naming patterns, you might try:");
      output.push(`• fal-ai/${query}/*`);
      output.push(`• fal-ai/*-${query}*`);
      output.push(`• fal-ai/*/${query}`);
      output.push("\nBut don't limit yourself to these patterns!");
    }
    
    output.push("\n**How to Explore:**");
    output.push("1. Try model IDs that seem relevant to your task");
    output.push("2. Model names often hint at their capabilities");
    output.push("3. Use discoverModelsDynamic to validate IDs");
    output.push("4. Learn from API responses when you try a model");
    output.push("5. Build your own knowledge through experimentation");
    
    output.push("\n**Common Naming Patterns (NOT exhaustive):**");
    output.push("• Task-based: */text-to-image, */image-to-video, */upscale");
    output.push("• Model families: flux/*, stable-diffusion-*, whisper/*");
    output.push("• Versions: */v1, */v2, */pro, */fast");
    output.push("• Capabilities: *-lora, *-controlnet, *-inpaint");
    
    output.push("\n**Discovery Tips:**");
    output.push("• Visit https://fal.ai to see featured models");
    output.push("• Try variations of model names you know");
    output.push("• Experiment with different parameter combinations");
    output.push("• Learn from errors - they often reveal what's expected");
    
    output.push("\n**Remember:**");
    output.push("This tool doesn't have a database of models.");
    output.push("New models are added constantly and work immediately.");
    output.push("The best way to learn is through experimentation!");
    
    return {
      content: [
        { type: "text", text: output.join("\n") },
      ],
    };
  } catch (error: any) {
    return formatError(error, 'Error in model exploration');
  }
}