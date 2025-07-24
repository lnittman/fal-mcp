import type { InferSchema, ToolMetadata } from "xmcp";
import { z } from "zod";
import { debug } from "../lib/utils/debug";
import {
  formatError,
  initializeFalClient,
  submitToFal,
  validateModel,
} from "../lib/utils/tool-base";

export const schema = {
  imageUrl: z.string().describe("URL of the image to analyze"),
  model: z
    .string()
    .default("fal-ai/bagel/understand")
    .describe(
      "Model ID for image analysis. Default: bagel/understand for vision-language understanding"
    ),
  prompt: z
    .string()
    .default("Describe this image in detail")
    .describe("Question or prompt about the image"),
  outputFormat: z
    .enum(["json", "structured", "raw"])
    .default("json")
    .describe("Output format for the analysis results"),
};

export const metadata: ToolMetadata = {
  name: "imageToJson",
  description: `Analyze images and extract structured information using vision-language models. Get detailed descriptions, answer questions, and extract data.

CAPABILITIES:
• Image understanding and description
• Visual question answering
• Object detection and counting
• Text extraction from images
• Scene analysis and interpretation
• Structured data extraction

MODELS:
• bagel/understand - 7B multimodal model for comprehensive image understanding
• Other VLM models as they become available

USE CASES:
• Product catalog generation from photos
• Accessibility descriptions for images
• Content moderation and classification
• Visual search and indexing
• Data extraction from charts/diagrams
• Image-based Q&A systems

PROMPT EXAMPLES:
• "List all objects in this image with their colors"
• "Extract any text visible in the image"
• "Is this image safe for work? Explain why"
• "Describe the mood and atmosphere"
• "Count the number of people and describe what they're doing"

OUTPUT FORMATS:
• json - Structured JSON response
• structured - Formatted key-value pairs
• raw - Plain text response`,
  annotations: {
    title: "Image to JSON Analysis",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function imageToJson(params: InferSchema<typeof schema>) {
  const { imageUrl, model, prompt, outputFormat } = params;
  const toolName = "imageToJson";

  try {
    // Initialize and validate
    await validateModel(model, toolName);
    initializeFalClient(toolName);

    // Build input with common parameters
    // Let the agent discover which parameters work
    const input: any = {
      // Try different image parameter names
      image: imageUrl,
      image_url: imageUrl,
      input_image: imageUrl,
      // Try different prompt parameter names
      prompt,
      question: prompt,
      query: prompt,
      text: prompt,
    };

    debug(toolName, `Analyzing image with prompt: ${prompt}`);

    // Submit to fal.ai
    const response = await submitToFal(model, input, toolName);

    // Format output based on requested format
    let output: any;

    if (outputFormat === "raw") {
      // Extract text content
      if (response.text) {
        output = response.text;
      } else if (response.output) {
        output = response.output;
      } else if (response.response) {
        output = response.response;
      } else if (response.answer) {
        output = response.answer;
      } else {
        output = JSON.stringify(response);
      }
    } else {
      // Return structured JSON
      output = JSON.stringify(response, null, 2);
    }

    return {
      content: [{ type: "text", text: output }],
    };
  } catch (error: any) {
    return formatError(error, "Error analyzing image");
  }
}
