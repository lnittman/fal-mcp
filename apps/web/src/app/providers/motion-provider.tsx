'use client'

import { LazyMotion, domAnimation } from 'framer-motion'
import { ReactLenis } from 'lenis/react'
import { Provider as JotaiProvider } from 'jotai'

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <ReactLenis root options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      }}>
        <LazyMotion features={domAnimation} strict>
          {children}
        </LazyMotion>
      </ReactLenis>
    </JotaiProvider>
  )
}