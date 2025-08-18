/**
 * Shared types for fal.ai integrations
 */

export interface FalConfig {
  apiKey?: string
  baseUrl?: string
  debug?: boolean
}

export interface ImageGenerationParams {
  prompt: string
  model?: string
  imageSize?: string
  numInferenceSteps?: number
  guidanceScale?: number
  seed?: number
  numImages?: number
}

export interface VideoGenerationParams {
  prompt: string
  model?: string
  duration?: number
  fps?: number
  seed?: number
}

export interface AudioGenerationParams {
  text: string
  voice?: string
  language?: string
  speed?: number
}