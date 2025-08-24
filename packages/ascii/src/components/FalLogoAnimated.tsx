"use client";

import React, { useEffect, useState } from "react";

interface FalLogoAnimatedProps {
  className?: string;
  onClick?: () => void;
  animate?: boolean;
}

// Simple ASCII art logo using basic characters
const SIMPLE_3D_FRAMES = [
  // Frame 1 - Front view
  `       __________
      /         /|
     /         / |
    /_________/  |
    |    ___  |  |
    |   |   | | /
    |   |___| |/
    |_________|`,
  
  // Frame 2 - Slight rotation
  `        __________
       /         /|
      /         / |
     /_________/  |
     |    ___  | /
     |   |   | |/
     |   |___| |
     |_________|`,
  
  // Frame 3 - More rotation  
  `         __________
        /         /|
       /         / |
      /_________/  |
      |    ___  |/
      |   |   | |
      |   |___| |
      |_________|`,
  
  // Frame 4 - Maximum rotation
  `          __________
         /         /|
        /         / |
       /_________/  |
       |    ___ |  /
       |   |   ||/
       |   |___| |
       |_________|`
];

// Static clean ASCII logo
const STATIC_ASCII_LOGO = `     ___________
    /          /|
   /    ___   / |
  /    /  /  /  |
 /    /__/  /   /
/_________ /   /
|         |   /
|   ___   |  /
|  |   |  | /
|  |___|  |/
|_________|`;

// Isometric 3D ASCII fal logo
const ISOMETRIC_FRAMES = [
  // Frame 1
  `       ___________
      /\\         /\\
     /  \\   __  /  \\
    /    \\ |  |/    \\
   /      \\|__|      \\
  /_______/    \\_______\\
  \\      /|    |\\      /
   \\    / |    | \\    /
    \\  /  |____|  \\  /
     \\/____________\\/`,

  // Frame 2
  `        ___________
       /\\         /\\
      /  \\   __  /  \\
     /    \\ |  |/    \\
    /      \\|__|      \\
   /_______/    \\_______\\
   \\      /|    |\\      /
    \\    / |    | \\    /
     \\  /  |____|  \\  /
      \\/____________\\/`,

  // Frame 3
  `         ___________
        /\\         /\\
       /  \\   __  /  \\
      /    \\ |  |/    \\
     /      \\|__|      \\
    /_______/    \\_______\\
    \\      /|    |\\      /
     \\    / |    | \\    /
      \\  /  |____|  \\  /
       \\/____________\\/`,

  // Frame 4  
  `          ___________
         /\\         /\\
        /  \\   __  /  \\
       /    \\ |  |/    \\
      /      \\|__|      \\
     /_______/    \\_______\\
     \\      /|    |\\      /
      \\    / |    | \\    /
       \\  /  |____|  \\  /
        \\/____________\\/`,
];

// Clean simple ASCII cube logo
const CLEAN_CUBE_LOGO = `      _____________
     /\\           /\\
    /  \\  _____  /  \\
   /    \\|     |/    \\
  /      \\|   |/      \\
 /_________\\|_|/_________\\
 \\         /   \\         /
  \\       /|   |\\       /
   \\     / |___| \\     /
    \\   /_______  \\   /
     \\_/         \\_\\_/`;

// Rotating cube frames
const ROTATING_CUBE_FRAMES = [
  // 0 degrees
  `     +---------+
     /|        /|
    / |  ___  / |
   /  | |   |/  |
  +---+--|--+---+
  |   |  |  |   |
  | __|__|__|__ |
  |/  |     |  \\|
  +---+-----+---+`,

  // 90 degrees
  `      +---------+
      /|        /|
     / |  ___  / |
    /  | |   |/  |
   +---+--|--+---+
   |   |  |  |   |
   | __|__|__|__ |
   |/  |     |  \\|
   +---+-----+---+`,

  // 180 degrees
  `       +---------+
       /|        /|
      / |  ___  / |
     /  | |   |/  |
    +---+--|--+---+
    |   |  |  |   |
    | __|__|__|__ |
    |/  |     |  \\|
    +---+-----+---+`,

  // 270 degrees
  `        +---------+
        /|        /|
       / |  ___  / |
      /  | |   |/  |
     +---+--|--+---+
     |   |  |  |   |
     | __|__|__|__ |
     |/  |     |  \\|
     +---+-----+---+`,
];

export function FalLogoAnimated({ className = "", onClick, animate = true }: FalLogoAnimatedProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!animate) return;

    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % ROTATING_CUBE_FRAMES.length);
      setRotation((prev) => (prev + 15) % 360);
    }, 150);

    return () => clearInterval(interval);
  }, [animate]);

  const handleClick = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    onClick?.();
  };

  // Create a simple 3D ASCII rotating effect
  const createRotatingLogo = () => {
    if (!animate) return STATIC_ASCII_LOGO;
    
    // Simple rotation by selecting different frames
    return ROTATING_CUBE_FRAMES[frameIndex] || ROTATING_CUBE_FRAMES[0];
  };

  return (
    <pre
      className={`font-mono select-none cursor-pointer ${animate ? 'mood-ring-ascii' : ''} ${className}`}
      style={{
        whiteSpace: "pre",
        lineHeight: "1",
        letterSpacing: "0.05em",
        fontFamily: 'monospace',
        transform: animate ? `perspective(600px) rotateY(${rotation * 0.5}deg)` : 'none',
        transition: 'transform 0.15s linear',
      }}
      onClick={handleClick}
    >
      {createRotatingLogo()}
    </pre>
  );
}