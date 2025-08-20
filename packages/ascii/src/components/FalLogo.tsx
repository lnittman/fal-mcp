"use client";

import React from "react";

interface FalLogoProps {
  className?: string;
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

export function FalLogo({ className = "" }: FalLogoProps) {
  return (
    <pre
      className={`font-mono select-none ${className}`}
      style={{
        whiteSpace: "pre",
        lineHeight: "1",
        letterSpacing: "-0.05em",
      }}
    >
      {ASCII_LOGO}
    </pre>
  );
}