"use client";

import React, { useEffect, useState } from "react";

interface Fal3DLogoProps {
  className?: string;
  animate?: boolean;
  onClick?: () => void;
}

// Create multiple frames for 3D rotation effect
const createFrame = (rotation: number): string => {
  const frames = [
    // Frame 1 - Front view
    `    ▄████  ▄▄▄       ██▓    
   ██▀    ▒████▄    ▓██▒    
  ▓████   ▒██  ▀█▄  ▒██░    
  ▓██     ░██▄▄▄▄██ ▒██░    
  ▒██      ▓█   ▓██▒░██████▒
  ░▒       ▒▒   ▓▒█░░ ▒░▓  ░
  ░░        ▒   ▒▒ ░░ ░ ▒  ░
            ░   ▒     ░ ░   
                ░  ░    ░  ░`,
    
    // Frame 2 - Slight rotation
    `     ▄████▄  ▄▄▄       ██▓   
    ██▀▀    ▒████▄    ▓██▒   
   ▓████▄   ▒██  ▀█▄  ▒██░   
   ▓██  ▀   ░██▄▄▄▄██ ▒██░   
   ▒██       ▓█   ▓██▒░██████
   ░▒░       ▒▒   ▓▒█░░ ▒░▓  
   ░░         ▒   ▒▒ ░░ ░ ▒  
              ░   ▒     ░ ░  
                  ░  ░    ░  `,
    
    // Frame 3 - More rotation
    `      ▄████▄▄  ▄▄▄       ██▓  
     ██▀▀▀    ▒████▄    ▓██▒  
    ▓████▄▄   ▒██  ▀█▄  ▒██░  
    ▓██   ▀   ░██▄▄▄▄██ ▒██░  
    ▒██  ░     ▓█   ▓██▒░█████
    ░▒░  ░     ▒▒   ▓▒█░░ ▒░▓ 
    ░░   ░      ▒   ▒▒ ░░ ░ ▒ 
         ░      ░   ▒     ░ ░ 
                    ░  ░    ░ `,
    
    // Frame 4 - Maximum rotation
    `       ▄████▄▄▄  ▄▄▄       ██▓ 
      ██▀▀▀▀    ▒████▄    ▓██▒ 
     ▓████▄▄▄   ▒██  ▀█▄  ▒██░ 
     ▓██    ▀   ░██▄▄▄▄██ ▒██░ 
     ▒██   ░     ▓█   ▓██▒░████
     ░▒░   ░     ▒▒   ▓▒█░░ ▒░▓
     ░░    ░      ▒   ▒▒ ░░ ░ ▒
          ░       ░   ▒     ░ ░
                      ░  ░    ░`,
  ];
  
  // Calculate which frame to show based on rotation
  const frameIndex = Math.floor((rotation / 360) * frames.length) % frames.length;
  return frames[frameIndex];
};

// ASCII art with dripping effect matching MCP style
const ASCII_FAL_DRIP = `    ████            ██          
   ██              ███          
  ████   ▄▄▄       ██           
  ██    ▒████▄     ██           
  ██    ▒██  ██    ██           
  ██     ▒████     ██           
  ██      ░▒       ███          
  ▓       ░░        ▒           
  ▒       ░         ░           
  ░                             `;

export function Fal3DLogo({ className = "", animate = true, onClick }: Fal3DLogoProps) {
  const [rotation, setRotation] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    if (!animate) return;

    const interval = setInterval(() => {
      setRotation((prev) => (prev + 10) % 360);
      setCurrentFrame((prev) => (prev + 1) % 60);
    }, 100);

    return () => clearInterval(interval);
  }, [animate]);

  const handleClick = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    onClick?.();
  };

  // Create 3D isometric effect
  const create3DEffect = () => {
    const depth = 3;
    const lines = ASCII_FAL_DRIP.split('\n');
    const result: string[] = [];
    
    // Add depth layers
    for (let d = depth; d >= 0; d--) {
      lines.forEach((line, i) => {
        const offset = ' '.repeat(depth - d);
        const layerChar = d === 0 ? line : line.replace(/[█▓▒░]/g, (match) => {
          // Create depth effect with different characters
          if (d === depth) return '░';
          if (d === depth - 1) return '▒';
          return '▓';
        });
        
        if (!result[i + d]) {
          result[i + d] = offset + layerChar;
        }
      });
    }
    
    return result.join('\n');
  };

  // Animated 3D rotation effect
  const create3DRotation = () => {
    const baseArt = `    ████            ██          
   ██              ███          
  ████   ▄▄▄       ██           
  ██    ▒████▄     ██           
  ██    ▒██  ██    ██           
  ██     ▒████     ██           
  ██      ░▒       ███          
  ▓▓      ░░        ▒▒          
  ▒▒      ░░        ░░          
  ░░      ░         ░           
  ░       ░                     
          ░                     `;

    const lines = baseArt.split('\n');
    const rotatedLines: string[] = [];
    
    // Apply rotation transformation
    const angleRad = (rotation * Math.PI) / 180;
    const skewFactor = Math.sin(angleRad) * 0.3;
    
    lines.forEach((line, i) => {
      const offset = Math.floor(Math.abs(skewFactor * i));
      const spaces = ' '.repeat(offset);
      
      // Add 3D depth effect
      let depthLine = line;
      if (i > 0 && i < lines.length - 2) {
        depthLine = line.replace(/([█▓▒░])(.)/g, (match, char, next) => {
          if (skewFactor > 0.1) {
            return char + '░';
          }
          return match;
        });
      }
      
      rotatedLines.push(spaces + depthLine);
    });
    
    return rotatedLines.join('\n');
  };

  return (
    <pre
      className={`font-mono select-none cursor-pointer transition-all duration-300 ${className}`}
      style={{
        whiteSpace: "pre",
        lineHeight: "1",
        letterSpacing: "-0.05em",
        transform: animate ? `perspective(1000px) rotateY(${rotation * 0.5}deg)` : 'none',
        transformStyle: 'preserve-3d',
        filter: animate ? `drop-shadow(${Math.sin(rotation * 0.02) * 2}px ${Math.cos(rotation * 0.02) * 2}px 4px rgba(0,0,0,0.2))` : 'none',
      }}
      onClick={handleClick}
    >
      {animate ? create3DRotation() : create3DEffect()}
    </pre>
  );
}