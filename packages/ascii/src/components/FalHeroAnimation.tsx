'use client'

import React, { useMemo } from 'react'
import { AsciiEngine } from '../engine'
import { generateNeuralFrames } from '../generators/neural'

export interface FalHeroAnimationProps {
  width?: number
  height?: number
  frameCount?: number
  fps?: number
  style?: 'matrix' | 'flow' | 'network' | 'pulse'
  className?: string
  containerClassName?: string
}

export function FalHeroAnimation({
  width = 120,
  height = 30,
  frameCount = 60,
  fps = 24,
  style = 'network',
  className = '',
  containerClassName = ''
}: FalHeroAnimationProps) {
  const frames = useMemo(
    () => generateNeuralFrames(width, height, frameCount, { 
      style,
      density: 0.4,
      speed: 1
    }),
    [width, height, frameCount, style]
  )
  
  return (
    <div className={`absolute inset-0 overflow-hidden ${containerClassName}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <AsciiEngine
          frames={frames}
          fps={fps}
          loop={true}
          autoPlay={true}
          visibilityOptimized={true}
          className={`text-gray-400/10 dark:text-gray-500/10 select-none pointer-events-none ${className}`}
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            fontSize: '10px',
            lineHeight: 1.2,
            letterSpacing: '0.05em',
            whiteSpace: 'pre',
          }}
        />
      </div>
    </div>
  )
}