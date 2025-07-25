"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TextScrambleProps {
  text: string;
  className?: string;
  duration?: number;
  characterSet?: string;
}

export function TextScramble({
  text,
  className,
  duration = 1,
  characterSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
}: TextScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const originalText = text;
    const textLength = originalText.length;
    const animationDuration = duration * 1000;
    
    let animationFrame: number;
    const startTime = Date.now();

    const scramble = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      const revealedLength = Math.floor(progress * textLength);
      let scrambledText = originalText.slice(0, revealedLength);
      
      for (let i = revealedLength; i < textLength; i++) {
        if (originalText[i] === " ") {
          scrambledText += " ";
        } else {
          scrambledText += characterSet[Math.floor(Math.random() * characterSet.length)];
        }
      }
      
      element.textContent = scrambledText;
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(scramble);
      }
    };

    scramble();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [text, duration, characterSet]);

  return <span ref={ref} className={cn(className)}>{text}</span>;
}