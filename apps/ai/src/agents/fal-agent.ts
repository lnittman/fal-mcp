/**
 * Fal.ai agent for Mastra
 * Provides natural language interface to fal.ai capabilities
 */

import * as fal from '@fal-ai/serverless-client'

// Initialize fal client
if (process.env.FAL_API_KEY) {
  fal.config({
    credentials: process.env.FAL_API_KEY,
  })
}

// Simple demo agent that uses fal.ai directly
export const falAgent = {
  async generateImage(prompt: string) {
    try {
      const result = await fal.run('fal-ai/flux/dev', {
        prompt,
        image_size: 'landscape_16_9',
      } as any)
      return result
    } catch (error) {
      console.error('Error generating image:', error)
      throw error
    }
  },

  async transformImage(imageUrl: string, prompt: string) {
    try {
      const result = await fal.run('fal-ai/flux/general', {
        image_url: imageUrl,
        prompt,
        strength: 0.8,
      } as any)
      return result
    } catch (error) {
      console.error('Error transforming image:', error)
      throw error
    }
  },

  async generateVideo(prompt: string) {
    try {
      const result = await fal.run('fal-ai/hunyuan-video', {
        prompt,
      } as any)
      return result
    } catch (error) {
      console.error('Error generating video:', error)
      throw error
    }
  },

  // Helper function for direct generation
  async generate(prompt: string) {
    // Simple logic to determine what to generate based on keywords
    if (prompt.toLowerCase().includes('video')) {
      return this.generateVideo(prompt)
    } else if (prompt.toLowerCase().includes('transform') || prompt.toLowerCase().includes('edit')) {
      // For simplicity, we'll need an image URL passed somehow
      throw new Error('Image transformation requires an image URL')
    } else {
      return this.generateImage(prompt)
    }
  },
}