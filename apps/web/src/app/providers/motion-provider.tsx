'use client'

import { Provider as JotaiProvider } from 'jotai'

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      {children}
    </JotaiProvider>
  )
}