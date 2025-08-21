"use client";

import React, { useState, useEffect } from "react";

interface FalLogoAnimatedProps {
  className?: string;
  onClick?: () => void;
}

const ASCII_LOGO = `  ▄████  ▄▄▄       ██▓        ███▄ ▄███▓ ▄████▄   ██▓███  
 ▓██▒    ▒████▄    ▓██▒       ▓██▒▀█▀ ██▒▒██▀ ▀█  ▓██░  ██▒
 ▒████   ▒██  ▀█▄  ▒██░       ▓██    ▓██░▒▓█    ▄ ▓██░ ██▓▒
 ░▓█▒    ░██▄▄▄▄██ ▒██░       ▒██    ▒██ ▒▓▓▄ ▄██▒▒██▄█▓▒ ▒
 ░▒█░     ▓█   ▓██▒░██████▒   ▒██▒   ░██▒▒ ▓███▀ ░▒██▒ ░  ░
  ▒ ░     ▒▒   ▓▒█░░ ▒░▓  ░   ░ ▒░   ░  ░░ ░▒ ▒  ░▒▓▒░ ░  ░
  ░        ▒   ▒▒ ░░ ░ ▒  ░   ░  ░      ░  ░  ▒   ░▒ ░     
  ░ ░      ░   ▒     ░ ░      ░      ░   ░        ░░       
               ░  ░    ░  ░          ░   ░ ░               `;

// fal.ai brand color palettes
const colorPalettes = [
  // Default gray
  { 
    name: "default",
    className: "text-gray-900",
    glow: "0 0 20px rgba(17, 24, 39, 0.2)"
  },
  // Sky blue (image-to-video, image-to-image)
  { 
    name: "sky",
    className: "text-[#125DF3]",
    glow: "0 0 20px rgba(18, 93, 243, 0.3)"
  },
  // Purple (text-to-video, text-to-image)
  { 
    name: "purple",
    className: "text-[#6120EE]",
    glow: "0 0 20px rgba(97, 32, 238, 0.3)"
  },
  // Green (video-to-video)
  { 
    name: "green",
    className: "text-[#4A6D03]",
    glow: "0 0 20px rgba(74, 109, 3, 0.3)"
  },
  // Rose (training)
  { 
    name: "rose",
    className: "text-[#D23768]",
    glow: "0 0 20px rgba(210, 55, 104, 0.3)"
  },
];

export function FalLogoAnimated({ className = "", onClick }: FalLogoAnimatedProps) {
  const [currentPalette, setCurrentPalette] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      const nextPalette = (currentPalette + 1) % colorPalettes.length;
      
      // Animate through colors quickly then settle
      let cycleCount = 0;
      const cycleInterval = setInterval(() => {
        cycleCount++;
        setCurrentPalette(prev => (prev + 1) % colorPalettes.length);
        
        if (cycleCount >= colorPalettes.length * 2) {
          clearInterval(cycleInterval);
          setCurrentPalette(nextPalette);
          setIsAnimating(false);
        }
      }, 100);
    }
    
    onClick?.();
  };

  // Auto cycle colors on hover
  useEffect(() => {
    if (isHovered && !isAnimating) {
      const interval = setInterval(() => {
        setCurrentPalette(prev => (prev + 1) % colorPalettes.length);
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [isHovered, isAnimating]);

  const palette = colorPalettes[currentPalette];

  return (
    <pre
      className={`font-mono select-none cursor-pointer transition-all duration-300 ${palette.className} ${className} ${
        isAnimating ? 'animate-pulse' : ''
      }`}
      style={{
        whiteSpace: "pre",
        lineHeight: "1",
        letterSpacing: "-0.05em",
        textShadow: palette.glow,
        transform: isHovered ? "scale(1.02)" : "scale(1)",
        transition: "all 0.3s ease",
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {ASCII_LOGO}
    </pre>
  );
}