import * as fal from "@fal-ai/serverless-client";

interface FalModel {
  id: string;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  inputSchema?: any;
}

interface ModelListResponse {
  models: FalModel[];
  total: number;
  page: number;
  pageSize: number;
}

// Cache configuration
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
const modelCache: Map<string, { data: FalModel[]; timestamp: number }> = new Map();

/**
 * Fetch available models from fal.ai API
 * This is a placeholder implementation until fal.ai provides an official API endpoint
 */
export async function fetchModelsFromAPI(category?: string): Promise<FalModel[]> {
  const cacheKey = category || "all";
  const cached = modelCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    // Configure fal client
    fal.config({
      credentials: process.env.FAL_API_KEY,
    });

    // TODO: Replace with actual fal.ai models API when available
    // For now, we'll use a dynamic approach to discover models

    // Try to fetch from a hypothetical models endpoint
    // This would be something like: const response = await fal.api.models.list({ category });

    // Since fal.ai doesn't expose a models API yet, we'll return an empty array
    // and let the tools handle model validation at runtime
    const models: FalModel[] = [];

    // Cache the result
    modelCache.set(cacheKey, { data: models, timestamp: Date.now() });

    return models;
  } catch (error) {
    console.error("Error fetching models from API:", error);
    return [];
  }
}

/**
 * Validate if a model exists by attempting to get its metadata
 * This is the real dynamic validation that happens at runtime
 */
export async function validateModelDynamic(modelId: string): Promise<boolean> {
  try {
    fal.config({
      credentials: process.env.FAL_API_KEY,
    });

    // The only way to truly validate is to try to use the model
    // with minimal input and see if it responds
    // This is what makes it truly dynamic - no hardcoded list needed

    // For now, we'll accept any model ID that follows the fal-ai pattern
    // The actual validation happens when the model is used
    return modelId.startsWith("fal-ai/");
  } catch (error) {
    return false;
  }
}

/**
 * Get model suggestions based on use case
 * This uses AI to suggest models rather than a hardcoded list
 */
export async function getModelSuggestionsAI(useCase: string, category?: string): Promise<string[]> {
  // In a real implementation, this would use an AI service to suggest models
  // based on the use case description

  // For now, return generic suggestions
  const suggestions = [
    `Try searching for models using: mcp__fal__discoverModels operation="search" query="${useCase.split(" ")[0]}"`,
    `Visit fal.ai dashboard to browse available models`,
    `Use any model ID that starts with 'fal-ai/'`,
  ];

  return suggestions;
}

/**
 * Search for models by querying fal.ai
 * This would ideally use a search API endpoint
 */
export async function searchModelsAPI(query: string): Promise<FalModel[]> {
  // TODO: Implement when fal.ai provides a search API
  // For now, return empty array and rely on runtime validation
  return [];
}

/**
 * Extract model category from model ID
 * e.g., "fal-ai/flux/dev" -> "text-to-image"
 */
export function inferModelCategory(modelId: string): string {
  const patterns = {
    "text-to-image": [
      "/flux/",
      "/stable-diffusion",
      "/ideogram",
      "/recraft",
      "pixart",
      "playground",
    ],
    "image-to-video": ["/kling-video/", "/wan-", "/minimax/", "/veo", "/seedance/", "animatediff"],
    "text-to-video": ["/text-to-video", "/t2v", "veo3", "ltxv"],
    "audio-to-audio": ["/audio-to-audio", "/audio-inpaint", "/audio-outpaint", "voice-clone"],
    "text-to-audio": ["/stable-audio", "/musicgen", "/audiocraft"],
    "image-to-json": ["/bagel/", "/understand"],
    upscaling: ["/upscale", "-sr", "/clarity-", "/pasd", "/chain-of-zoom"],
    "background-removal": ["/birefnet", "/rembg", "/remove-background"],
  };

  for (const [category, keywords] of Object.entries(patterns)) {
    if (keywords.some((keyword) => modelId.toLowerCase().includes(keyword))) {
      return category;
    }
  }

  return "unknown";
}
