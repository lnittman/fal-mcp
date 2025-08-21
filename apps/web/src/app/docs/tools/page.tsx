"use client";

import { FloatingHeader } from "@/components/floating-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { LenisProvider } from "@/components/lenis-provider";
import { PixelIcon } from "@/components/pixel-icon";

const tools = [
  // Image Tools
  {
    id: "textToImage",
    name: "Text to Image",
    category: "Image",
    modelType: "text-to-image",
    description: "Generate images from text descriptions using any fal.ai model",
    modelSupport: "All image generation models",
  },
  {
    id: "imageToImage",
    name: "Image to Image",
    category: "Image",
    modelType: "image-to-image",
    description: "Transform images using AI-powered style transfer and editing",
    modelSupport: "Style transfer & editing models",
  },
  {
    id: "backgroundRemoval",
    name: "Background Removal",
    category: "Image",
    modelType: "image-to-image",
    description: "Remove backgrounds from images with precision",
    modelSupport: "Background removal models",
  },
  {
    id: "objectRemoval",
    name: "Object Removal",
    category: "Image",
    modelType: "image-to-image",
    description: "AI-powered inpainting to remove unwanted objects",
    modelSupport: "Inpainting models",
  },
  {
    id: "upscaleImage",
    name: "Image Upscaling",
    category: "Image",
    modelType: "image-to-image",
    description: "Enhance image resolution with AI super-resolution",
    modelSupport: "Upscaling models",
  },
  {
    id: "batchBackgroundRemoval",
    name: "Batch Background Removal",
    category: "Image",
    modelType: "image-to-image",
    description: "Remove backgrounds from multiple images at once",
    modelSupport: "Background removal models",
  },
  {
    id: "batchProcessImages",
    name: "Batch Process Images",
    category: "Image",
    modelType: "image-to-image",
    description: "Apply transformations to entire directories",
    modelSupport: "All image models",
  },
  {
    id: "imageToJson",
    name: "Image to JSON",
    category: "Image",
    modelType: "image-to-image",
    description: "Extract structured data from images using vision models",
    modelSupport: "Vision models",
  },
  {
    id: "saveImage",
    name: "Save Image",
    category: "Utilities",
    modelType: null,
    description: "Download and save images from URLs",
    modelSupport: "N/A",
  },
  
  // Video Tools
  {
    id: "textToVideo",
    name: "Text to Video",
    category: "Video",
    modelType: "text-to-video",
    description: "Generate videos from text descriptions",
    modelSupport: "Video generation models",
  },
  {
    id: "imageToVideo",
    name: "Image to Video",
    category: "Video",
    modelType: "image-to-video",
    description: "Animate static images into dynamic videos",
    modelSupport: "Image animation models",
  },
  
  // Audio Tools
  {
    id: "textToSpeech",
    name: "Text to Speech",
    category: "Audio",
    modelType: "text-to-audio",
    description: "Natural voice synthesis in multiple languages",
    modelSupport: "TTS models",
  },
  {
    id: "speechToText",
    name: "Speech to Text",
    category: "Audio",
    modelType: "audio-to-text",
    description: "Transcribe audio to text in 100+ languages",
    modelSupport: "Whisper & transcription models",
  },
  {
    id: "textToAudio",
    name: "Text to Audio",
    category: "Audio",
    modelType: "text-to-audio",
    description: "Generate music and sound effects from descriptions",
    modelSupport: "Audio generation models",
  },
  {
    id: "audioToAudio",
    name: "Audio to Audio",
    category: "Audio",
    modelType: "audio-to-audio",
    description: "Transform and edit audio files with AI",
    modelSupport: "Audio processing models",
  },
  
  // Discovery & Utility Tools
  {
    id: "discoverModelsDynamic",
    name: "Discover Models",
    category: "Discovery",
    modelType: null,
    description: "Explore available fal.ai models dynamically",
    modelSupport: "All models",
  },
  {
    id: "listModelsDynamic",
    name: "List Models",
    category: "Discovery",
    modelType: null,
    description: "Get categorized lists of available models",
    modelSupport: "All models",
  },
  {
    id: "recommendModel",
    name: "Recommend Model",
    category: "Discovery",
    modelType: null,
    description: "Get AI recommendations for your use case",
    modelSupport: "All models",
  },
  {
    id: "modelDocs",
    name: "Model Documentation",
    category: "Discovery",
    modelType: null,
    description: "Get detailed documentation for specific models",
    modelSupport: "All models",
  },
  
  // Workflow Tools
  {
    id: "workflowChain",
    name: "Workflow Chain",
    category: "Workflows",
    modelType: null,
    description: "Chain multiple operations into complex pipelines",
    modelSupport: "All models",
  },
  {
    id: "enhancePrompt",
    name: "Enhance Prompt",
    category: "Utilities",
    modelType: null,
    description: "Optimize prompts for better model results",
    modelSupport: "LLM models",
  },
  {
    id: "courseModels",
    name: "Course Models",
    category: "Learning",
    modelType: "training",
    description: "Interactive guided tour of fal.ai capabilities",
    modelSupport: "All models",
  },
  {
    id: "getSystemInstructions",
    name: "System Instructions",
    category: "Utilities",
    modelType: null,
    description: "Get comprehensive tool documentation",
    modelSupport: "N/A",
  },
  
  // File Management
  {
    id: "uploadFile",
    name: "Upload File",
    category: "Files",
    modelType: null,
    description: "Upload local files to fal.ai storage",
    modelSupport: "N/A",
  },
  {
    id: "downloadFile",
    name: "Download File",
    category: "Files",
    modelType: null,
    description: "Download files from URLs to local storage",
    modelSupport: "N/A",
  },
  
  // Specialized Tools
  {
    id: "textToImageStyled",
    name: "Text to Image (Styled)",
    category: "Image",
    modelType: "text-to-image",
    description: "Generate images with style exploration features",
    modelSupport: "Style-aware models",
  },
  {
    id: "jsonTools",
    name: "JSON Tools",
    category: "Utilities",
    modelType: null,
    description: "Utilities for working with JSON data",
    modelSupport: "N/A",
  },
];

