"use client";

import Image from "next/image";
import { VerticalPixelText } from "./vertical-pixel-text";

export function ToolsDecorativeElements() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Exact fal.ai decorative elements for tools page */}
      
      {/* Main decorative element on the right */}
      <div className="absolute top-48 right-0 w-56 h-56 opacity-70">
        <Image
          src="/decorative/right-5.svg"
          alt=""
          width={154}
          height={185}
          className="w-full h-auto"
        />
      </div>
      
      {/* Subtle element on the left */}
      <div className="absolute top-96 left-0 w-40 h-40 opacity-50">
        <Image
          src="/decorative/left-3.svg"
          alt=""
          width={154}
          height={185}
          className="w-full h-auto"
        />
      </div>
      
      {/* Bottom decorative accent */}
      <div className="absolute bottom-32 right-8 w-32 h-32 opacity-40">
        <Image
          src="/decorative/left-6.svg"
          alt=""
          width={255}
          height={185}
          className="w-full h-auto"
        />
      </div>
      
      {/* Vertical pixel text on the left */}
      <div className="absolute top-1/2 left-12 -translate-y-1/2">
        <VerticalPixelText 
          text="TOOLS" 
          pixelSize={3}
          color="#06b6d4"
          animate={true}
          className="opacity-20"
        />
      </div>
    </div>
  );
}