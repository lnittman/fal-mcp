/**
 * Shared fal.ai client utilities
 */

import * as fal from '@fal-ai/serverless-client'
import type { FalConfig } from './types'

export function initializeFalClient(config: FalConfig = {}) {
  if (config.apiKey) {
    fal.config({
      credentials: config.apiKey,
    })
  }
  
  return fal
}

export { fal }