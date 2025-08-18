/**
 * AI integration demo for fal.ai ecosystem
 * Demonstrates direct integration with fal.ai APIs
 */

import { config } from 'dotenv'
import { falAgent } from './agents/fal-agent.js'

config()

async function main() {
  console.log('🚀 Starting AI service for fal.ai')
  
  // Example: Generate an image using the fal agent
  const result = await falAgent.generate('Generate a beautiful sunset over mountains')
  
  console.log('Generated result:', result)
}

// Only run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}