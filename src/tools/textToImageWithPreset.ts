import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import * as fal from "@fal-ai/serverless-client";

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
  model: z.enum(["fal-ai/flux/dev", "fal-ai/flux/schnell", "fal-ai/flux/pro"])
    .default("fal-ai/flux/dev")
    .describe("Model to use for generation"),
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
  
  try {
    // Configure fal client
    fal.config({
      credentials: process.env.FAL_API_KEY,
    });

    // Build the prompt
    let prompt = subject;
    
    // Add preset modifiers if selected
    if (preset && presets[preset]) {
      prompt = `${subject}, ${presets[preset].modifiers}`;
    }
    
    // Add any additional details
    if (additionalDetails) {
      prompt = `${prompt}, ${additionalDetails}`;
    }

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
    const status = await fal.subscribe(model, {
      input,
      logs: false,
    });

    if (!status.images || status.images.length === 0) {
      throw new Error("No image generated");
    }

    return {
      content: [
        { type: "text", text: status.images[0].url },
      ],
    };
  } catch (error: any) {
    // Extract more detailed error information
    let errorMessage = error.message || 'Unknown error';
    let statusCode = '';
    
    if (error.response) {
      statusCode = error.response.status || '';
      errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
    }
    
    if (error.body) {
      errorMessage = error.body.detail || error.body.message || errorMessage;
    }
    
    // Check for specific error types
    if (statusCode === 404 || errorMessage.includes('Not Found')) {
      errorMessage = `Model '${model}' not found. This might be due to:\n- Invalid model ID\n- Model deprecated or renamed\n- API key doesn't have access to this model\n\nTry using a different model or check fal.ai documentation for current model IDs.`;
    } else if (statusCode === 401 || errorMessage.includes('Unauthorized')) {
      errorMessage = 'Authentication failed. Please check your FAL_API_KEY.';
    } else if (statusCode === 422 || errorMessage.includes('max_new_tokens')) {
      errorMessage = 'The prompt is too long. Please try a shorter description.';
    }
    
    return {
      content: [
        { type: "text", text: `❌ Error generating image${statusCode ? ` (${statusCode})` : ''}: ${errorMessage}` },
      ],
    };
  }
}