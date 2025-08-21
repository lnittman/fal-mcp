"use client";

import { cn } from "@/lib/utils";

export function HeaderFadeGradient() {
  // Creates a smooth gradient fade from top of page
  // Navigation header sits above this with higher z-index
  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 h-24 pointer-events-none z-30",
        "bg-gradient-to-b from-white via-white/60 to-transparent"
      )}
    />
  );
}