import * as fal from "@fal-ai/serverless-client";
import { validateModelDynamic } from "./models";
import { formatErrorMessage } from "./errors";
import { debug } from "./debug";

/**
 * Base configuration for all fal.ai tools
 */
export interface FalToolConfig {
  toolName: string;
  requiresAuth?: boolean;
}

/**
 * Result types for different tool outputs
 */
export interface MediaResult {
  url: string;
}

export interface DataResult {
  data: any;
}

export interface BatchResult {
  summary: string;
  processed: number;
  errors: number;
  skipped: number;
}

/**
 * Initialize fal client with credentials
 */
export function initializeFalClient(toolName: string): void {
  debug(toolName, 'Initializing fal client');
  fal.config({
    credentials: process.env.FAL_API_KEY,
  });
}

/**
 * Validate a model ID
 */
export async function validateModel(model: string, toolName: string): Promise<void> {
  const isValid = await validateModelDynamic(model);
  if (!isValid) {
    throw new Error(`Invalid model ID format '${model}'. Model IDs should start with 'fal-ai/'. Example: fal-ai/flux/dev`);
  }
  debug(toolName, `Using model: ${model}`);
}

/**
 * Submit a request to fal.ai
 */
export async function submitToFal<T = any>(
  model: string,
  input: any,
  toolName: string
): Promise<T> {
  debug(toolName, `Submitting to model: ${model}`);
  debug(toolName, 'Input:', input);
  
  try {
    const result = await fal.subscribe(model, {
      input,
      logs: false,
    }) as T;
    
    debug(toolName, 'Response received:', result ? Object.keys(result) : 'null');
    return result;
  } catch (error) {
    debug(toolName, 'Request failed:', error);
    throw error;
  }
}

/**
 * Format a successful media result (image/video/audio URL)
 */
export function formatMediaResult(url: string): { content: Array<{ type: string; text: string }> } {
  return {
    content: [
      { type: "text", text: url },
    ],
  };
}

/**
 * Format a successful data result (JSON)
 */
export function formatDataResult(data: any): { content: Array<{ type: string; text: string }> } {
  return {
    content: [
      { type: "text", text: JSON.stringify(data, null, 2) },
    ],
  };
}

/**
 * Format a batch operation result
 */
export function formatBatchResult(result: BatchResult): { content: Array<{ type: string; text: string }> } {
  let summary = `Processed ${result.processed} items`;
  if (result.skipped > 0) {
    summary += ` (${result.skipped} skipped)`;
  }
  if (result.errors > 0) {
    summary += ` (${result.errors} errors)`;
  }
  summary += `. ${result.summary}`;
  
  return {
    content: [
      { type: "text", text: summary },
    ],
  };
}

/**
 * Format an error result
 */
export function formatError(error: any, prefix: string): { content: Array<{ type: string; text: string }> } {
  return {
    content: [
      { type: "text", text: formatErrorMessage(prefix, error) },
    ],
  };
}

/**
 * Extract image URL from various response formats
 */
export function extractImageUrl(response: any, toolName: string): string {
  debug(toolName, 'Extracting image URL from response');
  
  // Try common patterns
  if (response.images?.[0]?.url) {
    return response.images[0].url;
  }
  if (response.image?.url) {
    return response.image.url;
  }
  if (response.image && typeof response.image === 'string') {
    return response.image;
  }
  if (response.output?.image) {
    return response.output.image;
  }
  if (response.url) {
    return response.url;
  }
  if (typeof response === 'string' && response.startsWith('http')) {
    return response;
  }
  
  debug(toolName, 'Could not extract image URL from:', response);
  throw new Error('No image URL found in response');
}

/**
 * Extract video URL from various response formats
 */
export function extractVideoUrl(response: any, toolName: string): string {
  debug(toolName, 'Extracting video URL from response');
  
  // Try common patterns
  if (response.video?.url) {
    return response.video.url;
  }
  if (response.videos?.[0]?.url) {
    return response.videos[0].url;
  }
  if (response.output?.video_url) {
    return response.output.video_url;
  }
  if (response.video_url) {
    return response.video_url;
  }
  if (response.url) {
    return response.url;
  }
  if (typeof response === 'string' && response.startsWith('http')) {
    return response;
  }
  
  debug(toolName, 'Could not extract video URL from:', response);
  throw new Error('No video URL found in response');
}

/**
 * Extract audio URL from various response formats
 */
export function extractAudioUrl(response: any, toolName: string): string {
  debug(toolName, 'Extracting audio URL from response');
  
  // Try common patterns
  if (response.audio_url) {
    return response.audio_url;
  }
  if (response.audio?.url) {
    return response.audio.url;
  }
  if (response.url) {
    return response.url;
  }
  if (Array.isArray(response.audio) && response.audio[0]?.url) {
    return response.audio[0].url;
  }
  if (typeof response === 'string' && response.startsWith('http')) {
    return response;
  }
  
  debug(toolName, 'Could not extract audio URL from:', response);
  throw new Error('No audio URL found in response');
}

/**
 * Prepare input for different model types based on common patterns
 */
export function prepareModelInput(
  model: string,
  baseInput: Record<string, any>,
  modelType: 'image-to-video' | 'text-to-image' | 'image-to-image' | 'other'
): any {
  // This can be extended with model-specific input preparation
  // For now, return the base input as most models are flexible
  return baseInput;
}