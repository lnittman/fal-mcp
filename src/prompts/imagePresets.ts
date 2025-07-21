import { type PromptMetadata } from "xmcp";

// Define common style presets for image generation
export const pixelArtPrompt: PromptMetadata = {
  name: "pixel_art",
  title: "Pixel Art Style",
  description: "Generate images in retro pixel art style",
  arguments: [
    {
      name: "subject",
      description: "The main subject to generate (e.g., 'cat', 'spaceship', 'landscape')",
      required: true,
    },
    {
      name: "colorPalette",
      description: "Color scheme (e.g., 'gameboy', 'neon', 'pastel', 'retro')",
      required: false,
    },
    {
      name: "resolution",
      description: "Pixel grid size (e.g., '16x16', '32x32', '64x64')",
      required: false,
    }
  ],
};

export const animePrompt: PromptMetadata = {
  name: "anime_style",
  title: "Anime/Manga Style",
  description: "Generate images in anime or manga art style",
  arguments: [
    {
      name: "character",
      description: "Character description",
      required: true,
    },
    {
      name: "mood",
      description: "Mood or emotion (e.g., 'happy', 'dramatic', 'peaceful')",
      required: false,
    },
    {
      name: "setting",
      description: "Background setting (e.g., 'school', 'fantasy world', 'city')",
      required: false,
    }
  ],
};

export const photorealisticPrompt: PromptMetadata = {
  name: "photorealistic",
  title: "Photorealistic Style",
  description: "Generate highly realistic, photograph-like images",
  arguments: [
    {
      name: "subject",
      description: "What to photograph",
      required: true,
    },
    {
      name: "lighting",
      description: "Lighting setup (e.g., 'golden hour', 'studio', 'natural')",
      required: false,
    },
    {
      name: "camera",
      description: "Camera settings (e.g., 'shallow DoF', 'wide angle', 'macro')",
      required: false,
    }
  ],
};

export const watercolorPrompt: PromptMetadata = {
  name: "watercolor",
  title: "Watercolor Painting",
  description: "Generate images in watercolor painting style",
  arguments: [
    {
      name: "subject",
      description: "The subject to paint",
      required: true,
    },
    {
      name: "technique",
      description: "Watercolor technique (e.g., 'wet-on-wet', 'dry brush', 'splatter')",
      required: false,
    },
    {
      name: "colors",
      description: "Color palette (e.g., 'vibrant', 'muted', 'monochrome')",
      required: false,
    }
  ],
};

// Handler to build the actual prompt from arguments
export function buildPrompt(promptName: string, args: Record<string, string>): string {
  switch (promptName) {
    case "pixel_art":
      const pixelBase = `pixel art style, ${args.subject}`;
      const pixelParts = [pixelBase];
      if (args.colorPalette) pixelParts.push(`${args.colorPalette} color palette`);
      if (args.resolution) pixelParts.push(`${args.resolution} pixel grid`);
      pixelParts.push("retro 8-bit aesthetic, clean pixels, no anti-aliasing");
      return pixelParts.join(", ");
      
    case "anime_style":
      const animeBase = `anime manga art style, ${args.character}`;
      const animeParts = [animeBase];
      if (args.mood) animeParts.push(`${args.mood} mood`);
      if (args.setting) animeParts.push(`${args.setting} background`);
      animeParts.push("detailed anime illustration, vibrant colors");
      return animeParts.join(", ");
      
    case "photorealistic":
      const photoBase = `photorealistic, ${args.subject}`;
      const photoParts = [photoBase];
      if (args.lighting) photoParts.push(`${args.lighting} lighting`);
      if (args.camera) photoParts.push(`${args.camera} photography`);
      photoParts.push("highly detailed, professional photography");
      return photoParts.join(", ");
      
    case "watercolor":
      const waterBase = `watercolor painting, ${args.subject}`;
      const waterParts = [waterBase];
      if (args.technique) waterParts.push(`${args.technique} technique`);
      if (args.colors) waterParts.push(`${args.colors} colors`);
      waterParts.push("artistic watercolor style, paint texture visible");
      return waterParts.join(", ");
      
    default:
      throw new Error(`Unknown prompt: ${promptName}`);
  }
}

// Export all prompts
export const prompts = [
  pixelArtPrompt,
  animePrompt,
  photorealisticPrompt,
  watercolorPrompt,
];