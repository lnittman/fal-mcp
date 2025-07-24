import * as fs from "fs-extra";
import * as path from "path";
import type { InferSchema, ToolMetadata } from "xmcp";
import { z } from "zod";
import { formatError } from "../lib/utils/tool-base";

export const schema = {
  modelId: z.string().describe("The fal.ai model ID to get documentation for"),
};

export const metadata: ToolMetadata = {
  name: "modelDocs",
  description: `Get detailed documentation for a specific fal.ai model including parameters and examples.

This tool provides model-specific documentation if available, helping agents understand:
• Required and optional parameters
• Parameter types and ranges
• Output schemas
• Usage examples
• Best practices`,
  annotations: {
    title: "Model Documentation",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function modelDocs(params: InferSchema<typeof schema>) {
  const { modelId } = params;

  try {
    // Convert model ID to filename (replace / with -)
    const filename = modelId.replace("fal-ai/", "").replace(/\//g, "-") + ".md";
    const docPath = path.join(__dirname, "../../prompts/models", filename);

    // Check if documentation exists
    if (await fs.pathExists(docPath)) {
      const content = await fs.readFile(docPath, "utf-8");
      return {
        content: [{ type: "text", text: content }],
      };
    }

    // Fallback to generic guidance
    return {
      content: [
        {
          type: "text",
          text: `No specific documentation found for ${modelId}.

Generic guidance for discovering parameters:
1. Try common parameter names based on the model type
2. Submit a request and learn from any error messages
3. Check similar model documentation for patterns
4. Start with minimal parameters and add as needed

Common parameter patterns:
• Text-to-image: prompt, image_size, num_inference_steps, guidance_scale
• Image-to-image: image_url, prompt, strength
• Video generation: prompt, duration, fps, aspect_ratio
• Audio generation: prompt, duration, format
• Speech: text, voice, language, speed

Remember: The API will guide you with specific error messages if parameters are incorrect.`,
        },
      ],
    };
  } catch (error: any) {
    return formatError(error, "Error retrieving model documentation");
  }
}
