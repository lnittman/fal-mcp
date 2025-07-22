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

export const schema = {
  prompt: z.string().describe("Detailed text description of the desired image. Include style, composition, colors, mood, and any specific details"),
  model: z.string()
    .default("fal-ai/flux/dev")
    .describe("Any fal-ai model ID for image generation. Examples: fal-ai/flux/dev, fal-ai/stable-diffusion-v35-large. ALL models starting with 'fal-ai/' are accepted!"),
  imageSize: z.enum(["square", "landscape_4_3", "portrait_4_3", "landscape_16_9", "portrait_16_9"])
    .optional()
    .describe("Image aspect ratio - affects composition and use case suitability"),
  numInferenceSteps: z.number().min(1).max(50).optional().describe("Generation steps: more steps = higher quality but slower (default varies by model)"),
  guidanceScale: z.number().min(1).max(20).optional().describe("Prompt adherence strength: higher = stricter following of prompt (default 7.5)"),
};

export const metadata: ToolMetadata = {
  name: "textToImage",
  description: `Generate high-quality images from text descriptions using FLUX models. Create artwork, designs, photos, and illustrations in any style.

CAPABILITIES:
• Generate images in any artistic style (photorealistic, cartoon, anime, watercolor, oil painting, etc.)
• Create detailed scenes with multiple subjects and complex compositions
• Produce consistent results with precise prompt following
• Support various aspect ratios for different use cases

PROMPT WRITING TIPS:
• Be specific: "golden retriever puppy" → "fluffy golden retriever puppy playing in autumn leaves, soft sunlight"
• Include style: Add artistic style, medium, or technique keywords
• Describe composition: Mention camera angle, framing, lighting
• Add quality modifiers: "highly detailed", "professional photography", "masterpiece"

STYLE EXAMPLES:
• Photorealistic: "photograph, DSLR quality, shallow depth of field"
• Digital Art: "digital painting, concept art, trending on ArtStation"
• Traditional Art: "oil painting, impressionist style, visible brushstrokes"
• Anime/Manga: "anime style, cel shaded, vibrant colors"
• Vintage: "vintage photograph, film grain, sepia toned"

USE CASES:
• Marketing & Advertising - Product visuals, campaign imagery
• Creative Projects - Book covers, album art, posters
• Content Creation - Blog illustrations, social media posts
• Concept Development - Mood boards, storyboards, prototypes
• Personal Use - Avatars, wallpapers, creative expression

MODEL SELECTION:
• ANY model starting with 'fal-ai/' is accepted - no hardcoded limits!
• Try popular patterns: fal-ai/flux/*, fal-ai/stable-diffusion-*, fal-ai/ideogram/*
• New models work automatically without tool updates
• Visit https://fal.ai to discover the latest models

ADVANCED TECHNIQUES:
• Negative prompts: Specify what to avoid in parentheses
• Weight emphasis: Use (important)++ or (less important)--
• Multiple subjects: Separate with commas, be clear about relationships
• Scene building: Layer foreground, midground, background elements`,
  annotations: {
    title: "Text to Image AI",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function textToImage(params: InferSchema<typeof schema>) {
  const { prompt, model, imageSize, numInferenceSteps, guidanceScale } = params;
  const toolName = 'textToImage';
  
  try {
    // Initialize and validate
    await validateModel(model, toolName);
    initializeFalClient(toolName);

    // Map imageSize to model-specific format
    const sizeMap: Record<string, any> = {
      square: { width: 1024, height: 1024 },
      landscape_4_3: { width: 1365, height: 1024 },
      portrait_4_3: { width: 1024, height: 1365 },
      landscape_16_9: { width: 1820, height: 1024 },
      portrait_16_9: { width: 1024, height: 1820 },
    };

    // Prepare input based on model patterns
    let input: any = {
      prompt,
    };

    // Add size parameters
    if (imageSize && sizeMap[imageSize]) {
      if (model.includes("flux")) {
        input.image_size = imageSize;
      } else if (model.includes("stable-diffusion")) {
        input.width = sizeMap[imageSize].width;
        input.height = sizeMap[imageSize].height;
      } else {
        // Default to width/height for unknown models
        input.width = sizeMap[imageSize].width;
        input.height = sizeMap[imageSize].height;
      }
    }

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
    return formatError(error, 'Error generating image');
  }
}