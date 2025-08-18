import type { InferSchema, ToolMetadata } from "xmcp";
import { z } from "zod";
import { debug } from "../lib/utils/debug";
import { formatError } from "../lib/utils/tool-base";

export const schema = {
  format: z
    .enum(["xml", "json", "markdown"])
    .default("xml")
    .describe("Output format for instructions"),
};

export const metadata: ToolMetadata = {
  name: "getSystemInstructions",
  description: `Get comprehensive system instructions including all tools, models, and best practices.
  
This tool provides structured information about:
1. All available tools with schemas and descriptions
2. Model categories and best practices
3. Parameter guidelines and examples
4. Workflow patterns and recommendations

USAGE:
• Get XML format: { format: "xml" }
• Get JSON format: { format: "json" }
• Get Markdown format: { format: "markdown" }

OUTPUT STRUCTURE:
<system>
  <tools>
    <tool name="textToImage">
      <description>...</description>
      <parameters>...</parameters>
      <bestPractices>...</bestPractices>
    </tool>
    ...
  </tools>
  <models>
    <model id="fal-ai/flux/dev">
      <category>text-to-image</category>
      <bestPractices>...</bestPractices>
    </model>
    ...
  </models>
  <workflows>
    <pattern name="imageEnhancement">
      <steps>...</steps>
      <examples>...</examples>
    </pattern>
    ...
  </workflows>
</system>

BENEFITS:
• Comprehensive reference for all capabilities
• Structured for easy parsing by AI agents
• Always up-to-date with latest tools
• Reduces need for repetitive queries`,
  annotations: {
    title: "System Instructions",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

// In a real implementation, this would dynamically scan the tools directory
// For this prototype, we'll use static data
const SYSTEM_INFO = {
  tools: [
    {
      name: "textToImage",
      description: "Generate images from text descriptions using any fal.ai model",
      parameters: {
        prompt: "Text description of the desired image",
        model: "Any fal-ai model ID for image generation (default: fal-ai/flux/dev)",
        parameters: "Additional model-specific parameters",
      },
      bestPractices: [
        "Use descriptive prompts with style keywords",
        "Include specific details about composition and lighting",
        "For FLUX models, add 'high quality, detailed' for better results",
      ],
    },
    {
      name: "imageToImage",
      description: "Transform images using any fal.ai model",
      parameters: {
        imageUrl: "URL of the input image",
        imagePath: "Local file path of the input image",
        prompt: "Transformation description",
        model: "Any fal-ai model ID that supports image-to-image transformation",
        parameters: "Additional model-specific parameters",
      },
      bestPractices: [
        "Be specific about the transformation you want",
        "Reference the original image content in your prompt",
        "Use 'convert to [style]' or 'make it look like [style]' formats",
      ],
    },
    {
      name: "enhancePrompt",
      description: "Optimize prompts for fal.ai models using structured XML format",
      parameters: {
        prompt: "Original prompt to enhance",
        model: "Target model for model-specific optimization",
        type: "Media type for context-aware enhancement",
        preset: "Optional style preset",
      },
      bestPractices: [
        "Always use before calling generation tools for best results",
        "Specify model when known for model-specific optimizations",
        "Use presets for consistent style application",
      ],
    },
  ],
  models: [
    {
      id: "fal-ai/flux/dev",
      category: "text-to-image",
      bestPractices: [
        "Add 'high quality, detailed' to prompts",
        "Use specific style descriptors",
        "For pixel art: Add '8-bit, clean pixels, no anti-aliasing'",
      ],
    },
    {
      id: "fal-ai/flux-general/image-to-image",
      category: "image-to-image",
      bestPractices: [
        "Reference the original image in your transformation prompt",
        "Use strength parameter (0.0-1.0) to control transformation intensity",
        "Be specific about desired changes",
      ],
    },
  ],
  workflows: [
    {
      name: "imageEnhancement",
      description: "Complete image enhancement workflow",
      steps: [
        "Generate base image with textToImage",
        "Enhance with imageToImage for style",
        "Remove background if needed with backgroundRemoval",
        "Upscale for higher resolution with upscaleImage",
      ],
      examples: ["Product photo → Professional styling → Clean background → High-res print"],
    },
  ],
};

export default async function getSystemInstructions(params: InferSchema<typeof schema>) {
  const { format = "xml" } = params; // Ensure default value
  const toolName = "getSystemInstructions";

  try {
    debug(toolName, `Getting system instructions in ${format} format`);

    let output = "";

    if (format === "xml") {
      output = "<system>\n";
      output += "  <tools>\n";
      for (const tool of SYSTEM_INFO.tools) {
        output += `    <tool name=\"${tool.name}\">\n`;
        output += `      <description>${tool.description}</description>\n`;
        output += "      <parameters>\n";
        for (const [param, desc] of Object.entries(tool.parameters)) {
          output += `        <parameter name=\"${param}\">${desc}</parameter>\n`;
        }
        output += "      </parameters>\n";
        output += "      <bestPractices>\n";
        for (const practice of tool.bestPractices) {
          output += `        <practice>${practice}</practice>\n`;
        }
        output += "      </bestPractices>\n";
        output += "    </tool>\n";
      }
      output += "  </tools>\n";
      output += "  <models>\n";
      for (const model of SYSTEM_INFO.models) {
        output += `    <model id=\"${model.id}\">\n`;
        output += `      <category>${model.category}</category>\n`;
        output += "      <bestPractices>\n";
        for (const practice of model.bestPractices) {
          output += `        <practice>${practice}</practice>\n`;
        }
        output += "      </bestPractices>\n";
        output += "    </model>\n";
      }
      output += "  </models>\n";
      output += "  <workflows>\n";
      for (const workflow of SYSTEM_INFO.workflows) {
        output += `    <pattern name=\"${workflow.name}\">\n`;
        output += `      <description>${workflow.description}</description>\n`;
        output += "      <steps>\n";
        for (const step of workflow.steps) {
          output += `        <step>${step}</step>\n`;
        }
        output += "      </steps>\n";
        output += "      <examples>\n";
        for (const example of workflow.examples) {
          output += `        <example>${example}</example>\n`;
        }
        output += "      </examples>\n";
        output += "    </pattern>\n";
      }
      output += "  </workflows>\n";
      output += "</system>";
    } else if (format === "json") {
      output = JSON.stringify(SYSTEM_INFO, null, 2);
    } else if (format === "markdown") {
      output = "# System Instructions\n\n";
      output += "## Tools\n\n";
      for (const tool of SYSTEM_INFO.tools) {
        output += `### ${tool.name}\n\n`;
        output += `${tool.description}\n\n`;
        output += "**Parameters:**\n\n";
        for (const [param, desc] of Object.entries(tool.parameters)) {
          output += `- **${param}**: ${desc}\n`;
        }
        output += "\n**Best Practices:**\n\n";
        for (const practice of tool.bestPractices) {
          output += `- ${practice}\n`;
        }
        output += "\n";
      }
      output += "## Models\n\n";
      for (const model of SYSTEM_INFO.models) {
        output += `### ${model.id}\n\n`;
        output += `**Category**: ${model.category}\n\n`;
        output += "**Best Practices:**\n\n";
        for (const practice of model.bestPractices) {
          output += `- ${practice}\n`;
        }
        output += "\n";
      }
      output += "## Workflows\n\n";
      for (const workflow of SYSTEM_INFO.workflows) {
        output += `### ${workflow.name}\n\n`;
        output += `${workflow.description}\n\n`;
        output += "**Steps:**\n\n";
        for (const step of workflow.steps) {
          output += `- ${step}\n`;
        }
        output += "\n**Examples:**\n\n";
        for (const example of workflow.examples) {
          output += `- ${example}\n`;
        }
        output += "\n";
      }
    }

    return {
      content: [{ type: "text", text: output }],
    };
  } catch (error: any) {
    return formatError(error, "Error getting system instructions");
  }
}