const categories = [...new Set(tools.map(t => t.category))].sort();

// Model type color mapping based on fal.ai brand colors
const getModelTypeStyles = (modelType: string | null) => {
  if (!modelType) return null;
  
  const styles: Record<string, { bg: string; text: string; border: string }> = {
    'text-to-image': { bg: 'bg-fal-purple-background', text: 'text-fal-purple-foreground', border: 'border-fal-purple-foreground/20' },
    'image-to-image': { bg: 'bg-fal-sky-background', text: 'text-fal-sky-foreground', border: 'border-fal-sky-foreground/20' },
    'text-to-video': { bg: 'bg-fal-purple-background', text: 'text-fal-purple-foreground', border: 'border-fal-purple-foreground/20' },
    'image-to-video': { bg: 'bg-fal-sky-background', text: 'text-fal-sky-foreground', border: 'border-fal-sky-foreground/20' },
    'video-to-video': { bg: 'bg-fal-green-background', text: 'text-fal-green-foreground', border: 'border-fal-green-foreground/20' },
    'text-to-audio': { bg: 'bg-fal-purple-background', text: 'text-fal-purple-foreground', border: 'border-fal-purple-foreground/20' },
    'audio-to-audio': { bg: 'bg-fal-purple-background', text: 'text-fal-purple-foreground', border: 'border-fal-purple-foreground/20' },
    'audio-to-text': { bg: 'bg-fal-purple-background', text: 'text-fal-purple-foreground', border: 'border-fal-purple-foreground/20' },
    'audio-to-video': { bg: 'bg-fal-purple-background', text: 'text-fal-purple-foreground', border: 'border-fal-purple-foreground/20' },
    'video-to-audio': { bg: 'bg-fal-green-background', text: 'text-fal-green-foreground', border: 'border-fal-green-foreground/20' },
    'training': { bg: 'bg-fal-rose-background', text: 'text-fal-rose-foreground', border: 'border-fal-rose-foreground/20' },
  };
  
  return styles[modelType] || null;
};

