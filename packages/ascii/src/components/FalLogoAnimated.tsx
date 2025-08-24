"use client";

import React, { useEffect, useState } from "react";

interface FalLogoAnimatedProps {
  className?: string;
  onClick?: () => void;
  animate?: boolean;
}

// Accurate fal logo - rounded square with four extensions and center hole
const FAL_LOGO_ASCII = `        ___
      _/   \\_
    _/       \\_
   |    ___    |
   |   /   \\   |
  /|  |     |  |\\
 |  \\ |     | /  |
 |   \\|     |/   |
 |    \\___/     |
  \\             /
   |           |
   \\_       _/
     \\_   _/
       ---`;

// fal logo as geometric shape with cross-like extensions
const FAL_CROSS_LOGO = `       ___
     _|   |_
   _|       |_
  |    ___    |
  |   /   \\   |
--|  |     |  |--
  |  |     |  |
  |   \\___/   |
  |_         _|
    |_     _|
      |___|`;

// Animated frames showing the fal logo with 3D depth
const FAL_SHAPE_FRAMES = [
  // Frame 1 - Direct front view
  `       ___
     _|   |_
   _|       |_
  |    ___    |
  |   /   \\   |
--|  |     |  |--
  |  |     |  |
  |   \\___/   |
  |_         _|
    |_     _|
      |___|`,
  
  // Frame 2 - Slight 3D perspective
  `        ___
      _|   |_
    _|       |_
   |    ___    |
   |   /   \\   |
 --|  |     |  |--
   |  |     |  |
   |   \\___/   |
   |_         _|
     |_     _|
       |___|`,
  
  // Frame 3 - More 3D depth  
  `         ___
       _|   |_
     _|       |_
    |    ___    |
    |   /   \\   |
  --|  |     |  |--
    |  |     |  |
    |   \\___/   |
    |_         _|
      |_     _|
        |___|`,
  
  // Frame 4 - Maximum perspective
  `          ___
        _|   |_
      _|       |_
     |    ___    |
     |   /   \\   |
   --|  |     |  |--
     |  |     |  |
     |   \\___/   |
     |_         _|
       |_     _|
         |___|`
];

// Static fal logo - most accurate representation
const STATIC_FAL_LOGO = `       ___
     _|   |_
   _|       |_
  |    ___    |
  |   /   \\   |
--|  |     |  |--
  |  |     |  |
  |   \\___/   |
  |_         _|
    |_     _|
      |___|`;

// Alternative simpler version
const SIMPLE_FAL_ASCII = `      ___
    _/   \\_
  _/  ___  \\_
 |   /   \\   |
-|  |     |  |-
 |  |     |  |
 |   \\___/   |
  \\_       _/
    \\_   _/
      ---`;

export function FalLogoAnimated({ className = "", onClick, animate = true }: FalLogoAnimatedProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!animate) return;

    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % FAL_SHAPE_FRAMES.length);
      setRotation((prev) => (prev + 20) % 360);
    }, 200);

    return () => clearInterval(interval);
  }, [animate]);

  const handleClick = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    onClick?.();
  };

  // Create rotating fal logo effect
  const createRotatingLogo = () => {
    if (!animate) return STATIC_FAL_LOGO;
    
    // Use the accurate fal shape frames
    return FAL_SHAPE_FRAMES[frameIndex] || FAL_SHAPE_FRAMES[0];
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
        transition: 'transform 0.2s linear',
      }}
      onClick={handleClick}
    >
      {createRotatingLogo()}
    </pre>
  );
}