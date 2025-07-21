import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import * as fal from "@fal-ai/serverless-client";
import fs from "fs-extra";
import path from "path";
import os from "os";

// Define available workflow steps
const workflowSteps = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("generate"),
    prompt: z.string(),
    model: z.enum(["fal-ai/flux/dev", "fal-ai/flux/schnell"]).default("fal-ai/flux/dev"),
  }),
  z.object({
    type: z.literal("removeBackground"),
    model: z.enum(["fal-ai/birefnet", "fal-ai/imageutils/rembg"]).default("fal-ai/birefnet"),
  }),
  z.object({
    type: z.literal("upscale"),
    scaleFactor: z.number().min(2).max(8).default(4),
    model: z.enum(["fal-ai/aura-sr", "fal-ai/clarity-upscaler"]).default("fal-ai/aura-sr"),
  }),
  z.object({
    type: z.literal("transform"),
    prompt: z.string(),
    strength: z.number().min(0).max(1).default(0.8),
  }),
  z.object({
    type: z.literal("animate"),
    motionPrompt: z.string().optional(),
    duration: z.number().min(1).max(6).default(3),
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
  
  try {
    // Configure fal client
    fal.config({
      credentials: process.env.FAL_API_KEY,
    });

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
        switch (step.type) {
          case "generate": {
            const status = await fal.subscribe("fal-ai/flux/dev", {
              input: {
                prompt: step.prompt,
                image_size: "square",
              },
              logs: false,
            });
            
            if (!status.images?.[0]?.url) {
              throw new Error("Generation failed");
            }
            
            currentResult = status.images[0].url;
            break;
          }
          
          case "removeBackground": {
            const input = step.model === "fal-ai/birefnet" 
              ? { image_url: currentResult, refine_foreground: true }
              : { image_url: currentResult };
            
            const status = await fal.subscribe(step.model, {
              input,
              logs: false,
            });
            
            currentResult = status.image?.url || status.images?.[0]?.url || "";
            if (!currentResult) throw new Error("Background removal failed");
            break;
          }
          
          case "upscale": {
            const input = step.model === "fal-ai/aura-sr"
              ? { image_url: currentResult, upscaling_factor: step.scaleFactor }
              : { image_url: currentResult, scale: step.scaleFactor };
            
            const status = await fal.subscribe(step.model, {
              input,
              logs: false,
            });
            
            currentResult = status.image?.url || status.images?.[0]?.url || "";
            if (!currentResult) throw new Error("Upscaling failed");
            break;
          }
          
          case "transform": {
            const status = await fal.subscribe("fal-ai/flux-general/image-to-image", {
              input: {
                image_url: currentResult,
                prompt: step.prompt,
                strength: step.strength,
              },
              logs: false,
            });
            
            currentResult = status.images?.[0]?.url || "";
            if (!currentResult) throw new Error("Transformation failed");
            break;
          }
          
          case "animate": {
            const status = await fal.subscribe("fal-ai/wan-effects", {
              input: {
                image_url: currentResult,
                motion_prompt: step.motionPrompt,
                duration: step.duration,
                fps: 24,
              },
              logs: false,
            });
            
            currentResult = status.video?.url || "";
            if (!currentResult) throw new Error("Animation failed");
            break;
          }
        }
        
        // Store intermediate result
        intermediateResults.push({
          step: i + 1,
          type: step.type,
          url: currentResult,
        });
        
        // Save intermediate if requested
        if (saveIntermediates && outputPath) {
          const resolvedPath = outputPath.startsWith('~') 
            ? path.join(os.homedir(), outputPath.slice(1))
            : path.resolve(outputPath);
          
          const dir = path.dirname(resolvedPath);
          await fs.ensureDir(dir);
          
          const baseName = path.basename(resolvedPath, path.extname(resolvedPath));
          const ext = currentResult.includes("video") ? ".mp4" : ".png";
          const stepPath = path.join(dir, `${baseName}_step${i + 1}_${step.type}${ext}`);
          
          const response = await fetch(currentResult);
          const buffer = Buffer.from(await response.arrayBuffer());
          await fs.writeFile(stepPath, buffer);
        }
      } catch (error: any) {
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
    return {
      content: [
        { type: "text", text: `Workflow error: ${error.message}` },
      ],
    };
  }
}