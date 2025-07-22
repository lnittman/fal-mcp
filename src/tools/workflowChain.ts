import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import fs from "fs-extra";
import path from "path";
import os from "os";
import {
  initializeFalClient,
  validateModel,
  submitToFal,
  extractImageUrl,
  extractVideoUrl,
  formatError,
} from "../utils/tool-base";
import { debug } from "../utils/debug";

// Define available workflow steps
const workflowSteps = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("generate"),
    prompt: z.string(),
    model: z.string().default("fal-ai/flux/dev"),
  }),
  z.object({
    type: z.literal("removeBackground"),
    model: z.string().default("fal-ai/birefnet"),
  }),
  z.object({
    type: z.literal("upscale"),
    scaleFactor: z.number().min(2).max(8).default(4),
    model: z.string().default("fal-ai/aura-sr"),
  }),
  z.object({
    type: z.literal("transform"),
    prompt: z.string(),
    strength: z.number().min(0).max(1).default(0.8),
    model: z.string().default("fal-ai/flux-general/image-to-image"),
  }),
  z.object({
    type: z.literal("animate"),
    motionPrompt: z.string().optional(),
    duration: z.number().min(1).max(6).default(3),
    model: z.string().default("fal-ai/stable-video-diffusion/image-to-video"),
  }),
]);

export const schema = {
  inputImage: z.string().optional().describe("URL or path of input image (optional for workflows starting with generation)"),
  steps: z.array(workflowSteps).min(1).max(5).describe("Sequence of operations to perform"),
  outputPath: z.string().optional().describe("Path to save final result (use ~ for home directory)"),
  saveIntermediates: z.boolean().default(false).describe("Save intermediate results from each step"),
};

export const metadata: ToolMetadata = {
  name: "workflowChain",
  description: "Chain multiple image/video operations together. Start with generation or an existing image, then apply transformations sequentially",
  annotations: {
    title: "Workflow Chain",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function workflowChain(params: InferSchema<typeof schema>) {
  const { inputImage, steps, outputPath, saveIntermediates } = params;
  const toolName = 'workflowChain';
  
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
        if ('model' in step && step.model) {
          await validateModel(step.model, toolName);
        }
        
        debug(toolName, `Executing step ${i + 1}: ${step.type}`);
        
        switch (step.type) {
          case "generate": {
            const modelId = step.model || "fal-ai/flux/dev";
            const input: any = {
              prompt: step.prompt,
            };
            
            // Add model-specific parameters
            if (modelId.includes("flux")) {
              input.image_size = "square";
            } else if (modelId.includes("recraft")) {
              input.style = "realistic_image";
            }
            
            const response = await submitToFal(modelId, input, toolName);
            currentResult = extractImageUrl(response, toolName);
            break;
          }
          
          case "removeBackground": {
            const input = step.model.includes("birefnet") 
              ? { 
                  image_url: currentResult, 
                  model: "u2net",
                  return_mask: false,
                  output_format: "png",
                }
              : { image_url: currentResult };
            
            const response = await submitToFal(step.model, input, toolName);
            currentResult = extractImageUrl(response, toolName);
            break;
          }
          
          case "upscale": {
            let input: any = {};
            const modelId = step.model || "fal-ai/aura-sr";
            
            if (modelId.includes("aura-sr")) {
              input = { image_url: currentResult, scale: step.scaleFactor };
            } else if (modelId.includes("clarity-upscaler")) {
              input = { image_url: currentResult, scale: step.scaleFactor, overlapping_factor: 0.5 };
            } else if (modelId.includes("pasd")) {
              input = { 
                image_url: currentResult, 
                upscaling_factor: step.scaleFactor,
                prompt: "A high quality, realistic image",
                style_preset: "realistic"
              };
            } else if (modelId.includes("chain-of-zoom")) {
              input = { 
                image_url: currentResult,
                num_steps: Math.ceil(Math.log2(step.scaleFactor)),
              };
            } else {
              input = { image_url: currentResult, scale: step.scaleFactor };
            }
            
            const response = await submitToFal(modelId, input, toolName);
            currentResult = extractImageUrl(response, toolName);
            break;
          }
          
          case "transform": {
            const modelId = step.model || "fal-ai/flux-general/image-to-image";
            const input = {
              image_url: currentResult,
              prompt: step.prompt,
              strength: step.strength,
            };
            
            const response = await submitToFal(modelId, input, toolName);
            currentResult = extractImageUrl(response, toolName);
            break;
          }
          
          case "animate": {
            const modelId = step.model || "fal-ai/stable-video-diffusion/image-to-video";
            let input: any = {};
            
            if (modelId.includes("stable-video-diffusion")) {
              input = {
                image_url: currentResult,
                motion_bucket_id: 127,
                fps: 7,
                num_frames: 25,
              };
            } else if (modelId.includes("wan-effects") || modelId.includes("wan-i2v")) {
              input = {
                image_url: currentResult,
                motion_prompt: step.motionPrompt,
                duration: step.duration,
                fps: 24,
              };
            } else if (modelId.includes("wan-pro")) {
              input = {
                image_url: currentResult,
                prompt: step.motionPrompt || "Animate the image",
                duration: step.duration,
              };
            } else {
              input = {
                image_url: currentResult,
                prompt: step.motionPrompt,
                duration: step.duration,
              };
            }
            
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
          const resolvedPath = outputPath.startsWith('~') 
            ? path.join(os.homedir(), outputPath.slice(1))
            : path.resolve(outputPath);
          
          const dir = path.dirname(resolvedPath);
          await fs.ensureDir(dir);
          
          const baseName = path.basename(resolvedPath, path.extname(resolvedPath));
          const ext = currentResult.includes("video") || currentResult.includes(".mp4") ? ".mp4" : ".png";
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
      const resolvedPath = outputPath.startsWith('~') 
        ? path.join(os.homedir(), outputPath.slice(1))
        : path.resolve(outputPath);
      
      const response = await fetch(currentResult);
      const buffer = Buffer.from(await response.arrayBuffer());
      await fs.writeFile(resolvedPath, buffer);
      
      return {
        content: [
          { type: "text", text: `Workflow complete. Result saved to: ${resolvedPath}` },
        ],
      };
    }

    // Return final URL if no output path
    return {
      content: [
        { type: "text", text: currentResult },
      ],
    };
  } catch (error: any) {
    return formatError(error, 'Workflow error');
  }
}