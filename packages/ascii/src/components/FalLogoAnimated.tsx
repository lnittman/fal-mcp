"use client";

import React from "react";

interface FalLogoAnimatedProps {
  className?: string;
  onClick?: () => void;
}

const ASCII_LOGO = `   ▄████  ▄▄▄       ██▓         ███▄ ▄███▓  ▄████▄   ██▓███  
  ▓██    ▒████▄    ▓██▒        ▓██▒▀█▀ ██▒ ▒██▀ ▀█  ▓██░  ██▒
  ▒████  ▒██  ▀█▄  ▒██░        ▓██    ▓██░ ▒▓█    ▄ ▓██░ ██▓▒
  ░▓█▒   ░██▄▄▄▄██ ▒██░        ▒██    ▒██  ▒▓▓▄ ▄██▒▒██▄█▓▒ ▒
  ░▒█░    ▓█   ▓██▒░██████▒    ▒██▒   ░██▒ ▒ ▓███▀ ░▒██▒ ░  ░
   ▒ ░    ▒▒   ▓▒█░░ ▒░▓  ░    ░ ▒░   ░  ░ ░ ░▒ ▒  ░▒▓▒░ ░  ░
   ░       ▒   ▒▒ ░░ ░ ▒  ░    ░  ░      ░   ░  ▒   ░▒ ░     
   ░ ░     ░   ▒     ░ ░       ░      ░    ░        ░░       
                ░  ░    ░  ░           ░    ░ ░               `;

export function FalLogoAnimated({ className = "", onClick }: FalLogoAnimatedProps) {
  const handleClick = () => {
    // Trigger haptic feedback if available
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10); // Short 10ms haptic tap
    }
    onClick?.();
  };

  return (
    <pre
      className={`font-mono select-none cursor-pointer mood-ring-ascii ${className}`}
      style={{
        whiteSpace: "pre",
        lineHeight: "1",
        letterSpacing: "-0.05em",
      }}
      onClick={handleClick}
    >
      {ASCII_LOGO}
    </pre>
  );
}