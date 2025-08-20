"use client";

import { Button } from "@/components/ui/button";
import { FloatingHeader } from "@/components/floating-header";
import Link from "next/link";
import { useState } from "react";
import { Copy, Check, ChevronRight, Sparkles, Zap, Wand2 } from "lucide-react";
import { LenisProvider } from "@/components/lenis-provider";
import { FalLogo } from "@fal-mcp/ascii";

export default function Home() {
  const [copiedClient, setCopiedClient] = useState<string | null>(null);

  const copyToClipboard = (text: string, client: string) => {
    navigator.clipboard.writeText(text);
    setCopiedClient(client);
    setTimeout(() => setCopiedClient(null), 2000);
  };

  const integrations = [
    {
      name: "NPM Package",
      description: "Install globally via npm",
      command: "npm install -g @fal-ai/mcp",
    },
    {
      name: "Direct Integration",
      description: "Use directly in your MCP client",
      command: "npx -y @fal-ai/mcp",
    },
  ];

  const config = `{
  "mcpServers": {
    "fal-mcp": {
      "command": "npx",
      "args": ["-y", "@fal-ai/mcp"],
      "env": {
        "FAL_API_KEY": "your-api-key-here"
      }
    }
  }
}`;

  const capabilities = [
    {
      icon: <Wand2 className="h-5 w-5" />,
      title: "Image Generation",
      description: "Create stunning images from text descriptions using any fal.ai model",
      tools: ["text-to-image", "image-to-image", "upscale", "background-removal"],
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Video & Audio",
      description: "Generate videos, transcribe speech, and synthesize natural voices",
      tools: ["text-to-video", "image-to-video", "text-to-speech", "speech-to-text"],
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Smart Workflows",
      description: "Chain multiple operations and discover the best models for your use case",
      tools: ["workflow-chain", "recommend-model", "enhance-prompt", "model-docs"],
    },
  ];

  return (
    <LenisProvider>
      <div className="min-h-screen bg-white">
        <FloatingHeader />
        
        {/* Hero Section - account for header height and margin */}
        <section className="relative pt-40 pb-24 px-8 md:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-8">
                <FalLogo className="text-xs md:text-sm text-gray-900" />
              </div>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Connect any MCP client to fal's lightning-fast generative models.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button size="lg" asChild className="rounded-[3.75px]">
                  <a
                    href="https://fal.ai/dashboard/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Started
                  </a>
                </Button>
                <Button variant="secondary" size="lg" asChild className="rounded-[3.75px]">
                  <Link href="/docs">
                    Documentation
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Setup - no bg-gray-50, straight to content */}
        <section className="py-24 px-8 md:px-12">
          <div className="max-w-3xl mx-auto">
            
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-2 text-gray-900">Get your API key</h3>
                    <p className="text-gray-600 mb-3">
                      Create a free account and generate your API key.
                    </p>
                    <a
                      href="https://fal.ai/dashboard/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-gray-700 hover:text-gray-900 transition-colors duration-150"
                    >
                      Get API key <ChevronRight className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-2 text-gray-900">Configure MCP</h3>
                    <p className="text-gray-600 mb-4">
                      Add to your MCP client configuration:
                    </p>
                    
                    <div className="relative mb-6">
                      <pre className="bg-gray-100 p-4 rounded-[0.25rem] overflow-x-auto text-xs text-gray-800">
                        <code>{config}</code>
                      </pre>
                      <button
                        onClick={() => copyToClipboard(config, 'config')}
                        className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-gray-700 transition-colors duration-150"
                      >
                        {copiedClient === 'config' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <div className="space-y-3">
                      {integrations.map((integration) => (
                        <div key={integration.name} className="pl-4 border-l-2 border-gray-200">
                          <p className="font-medium text-gray-900">{integration.name}</p>
                          <p className="text-sm text-gray-600">{integration.description}</p>
                          <code className="text-xs text-gray-500 font-mono">{integration.command}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-2 text-gray-900">Start generating</h3>
                    <p className="text-gray-600 mb-4">
                      You're ready to use fal's 600+ models:
                    </p>
                    <div className="bg-gray-100 p-4 rounded-[0.25rem]">
                      <p className="text-sm font-mono text-gray-800">
                        "Generate an image with FLUX.1 [schnell]"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-8 md:px-12 bg-gray-900 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-light mb-6">
              The fastest inference platform on the planet
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Access 600+ generative models through a single MCP interface.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/docs/tools">
                  Explore Tools
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <a
                  href="https://github.com/fal-ai/fal-mcp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[rgb(153,236,255)] text-[rgb(22,22,24)] py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              {/* Learn More */}
              <div>
                <h4 className="font-semibold mb-4">Learn More</h4>
                <div className="space-y-3">
                  <a href="https://status.fal.ai" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">Status</a>
                  <a href="https://docs.fal.ai" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">Documentation</a>
                  <a href="https://fal.ai/pricing" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">Pricing</a>
                  <a href="https://fal.ai/enterprise" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">Enterprise</a>
                  <a href="https://fal.ai/grants" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">Grants</a>
                  <a href="https://fal.ai/about" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">About Us</a>
                  <a href="https://fal.ai/careers" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">Careers</a>
                  <a href="https://blog.fal.ai" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">Blog</a>
                  <a href="mailto:support@fal.ai" className="block text-sm hover:underline">Get in touch</a>
                </div>
              </div>

              {/* Models */}
              <div>
                <h4 className="font-semibold mb-4">Models</h4>
                <div className="space-y-3">
                  <a href="https://fal.ai/models/fal-ai/aura-flow" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">AuraFlow</a>
                  <a href="https://fal.ai/models/fal-ai/flux/schnell" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">Flux.1 [schnell]</a>
                  <a href="https://fal.ai/models/fal-ai/flux/dev" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">Flux.1 [dev]</a>
                  <a href="https://fal.ai/models/fal-ai/flux-realism" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">Flux Realism LoRA</a>
                  <a href="https://fal.ai/models/fal-ai/flux-lora" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">Flux LoRA</a>
                  <a href="https://fal.ai/models" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">Explore More</a>
                </div>
              </div>

              {/* Playgrounds */}
              <div>
                <h4 className="font-semibold mb-4">Playgrounds</h4>
                <div className="space-y-3">
                  <a href="https://fal.ai/models/fal-ai/flux-lora-fast-training" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">Training</a>
                  <a href="https://fal.ai/workflows" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">Workflows</a>
                  <a href="https://fal.ai/demos" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">Demos</a>
                </div>
              </div>

              {/* Socials */}
              <div>
                <h4 className="font-semibold mb-4">Socials</h4>
                <div className="space-y-3">
                  <a href="https://discord.gg/fal-ai" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">Discord</a>
                  <a href="https://github.com/fal-ai" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">GitHub</a>
                  <a href="https://twitter.com/fal" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">Twitter</a>
                  <a href="https://www.linkedin.com/company/features-and-labels/" target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">Linkedin</a>
                </div>
              </div>
            </div>

            {/* Bottom section */}
            <div className="pt-8 border-t border-[rgba(22,22,24,0.1)]">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm">features and labels, 2025. All Rights Reserved.</p>
                <div className="flex gap-4">
                  <a href="https://fal.ai/terms.html" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">Terms of Service</a>
                  <span className="text-sm">and</span>
                  <a href="https://fal.ai/privacy.html" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">Privacy Policy</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </LenisProvider>
  );
}