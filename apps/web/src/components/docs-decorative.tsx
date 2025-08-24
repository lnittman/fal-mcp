"use client";

import Image from "next/image";
import { VerticalPixelText } from "./vertical-pixel-text";

export function DocsDecorativeElements() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Exact fal.ai decorative elements for docs page */}
      
      {/* Top right element */}
      <div className="absolute top-32 right-0 w-48 h-48 opacity-60">
        <Image
          src="/decorative/right-1.svg"
          alt=""
          width={236}
          height={98}
          className="w-full h-auto"
        />
      </div>
      
      {/* Left side element */}
      <div className="absolute top-64 left-0 w-32 h-32 opacity-40">
        <Image
          src="/decorative/left-2.svg"
          alt=""
          width={269}
          height={208}
          className="w-full h-auto"
        />
      </div>
      
      {/* Bottom left accent */}
      <div className="absolute bottom-24 left-0 w-20 h-28 opacity-30">
        <Image
          src="/decorative/left-4.svg"
          alt=""
          width={255}
          height={338}
          className="w-full h-auto"
        />
      </div>
      
      {/* Vertical pixel text on the right */}
      <div className="absolute top-1/2 right-8 -translate-y-1/2">
        <VerticalPixelText 
          text="DOCS" 
          pixelSize={3}
          color="#9333ea"
          animate={true}
          className="opacity-20"
        />
      </div>
    </div>
  );
}