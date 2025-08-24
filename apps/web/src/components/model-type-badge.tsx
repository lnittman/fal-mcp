import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ModelTypeBadgeProps {
  modelType: string;
  className?: string;
}

// Color mapping based on fal.ai's exact model type colors
const getModelTypeStyles = (modelType: string) => {
  const styles: Record<string, { bg: string; text: string; border: string }> = {
    'text-to-image': { 
      bg: 'bg-[#EDE4FF]', 
      text: 'text-[#5E2FBF]', 
      border: 'border-[#5E2FBF]/20' 
    },
    'image-to-image': { 
      bg: 'bg-[#D6EFFF]', 
      text: 'text-[#125DF3]', 
      border: 'border-[#125DF3]/20' 
    },
    'text-to-video': { 
      bg: 'bg-[#EDE4FF]', 
      text: 'text-[#5E2FBF]', 
      border: 'border-[#5E2FBF]/20' 
    },
    'image-to-video': { 
      bg: 'bg-[#D6EFFF]', 
      text: 'text-[#125DF3]', 
      border: 'border-[#125DF3]/20' 
    },
    'video-to-video': { 
      bg: 'bg-[#D9F7E8]', 
      text: 'text-[#00875A]', 
      border: 'border-[#00875A]/20' 
    },
    'text-to-audio': { 
      bg: 'bg-[#FFE5D9]', 
      text: 'text-[#E65100]', 
      border: 'border-[#E65100]/20' 
    },
    'audio-to-audio': { 
      bg: 'bg-[#FFE5D9]', 
      text: 'text-[#E65100]', 
      border: 'border-[#E65100]/20' 
    },
    'audio-to-text': { 
      bg: 'bg-[#FFE5D9]', 
      text: 'text-[#E65100]', 
      border: 'border-[#E65100]/20' 
    },
    'audio-to-video': { 
      bg: 'bg-[#D6EFFF]', 
      text: 'text-[#125DF3]', 
      border: 'border-[#125DF3]/20' 
    },
    'video-to-audio': { 
      bg: 'bg-[#D9F7E8]', 
      text: 'text-[#00875A]', 
      border: 'border-[#00875A]/20' 
    },
    'text-to-speech': { 
      bg: 'bg-[#FFE5D9]', 
      text: 'text-[#E65100]', 
      border: 'border-[#E65100]/20' 
    },
    'training': { 
      bg: 'bg-[#FFE5ED]', 
      text: 'text-[#D91F54]', 
      border: 'border-[#D91F54]/20' 
    },
  };
  
  return styles[modelType] || null;
};

export function ModelTypeBadge({ modelType, className }: ModelTypeBadgeProps) {
  const styles = getModelTypeStyles(modelType);
  
  if (!styles) return null;
  
  return (
    <span 
      className={cn(
        "inline-flex items-center text-[11.25px] font-semibold rounded-[1.875px] border p-0",
        styles.bg,
        styles.text,
        styles.border,
        className
      )}
    >
      <ChevronLeft className="w-3 h-3 opacity-40" />
      <span className="py-[1.875px] px-[3.75px] border-x border-inherit">
        {modelType}
      </span>
      <ChevronRight className="w-3 h-3 opacity-40" />
    </span>
  );
}