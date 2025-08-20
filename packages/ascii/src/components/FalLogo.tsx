"use client";

import React, { useEffect, useRef } from "react";
import data from "../data/fal-logo.json";

interface FalLogoProps {
  className?: string;
  interval?: number;
}

export function FalLogo({ className = "", interval = 150 }: FalLogoProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let index = 0;
    
    const animate = () => {
      if (ref.current) {
        ref.current.innerHTML = data[index];
        index = (index + 1) % data.length;
      }
    };
    
    // Initialize first frame
    animate();
    
    // Start animation
    const intervalId = setInterval(animate, interval);
    
    return () => clearInterval(intervalId);
  }, [interval]);
  
  return (
    <div
      ref={ref}
      className={`font-mono select-none ${className}`}
      style={{
        whiteSpace: "pre",
        lineHeight: "1",
        letterSpacing: "-0.05em",
      }}
    />
  );
}