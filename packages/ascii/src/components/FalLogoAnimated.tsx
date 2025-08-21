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

// fal.ai brand colors
const colors = [
  "#125DF3", // Sky blue
  "#6120EE", // Purple
  "#4A6D03", // Green
  "#D23768", // Rose
];

export function FalLogoAnimated({ className = "", onClick }: FalLogoAnimatedProps) {
  // Initialize with a random color on mount
  const [currentColor, setCurrentColor] = useState<string>(() => {
    if (typeof window === 'undefined') return colors[0];
    return colors[Math.floor(Math.random() * colors.length)];
  });

  const handleClick = () => {
    // Trigger haptic feedback if available
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10); // Short 10ms haptic tap
    }
    
    // Get a different random color
    const availableColors = colors.filter(c => c !== currentColor);
    const newColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    setCurrentColor(newColor);
    
    onClick?.();
  };

  return (
    <pre
      className={`font-mono select-none cursor-pointer ${className}`}
      style={{
        whiteSpace: "pre",
        lineHeight: "1",
        letterSpacing: "-0.05em",
        color: currentColor,
      }}
      onClick={handleClick}
    >
      {ASCII_LOGO}
    </pre>
  );
}