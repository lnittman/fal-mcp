import { cn } from "@/lib/utils";

interface PixelIconProps {
  className?: string;
  variant?: "image" | "video" | "audio" | "llm" | "voice" | "default";
}

export function PixelIcon({ className, variant = "default" }: PixelIconProps) {
  const colors = {
    image: "fill-blue-400",
    video: "fill-purple-400", 
    audio: "fill-green-400",
    llm: "fill-orange-400",
    voice: "fill-pink-400",
    default: "fill-gray-400"
  };

  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      className={cn(colors[variant], className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="6" width="3" height="3" />
      <rect x="3" y="3" width="3" height="3" />
      <rect x="3" y="9" width="3" height="3" />
      <rect x="6" y="0" width="3" height="3" />
      <rect x="6" y="6" width="3" height="3" />
      <rect x="6" y="12" width="3" height="3" />
      <rect x="9" y="3" width="3" height="3" />
      <rect x="9" y="9" width="3" height="3" />
      <rect x="12" y="6" width="3" height="3" />
    </svg>
  );
}