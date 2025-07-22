import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import {
  initializeFalClient,
  validateModel,
  submitToFal,
  formatMediaResult,
  formatError,
  extractImageUrl,
} from "../utils/tool-base";
import { debug } from "../utils/debug";

// Define available presets
const presets = {
  pixelArt: {
    name: "Pixel Art",
    modifiers: "pixel art style, 32x32 pixel grid, retro 8-bit aesthetic, clean pixels, no anti-aliasing",
  },
  anime: {
    name: "Anime/Manga",
    modifiers: "anime manga art style, detailed anime illustration, vibrant colors, cel shading",
  },
  photorealistic: {
    name: "Photorealistic",
    modifiers: "photorealistic, highly detailed, professional photography, 8k resolution",
  },
  watercolor: {
    name: "Watercolor",
    modifiers: "watercolor painting, artistic watercolor style, paint texture visible, flowing colors",
  },
  oilPainting: {
    name: "Oil Painting",
    modifiers: "oil painting, thick brushstrokes, impasto technique, rich colors, classical art style",
  },
  cyberpunk: {
    name: "Cyberpunk",
    modifiers: "cyberpunk style, neon lights, futuristic, high tech low life, blade runner aesthetic",
  },
  steampunk: {
    name: "Steampunk",
    modifiers: "steampunk style, victorian era, brass and copper, gears and clockwork, industrial revolution",
  },
  minimalist: {
    name: "Minimalist",
    modifiers: "minimalist style, simple shapes, clean lines, negative space, modern design",
  },
  glassArt: {
    name: "Glass Art",
    modifiers: "glass art style, translucent, refractive, crystal clear, light passing through glass",
  },
  retroWave: {
    name: "RetroWave",
    modifiers: "retrowave style, 80s aesthetic, neon pink and blue, sunset grid, synthwave",
  },
};

export const schema = {
  subject: z.string().describe("The main subject or content to generate"),
  preset: z.enum([
    "pixelArt", "anime", "photorealistic", "watercolor", "oilPainting",
    "cyberpunk", "steampunk", "minimalist", "glassArt", "retroWave"
  ])
    .optional()
    .describe("Style preset to apply"),
  additionalDetails: z.string().optional().describe("Additional details or modifiers to add to the prompt"),
  model: z.string()
    .default("fal-ai/flux/dev")
    .describe("Model ID for image generation. Any fal-ai model that supports text-to-image. Popular: flux/dev, flux/schnell, flux/pro"),
  imageSize: z.enum(["square", "landscape_4_3", "portrait_4_3", "landscape_16_9", "portrait_16_9"])
    .default("square")
    .describe("Aspect ratio for the generated image"),
  numInferenceSteps: z.number().min(1).max(50).optional().describe("Number of inference steps"),
  guidanceScale: z.number().min(1).max(20).optional().describe("Guidance scale for generation"),
};

export const metadata: ToolMetadata = {
  name: "textToImageWithPreset",
  description: "Generate images with style presets for consistent results. Choose from pixel art, anime, photorealistic, and more styles",
  annotations: {
    title: "Text to Image with Presets",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function textToImageWithPreset(params: InferSchema<typeof schema>) {
  const { subject, preset, additionalDetails, model, imageSize, numInferenceSteps, guidanceScale } = params;
  const toolName = 'textToImageWithPreset';
  
  try {
    // Initialize and validate
    await validateModel(model, toolName);
    initializeFalClient(toolName);

    // Build the prompt
    let prompt = subject;
    
    // Add preset modifiers if selected
    if (preset && presets[preset]) {
      prompt = `${subject}, ${presets[preset].modifiers}`;
      debug(toolName, `Using preset: ${presets[preset].name}`);
    }
    
    // Add any additional details
    if (additionalDetails) {
      prompt = `${prompt}, ${additionalDetails}`;
    }
    
    debug(toolName, `Final prompt: ${prompt}`);

    // Prepare input
    const input: any = {
      prompt,
      image_size: imageSize,
    };

    // Add optional parameters
    if (numInferenceSteps !== undefined) {
      input.num_inference_steps = numInferenceSteps;
    }
    if (guidanceScale !== undefined) {
      input.guidance_scale = guidanceScale;
    }

    // Submit to fal.ai
    const response = await submitToFal(model, input, toolName);
    
    // Extract image URL
    const imageUrl = extractImageUrl(response, toolName);

    return formatMediaResult(imageUrl);
  } catch (error: any) {
    return formatError(error, 'Error generating image with preset');
  }
}