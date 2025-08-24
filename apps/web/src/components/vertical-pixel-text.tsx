"use client";

import { useEffect, useRef } from "react";

interface VerticalPixelTextProps {
  text: string;
  className?: string;
  pixelSize?: number;
  color?: string;
  speed?: number;
  animate?: boolean;
}

export function VerticalPixelText({
  text = "FAL.AI",
  className = "",
  pixelSize = 4,
  color = "#9333ea",
  speed = 50,
  animate = true,
}: VerticalPixelTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = pixelSize * 8; // Width for vertical text
    canvas.height = pixelSize * text.length * 8; // Height based on text length

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create pixel font mapping (simplified 5x7 font)
    const pixelFont: Record<string, number[]> = {
      'F': [0b11111, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000, 0b10000],
      'A': [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
      'L': [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
      '.': [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b11000, 0b11000],
      'I': [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b11111],
      'M': [0b10001, 0b11011, 0b10101, 0b10001, 0b10001, 0b10001, 0b10001],
      'C': [0b01110, 0b10001, 0b10000, 0b10000, 0b10000, 0b10001, 0b01110],
      'P': [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000],
      ' ': [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000],
    };

    // Draw each character vertically
    text.toUpperCase().split('').forEach((char, charIndex) => {
      const charData = pixelFont[char] || pixelFont[' '];
      const yOffset = charIndex * 8 * pixelSize;

      charData.forEach((row, rowIndex) => {
        for (let col = 0; col < 5; col++) {
          if (row & (1 << (4 - col))) {
            // Draw pixel with some variation in opacity for depth
            const opacity = animate ? 0.7 + Math.random() * 0.3 : 1;
            ctx.fillStyle = color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
            ctx.fillRect(
              col * pixelSize + pixelSize,
              yOffset + rowIndex * pixelSize,
              pixelSize - 1,
              pixelSize - 1
            );
          }
        }
      });
    });

    if (!animate) return;

    // Animate pixels
    let frame = 0;
    const animatePixels = () => {
      frame++;
      if (frame % speed !== 0) {
        requestAnimationFrame(animatePixels);
        return;
      }

      // Random pixel flicker effect
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 0) { // If pixel is visible
          // Random flicker
          if (Math.random() > 0.98) {
            data[i + 3] = Math.floor(Math.random() * 128 + 127);
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      requestAnimationFrame(animatePixels);
    };

    if (animate) {
      animatePixels();
    }
  }, [text, pixelSize, color, speed, animate]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{
        imageRendering: 'pixelated',
        opacity: 0.8,
      }}
    />
  );
}