import { FloatingHeader } from "@/components/floating-header";
import { ModelCard } from "@/components/model-card";
import { CategorySection } from "@/components/category-section";
import { SearchSuggestions } from "@/components/search-suggestions";
import { KontextGrid } from "@/components/kontext-grid";
import { ModelTypeBadge } from "@/components/model-type-badge";
import { NewBadge } from "@/components/new-badge";

export default function ModelsPage() {
  const marqueeVideoModels = [
    {
      title: "Veo 3 Fast",
      description: "Faster and more cost effective version of Google's Veo 3!",
      modelType: "text-to-video",
      href: "/models/veo3-fast",
      isNew: false
    },
    {
      title: "MiniMax Hailuo-02",
      description: "Advanced image-to-video generation with 768p and 512p resolutions",
      modelType: "image-to-video",
      href: "/models/minimax-hailuo",
      isNew: false
    },
    {
      title: "Wan-2.2 A14B",
      description: "High-quality videos with motion diversity from text prompts",
      modelType: "text-to-video",
      href: "/models/wan-22",
      isNew: true
    }
  ];

  const bestImageModels = [
    {
      title: "Imagen 4 Preview",
      description: "Google's highest quality image generation model",
      modelType: "text-to-image",
      href: "/models/imagen4",
      isNew: false
    },
    {
      title: "FLUX.1 Kontext [pro]",
      description: "Handles text and reference images for complex transformations",
      modelType: "image-to-image",
      href: "/models/flux-kontext",
      isNew: false
    },
    {
      title: "Recraft V3",
      description: "SOTA text-to-image with vector art and typography capabilities",
      modelType: "text-to-image",
      href: "/models/recraft-v3",
      isNew: true,
      tags: ["vector", "typography", "style"]
    }
  ];

  const kontextItems = [
    { title: "flux-kontext-lora/inpaint", href: "/models/flux-kontext-inpaint", modelType: "image-to-image" },
    { title: "flux-pro/kontext", href: "/models/flux-pro-kontext", modelType: "image-to-image" },
    { title: "flux-kontext-trainer", href: "/models/flux-kontext-trainer", modelType: "training" },
    { title: "flux-kontext-lora/text-to-image", href: "/models/flux-kontext-text", modelType: "text-to-image" },
    { title: "flux-kontext-lora", href: "/models/flux-kontext-lora", modelType: "image-to-image" },
    { title: "flux-pro/kontext/max", href: "/models/flux-pro-kontext-max", modelType: "image-to-image" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <FloatingHeader />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-heading font-medium mb-4">
              Explore AI Models
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover and integrate lightning-fast generative models through the fal-mcp interface.
            </p>
          </div>

          {/* Search Suggestions */}
          <SearchSuggestions className="mt-12" />
        </div>
      </section>

      {/* Model Type Badge Examples */}
      <section className="px-6 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Model Types</h3>
            <div className="flex flex-wrap gap-3">
              <ModelTypeBadge modelType="text-to-image" />
              <ModelTypeBadge modelType="image-to-video" />
              <ModelTypeBadge modelType="text-to-video" />
              <ModelTypeBadge modelType="audio-to-audio" />
              <ModelTypeBadge modelType="training" />
              <ModelTypeBadge modelType="video-to-video" />
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Video Models */}
      <section className="px-6 md:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <CategorySection 
            title="Marquee Video Models" 
            href="/explore/marquee-video-models"
          >
            {marqueeVideoModels.map((model, index) => (
              <div key={index} className="min-w-[320px]">
                <ModelCard {...model} variant="compact" />
              </div>
            ))}
          </CategorySection>
        </div>
      </section>

      {/* Best Image Models */}
      <section className="px-6 md:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <CategorySection 
            title="Best Image Models" 
            href="/explore/best-image-models"
          >
            {bestImageModels.map((model, index) => (
              <div key={index} className="min-w-[360px]">
                <ModelCard {...model} />
              </div>
            ))}
          </CategorySection>
        </div>
      </section>

      {/* Everything Kontext */}
      <section className="px-6 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <KontextGrid items={kontextItems} />
        </div>
      </section>

      {/* New Badge Demo */}
      <section className="px-6 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">New Badge Variants</h3>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-20 bg-gray-200 rounded-lg">
                <NewBadge />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Inline variant:</span>
                <NewBadge variant="inline" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}