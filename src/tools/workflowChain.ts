import fs from "fs-extra";
import os from "os";
import path from "path";
import type { InferSchema, ToolMetadata } from "xmcp";
import { z } from "zod";
import { debug } from "../lib/utils/debug";
import {
  extractImageUrl,
  extractVideoUrl,
  formatError,
  initializeFalClient,
  submitToFal,
  validateModel,
} from "../lib/utils/tool-base";

// Define available workflow steps with generic parameters
const workflowSteps = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("generate"),
    model: z.string().default("fal-ai/flux/dev"),
    parameters: z
      .record(z.any())
      .describe("Model-specific parameters (e.g., prompt, image_size, style)"),
  }),
  z.object({
    type: z.literal("removeBackground"),
    model: z.string().default("fal-ai/birefnet"),
    parameters: z.record(z.any()).optional().describe("Model-specific parameters"),
  }),
  z.object({
    type: z.literal("upscale"),
    model: z.string().default("fal-ai/aura-sr"),
    parameters: z
      .record(z.any())
      .describe("Model-specific parameters (e.g., scale, upscaling_factor)"),
  }),
  z.object({
    type: z.literal("transform"),
    model: z.string().default("fal-ai/flux-general/image-to-image"),
    parameters: z.record(z.any()).describe("Model-specific parameters (e.g., prompt, strength)"),
  }),
  z.object({
    type: z.literal("animate"),
    model: z.string().default("fal-ai/wan-effects"),
    parameters: z
      .record(z.any())
      .describe("Model-specific parameters (e.g., motion_prompt, duration, fps)"),
  }),
]);

export const schema = {
  inputImage: z
    .string()
    .optional()
    .describe("URL or path of input image (optional for workflows starting with generation)"),
  steps: z.array(workflowSteps).min(1).max(5).describe("Sequence of operations to perform"),
  outputPath: z
    .string()
    .optional()
    .describe("Path to save final result (use ~ for home directory)"),
  saveIntermediates: z
    .boolean()
    .default(false)
    .describe("Save intermediate results from each step"),
};

export const metadata: ToolMetadata = {
  name: "workflowChain",
  description: `Chain multiple operations together with any fal.ai models.

The agent should discover which parameters work for each step through experimentation.
Each step type accepts different parameters - let the API guide you.

Step types:
• generate - Create new images from text
• removeBackground - Remove backgrounds from images
• upscale - Enhance image resolution
• transform - Modify images based on prompts
• animate - Convert images to videos

Remember: Error messages often reveal the correct parameter names and formats.`,
  annotations: {
    title: "Workflow Chain (Generic)",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function workflowChain(params: InferSchema<typeof schema>) {
  const { inputImage, steps, outputPath, saveIntermediates } = params;
  const toolName = "workflowChain";

  try {
    // Initialize fal client once for all steps
    initializeFalClient(toolName);

    // Validate workflow
    const firstStep = steps[0];
    if (firstStep.type !== "generate" && !inputImage) {
      throw new Error("Input image required for workflows not starting with generation");
    }

    let currentResult: string = inputImage || "";
    const intermediateResults: { step: number; type: string; url: string }[] = [];

    // Execute each step
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      try {
        // Validate model for steps that have models
        if ("model" in step && step.model) {
          await validateModel(step.model, toolName);
        }

        debug(toolName, `Executing step ${i + 1}: ${step.type}`);

        switch (step.type) {
          case "generate": {
            const modelId = step.model || "fal-ai/flux/dev";
            const input = {
              ...step.parameters,
            };

            const response = await submitToFal(modelId, input, toolName);
            currentResult = extractImageUrl(response, toolName);
            break;
          }

          case "removeBackground": {
            const input = {
              ...step.parameters,
              // Try common parameter names
              image_url: currentResult,
              image: currentResult,
            };

            const response = await submitToFal(step.model, input, toolName);
            currentResult = extractImageUrl(response, toolName);
            break;
          }

          case "upscale": {
            const modelId = step.model || "fal-ai/aura-sr";
            const input = {
              ...step.parameters,
              // Try common parameter names
              image_url: currentResult,
              image: currentResult,
            };

            const response = await submitToFal(modelId, input, toolName);
            currentResult = extractImageUrl(response, toolName);
            break;
          }

          case "transform": {
            const modelId = step.model || "fal-ai/flux-general/image-to-image";
            const input = {
              ...step.parameters,
              // Try common parameter names
              image_url: currentResult,
              image: currentResult,
            };

            const response = await submitToFal(modelId, input, toolName);
            currentResult = extractImageUrl(response, toolName);
            break;
          }

          case "animate": {
            const modelId = step.model || "fal-ai/wan-effects";
            const input = {
              ...step.parameters,
              // Try common parameter names
              image_url: currentResult,
              image: currentResult,
              first_frame_image: currentResult,
            };

            const response = await submitToFal(modelId, input, toolName);
            currentResult = extractVideoUrl(response, toolName);
            break;
          }
        }

        // Store intermediate result
        intermediateResults.push({
          step: i + 1,
          type: step.type,
          url: currentResult,
        });

        debug(toolName, `Step ${i + 1} completed: ${step.type}`, { url: currentResult });

        // Save intermediate if requested
        if (saveIntermediates && outputPath) {
          const resolvedPath = outputPath.startsWith("~")
            ? path.join(os.homedir(), outputPath.slice(1))
            : path.resolve(outputPath);

          const dir = path.dirname(resolvedPath);
          await fs.ensureDir(dir);

          const baseName = path.basename(resolvedPath, path.extname(resolvedPath));
          const ext =
            currentResult.includes("video") || currentResult.includes(".mp4") ? ".mp4" : ".png";
          const stepPath = path.join(dir, `${baseName}_step${i + 1}_${step.type}${ext}`);

          const response = await fetch(currentResult);
          const buffer = Buffer.from(await response.arrayBuffer());
          await fs.writeFile(stepPath, buffer);
          debug(toolName, `Saved intermediate result to: ${stepPath}`);
        }
      } catch (error: any) {
        debug(toolName, `Step ${i + 1} (${step.type}) failed:`, error);
        throw new Error(`Step ${i + 1} (${step.type}) failed: ${error.message}`);
      }
    }

    // Save final result if path provided
    if (outputPath) {
      const resolvedPath = outputPath.startsWith("~")
        ? path.join(os.homedir(), outputPath.slice(1))
        : path.resolve(outputPath);

      const response = await fetch(currentResult);
      const buffer = Buffer.from(await response.arrayBuffer());
      await fs.writeFile(resolvedPath, buffer);

      return {
        content: [{ type: "text", text: `Workflow complete. Result saved to: ${resolvedPath}` }],
      };
    }

    // Return final URL if no output path
    return {
      content: [{ type: "text", text: currentResult }],
    };
  } catch (error: any) {
    return formatError(error, "Workflow error");
  }
}
