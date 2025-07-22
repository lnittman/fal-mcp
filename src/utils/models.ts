import * as fal from "@fal-ai/serverless-client";

// Model category patterns for inference
export const MODEL_CATEGORY_PATTERNS = {
  "text-to-image": ["/flux/", "/stable-diffusion", "/ideogram", "/recraft", "pixart", "playground"],
  "image-to-image": ["/image-to-image", "/i2i", "/flux-general", "/kontext", "/creative-upscaler"],
  "image-to-video": ["/image-to-video", "/i2v", "/kling-video/", "/wan-", "/minimax/"],
  "text-to-video": ["/text-to-video", "/t2v", "veo3", "ltxv"],
  "video-to-video": ["/video-to-video", "/v2v"],
  "text-to-speech": ["/text-to-speech", "/tts", "wizmodel", "tortoise", "xtts"],
  "speech-to-text": ["/speech-to-text", "/stt", "/whisper", "/transcription"],
  "text-to-audio": ["/text-to-audio", "/t2a", "stable-audio", "musicgen", "audiocraft"],
  "audio-to-audio": ["/audio-to-audio", "/a2a", "/inpaint", "/outpaint", "voice-clone"],
  "upscaling": ["/upscale", "-sr", "/clarity", "/pasd", "/chain-of-zoom", "/supir"],
  "background-removal": ["/birefnet", "/rembg", "/remove-background", "/bg-removal"],
  "inpainting": ["/inpaint", "/lama", "/object-removal"],
  "image-to-json": ["/bagel", "/understand", "/vlm", "/vision-language"],
  "json": ["/ffmpeg", "/api", "/metadata", "/analysis"],
} as const;

export type ModelCategory = keyof typeof MODEL_CATEGORY_PATTERNS;

/**
 * Truly dynamic model validation
 * No hardcoded lists - just checks if the model follows naming conventions
 */
export async function validateModelDynamic(modelId: string): Promise<boolean> {
  // Basic format validation
  if (!modelId || !modelId.startsWith("fal-ai/")) {
    return false;
  }
  
  // Check if it has a valid structure
  const parts = modelId.split("/");
  if (parts.length < 2) {
    return false;
  }
  
  // All models that start with fal-ai/ are potentially valid
  // The actual validation happens when trying to use the model
  return true;
}

/**
 * Infer model category from model ID using patterns
 */
export function inferModelCategory(modelId: string): ModelCategory | "unknown" {
  const lowerModelId = modelId.toLowerCase();
  
  for (const [category, patterns] of Object.entries(MODEL_CATEGORY_PATTERNS)) {
    if (patterns.some(pattern => lowerModelId.includes(pattern))) {
      return category as ModelCategory;
    }
  }
  
  return "unknown";
}

/**
 * Get model suggestions based on use case
 * This is now truly dynamic - no hardcoded model lists
 */
export function getDynamicModelSuggestions(useCase: string): string[] {
  const useCaseLower = useCase.toLowerCase();
  const suggestions: string[] = [];
  
  // Pattern-based suggestions
  if (useCaseLower.includes("image") || useCaseLower.includes("photo") || useCaseLower.includes("picture")) {
    suggestions.push("Try models starting with: fal-ai/flux/, fal-ai/stable-diffusion-, fal-ai/ideogram/");
  }
  
  if (useCaseLower.includes("video") || useCaseLower.includes("animation") || useCaseLower.includes("motion")) {
    suggestions.push("Try models starting with: fal-ai/kling-video/, fal-ai/wan-, fal-ai/veo");
  }
  
  if (useCaseLower.includes("audio") || useCaseLower.includes("music") || useCaseLower.includes("sound")) {
    suggestions.push("Try models starting with: fal-ai/stable-audio, fal-ai/musicgen");
  }
  
  if (useCaseLower.includes("upscale") || useCaseLower.includes("enhance") || useCaseLower.includes("resolution")) {
    suggestions.push("Try models with: -sr, /upscale, /clarity-, /pasd");
  }
  
  if (useCaseLower.includes("background") || useCaseLower.includes("remove")) {
    suggestions.push("Try models: fal-ai/birefnet, fal-ai/imageutils/rembg");
  }
  
  // Always add generic advice
  suggestions.push("\n🔍 Discovery Tips:");
  suggestions.push("• Visit https://fal.ai to browse all available models");
  suggestions.push("• Any model ID starting with 'fal-ai/' can be used");
  suggestions.push("• The model will be validated when you try to use it");
  suggestions.push("• New models work automatically without updates!");
  
  return suggestions;
}

/**
 * Format model ID for display
 */
export function formatModelName(modelId: string): string {
  // Extract meaningful name from model ID
  const parts = modelId.split('/');
  const name = parts[parts.length - 1];
  return name
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Check if a model ID matches a category
 */
export function modelMatchesCategory(modelId: string, category: ModelCategory): boolean {
  const patterns = MODEL_CATEGORY_PATTERNS[category];
  if (!patterns) return false;
  
  const lowerModelId = modelId.toLowerCase();
  return patterns.some(pattern => lowerModelId.includes(pattern));
}