"use client";

import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import Link from "next/link";
import { useState } from "react";

const tools = [
  // Image Tools
  {
    id: "textToImage",
    name: "Text to Image",
    category: "Image Generation",
    description: "Generate images from text descriptions using any fal.ai model",
    examples: ["Create a sunset landscape", "Generate pixel art character", "Design a logo"],
  },
  {
    id: "imageToImage",
    name: "Image to Image",
    category: "Image Processing",
    description: "Transform images using AI-powered style transfer and editing",
    examples: ["Apply artistic styles", "Change image mood", "Transform photos"],
  },
  {
    id: "backgroundRemoval",
    name: "Background Removal",
    category: "Image Processing",
    description: "Remove backgrounds from images with precision",
    examples: ["Product photos", "Profile pictures", "Object isolation"],
  },
  {
    id: "objectRemoval",
    name: "Object Removal",
    category: "Image Processing",
    description: "AI-powered inpainting to remove unwanted objects",
    examples: ["Remove people", "Clean up photos", "Erase watermarks"],
  },
  {
    id: "upscaleImage",
    name: "Image Upscaling",
    category: "Image Processing",
    description: "Enhance image resolution with AI super-resolution",
    examples: ["4x upscaling", "Restore old photos", "Improve quality"],
  },
  {
    id: "batchBackgroundRemoval",
    name: "Batch Background Removal",
    category: "Image Processing",
    description: "Remove backgrounds from multiple images at once",
    examples: ["Process folders", "Bulk editing", "Automated workflows"],
  },
  {
    id: "batchProcessImages",
    name: "Batch Process Images",
    category: "Image Processing",
    description: "Apply transformations to entire directories",
    examples: ["Style all photos", "Bulk conversions", "Consistent edits"],
  },
  {
    id: "imageToJson",
    name: "Image to JSON",
    category: "Image Analysis",
    description: "Extract structured data from images using vision models",
    examples: ["OCR text extraction", "Object detection", "Scene analysis"],
  },
  {
    id: "saveImage",
    name: "Save Image",
    category: "Utilities",
    description: "Download and save images from URLs",
    examples: ["Save results", "Archive outputs", "Local storage"],
  },
  
  // Video Tools
  {
    id: "textToVideo",
    name: "Text to Video",
    category: "Video Generation",
    description: "Generate videos from text descriptions",
    examples: ["Create animations", "Generate scenes", "Motion graphics"],
  },
  {
    id: "imageToVideo",
    name: "Image to Video",
    category: "Video Generation",
    description: "Animate static images into dynamic videos",
    examples: ["Add motion", "Create cinemagraphs", "Animate photos"],
  },
  
  // Audio Tools
  {
    id: "textToSpeech",
    name: "Text to Speech",
    category: "Audio Generation",
    description: "Natural voice synthesis in multiple languages",
    examples: ["Narration", "Voice overs", "Audio content"],
  },
  {
    id: "speechToText",
    name: "Speech to Text",
    category: "Audio Processing",
    description: "Transcribe audio to text in 100+ languages",
    examples: ["Transcription", "Subtitles", "Meeting notes"],
  },
  {
    id: "textToAudio",
    name: "Text to Audio",
    category: "Audio Generation",
    description: "Generate music and sound effects from descriptions",
    examples: ["Background music", "Sound effects", "Audio logos"],
  },
  {
    id: "audioToAudio",
    name: "Audio to Audio",
    category: "Audio Processing",
    description: "Transform and edit audio files with AI",
    examples: ["Voice changing", "Audio cleanup", "Effects"],
  },
  
  // Discovery & Utility Tools
  {
    id: "discoverModelsDynamic",
    name: "Discover Models",
    category: "Discovery",
    description: "Explore available fal.ai models dynamically",
    examples: ["Find models", "Check availability", "Model info"],
  },
  {
    id: "listModelsDynamic",
    name: "List Models",
    category: "Discovery",
    description: "Get categorized lists of available models",
    examples: ["Browse models", "Filter by type", "Model catalog"],
  },
  {
    id: "recommendModel",
    name: "Recommend Model",
    category: "Discovery",
    description: "Get AI recommendations for your use case",
    examples: ["Best model for task", "Model suggestions", "Optimization tips"],
  },
  {
    id: "modelDocs",
    name: "Model Documentation",
    category: "Discovery",
    description: "Get detailed documentation for specific models",
    examples: ["Parameter info", "Usage examples", "Best practices"],
  },
  
  // Workflow Tools
  {
    id: "workflowChain",
    name: "Workflow Chain",
    category: "Workflows",
    description: "Chain multiple operations into complex pipelines",
    examples: ["Multi-step edits", "Complex workflows", "Automation"],
  },
  {
    id: "enhancePrompt",
    name: "Enhance Prompt",
    category: "Utilities",
    description: "Optimize prompts for better model results",
    examples: ["Improve quality", "Better prompts", "XML formatting"],
  },
  {
    id: "courseModels",
    name: "Course Models",
    category: "Learning",
    description: "Interactive guided tour of fal.ai capabilities",
    examples: ["Learn models", "Tutorials", "Best practices"],
  },
  {
    id: "getSystemInstructions",
    name: "System Instructions",
    category: "Utilities",
    description: "Get comprehensive tool documentation",
    examples: ["Tool reference", "API docs", "Usage guide"],
  },
  
  // File Management
  {
    id: "uploadFile",
    name: "Upload File",
    category: "File Management",
    description: "Upload local files to fal.ai storage",
    examples: ["Upload images", "Store files", "Prepare inputs"],
  },
  {
    id: "downloadFile",
    name: "Download File",
    category: "File Management",
    description: "Download files from URLs to local storage",
    examples: ["Save outputs", "Archive results", "Local copies"],
  },
  
  // Specialized Tools
  {
    id: "textToImageStyled",
    name: "Text to Image (Styled)",
    category: "Image Generation",
    description: "Generate images with style exploration features",
    examples: ["Art styles", "Creative modes", "Style mixing"],
  },
  {
    id: "jsonTools",
    name: "JSON Tools",
    category: "Utilities",
    description: "Utilities for working with JSON data",
    examples: ["Parse data", "Format output", "Data handling"],
  },
];