export default function ToolsPage() {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const filteredTools = tools.filter(tool => {
    const matchesCategory = filter === "all" || tool.category === filter;
    const matchesSearch = !searchQuery || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Check scroll state for mobile carousel
  const checkScrollState = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    checkScrollState();
    container.addEventListener('scroll', checkScrollState, { passive: true });
    
    return () => container.removeEventListener('scroll', checkScrollState);
  }, []);

  useEffect(() => {
    checkScrollState();
  }, [filter]);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <LenisProvider>
      <div className="min-h-screen bg-white">
        <FloatingHeader />

        {/* Main content - account for header height and margin */}
        <div className="pt-40 pb-24">
          <div className="max-w-6xl mx-auto px-6">
            <h1 className="text-4xl font-heading font-light text-gray-900 mb-4">Tools Reference</h1>
            <p className="text-gray-600 mb-12">
              Complete list of available fal-mcp tools for AI generation
            </p>

            {/* Filters - Horizontal scroll on mobile */}
            <div className="relative mb-8 -mx-6">
              {/* Left fade indicator */}
              {canScrollLeft && (
                <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-6 bg-gradient-to-r from-white to-transparent lg:hidden" />
              )}
              
              {/* Right fade indicator */}
              {canScrollRight && (
                <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-6 bg-gradient-to-l from-white to-transparent lg:hidden" />
              )}
              
              <div 
                ref={scrollContainerRef}
                className="flex items-center gap-3 overflow-x-auto lg:flex-wrap scrollbar-none pl-6 lg:px-6"
                style={{ scrollBehavior: 'smooth' }}
              >
                <Button
                  variant={filter === "all" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className="flex-shrink-0"
                >
                  All ({tools.length})
                </Button>
                {categories.map((category) => {
                  const count = tools.filter((t) => t.category === category).length;
                  const iconVariant = category.toLowerCase().includes("image") ? "image" : 
                                     category.toLowerCase().includes("video") ? "video" :
                                     category.toLowerCase().includes("audio") ? "audio" :
                                     category.toLowerCase().includes("voice") ? "voice" :
                                     category.toLowerCase().includes("llm") ? "llm" : "default";
                  
                  // Get category color based on most common model type
                  const categoryTools = tools.filter(t => t.category === category);
                  const modelTypes = categoryTools.map(t => t.modelType).filter(Boolean);
                  const mostCommonType = modelTypes.length > 0 ? modelTypes[0] : null;
                  const categoryStyles = mostCommonType ? getModelTypeStyles(mostCommonType) : null;
                  
                  return (
                    <Button
                      key={category}
                      variant={filter === category ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setFilter(category)}
                      className={`flex-shrink-0 gap-1.5 ${
                        filter === category && categoryStyles
                          ? `${categoryStyles.bg} ${categoryStyles.text} hover:opacity-90 border ${categoryStyles.border}`
                          : ''
                      }`}
                    >
                      <PixelIcon variant={iconVariant} className="w-3 h-3" />
                      {category} ({count})
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Search - Mobile optimized */}
            <div className="mb-12 relative">
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-16 text-base md:text-sm rounded-[0.25rem] bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-900 placeholder-gray-500"
                style={{ fontSize: '16px' }} // Prevent zoom on iOS
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-mono bg-gray-200 text-gray-700 rounded-[0.25rem] hover:bg-gray-300 transition-colors duration-150"
                >
                  ESC
                </button>
              )}
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filteredTools.map((tool) => (
                <div 
                  key={tool.id} 
                  className="p-6 border border-gray-200 rounded-[0.25rem] hover:border-gray-300 transition-colors duration-150 bg-white"
                >
                  <div className="mb-3">
                    <h3 className="font-mono text-sm font-medium text-gray-900 mb-2">{tool.id}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      {tool.modelType && (() => {
                        const styles = getModelTypeStyles(tool.modelType);
                        return styles ? (
                          <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-[3.75px] border ${styles.bg} ${styles.text} ${styles.border}`}>
                            {tool.modelType}
                          </span>
                        ) : null;
                      })()}
                      <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                        {tool.category}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                  <p className="text-xs text-gray-500">
                    Models: {tool.modelSupport}
                  </p>
                </div>
              ))}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-600">No tools found matching your search.</p>
              </div>
            )}

            {/* Footer Links */}
            <div className="pt-12 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <a
                  href="https://fal.ai/dashboard/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Get API Key
                </a>
                <a
                  href="https://github.com/fal-ai/fal-mcp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LenisProvider>
  );
}