const categories = [...new Set(tools.map(t => t.category))].sort();

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = tools.filter(tool => {
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.examples.some(ex => ex.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold">fal-mcp</span>
            </Link>
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="text-foreground/60 hover:text-foreground transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                href="/docs"
                className="text-foreground/60 hover:text-foreground transition-colors font-medium"
              >
                Documentation
              </Link>
              <a
                href="https://github.com/fal-ai/fal-mcp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-foreground transition-colors font-medium"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h1 className="text-display mb-6">
              <span className="gradient-text">27 Powerful Tools</span>
            </h1>
            <p className="text-xl text-foreground/60 mb-8 max-w-3xl">
              Every tool supports dynamic model discovery. Use any fal.ai model without limitations - 
              the tools learn and adapt to new models automatically.
            </p>
          </FadeIn>

          {/* Search and Filters */}
          <FadeIn delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Tools
                </Button>
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool, index) => (
              <FadeIn key={tool.id} delay={index * 0.05}>
                <div className="bg-background border border-border rounded-lg p-6 h-full hover:border-foreground/20 transition-all hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-heading">{tool.name}</h3>
                    <span className="text-xs px-2 py-1 bg-secondary rounded-full text-foreground/60">
                      {tool.category}
                    </span>
                  </div>
                  <p className="text-foreground/60 mb-4">{tool.description}</p>
                  <div className="space-y-1">
                    <p className="text-caption font-medium">Examples:</p>
                    <ul className="text-caption space-y-1">
                      {tool.examples.map((example, i) => (
                        <li key={i}>• {example}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <code className="text-mono bg-muted px-2 py-1 rounded">{tool.id}</code>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground/60">No tools found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* API Reference */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-title mb-8">Using the Tools</h2>
            
            <div className="bg-background border border-border rounded-lg p-6 mb-8">
              <h3 className="text-heading mb-4">Discovery Pattern</h3>
              <p className="text-foreground/60 mb-4">
                All tools follow a discovery-based approach. Instead of hardcoding parameters, 
                tools accept any parameters and let the fal.ai API guide you through error messages.
              </p>
              <pre className="bg-muted rounded p-4 overflow-x-auto">
                <code className="text-sm">{`// Example: Text to Image
{
  "prompt": "A beautiful sunset",
  "model": "fal-ai/flux/dev",  // Try any model!
  "parameters": {
    // Model will tell you what it needs
    "image_size": "1024x1024",
    "num_inference_steps": 50
  }
}`}</code>
              </pre>
            </div>

            <div className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-heading mb-4">Common Patterns</h3>
              <ul className="space-y-3 text-foreground/60">
                <li>
                  <strong className="text-foreground">Start Simple:</strong> Begin with just the required parameters
                </li>
                <li>
                  <strong className="text-foreground">Learn from Errors:</strong> Error messages reveal correct parameter names
                </li>
                <li>
                  <strong className="text-foreground">Any Model Works:</strong> Use any fal-ai/* model ID
                </li>
                <li>
                  <strong className="text-foreground">Document Discoveries:</strong> Share what you learn
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-caption">
              © 2024 fal.ai · Lightning-fast generative AI
            </div>
            <div className="flex items-center gap-6">
              <a
                href="https://fal.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-caption hover:text-foreground transition-colors"
              >
                fal.ai
              </a>
              <a
                href="https://github.com/fal-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-caption hover:text-foreground transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://discord.gg/fal-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-caption hover:text-foreground transition-colors"
              >
                Discord
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}