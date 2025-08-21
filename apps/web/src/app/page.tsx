"use client";

import { Button } from "@/components/ui/button";
import { FloatingHeader } from "@/components/floating-header";
import Link from "next/link";
import { useState } from "react";
import { Copy, Check, ChevronRight, Sparkles, Zap, Wand2 } from "lucide-react";
import { LenisProvider } from "@/components/lenis-provider";
import { FalLogoAnimated } from "@fal-mcp/ascii";

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
                <FalLogoAnimated className="text-xs md:text-sm" />
              </div>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Connect any MCP client to lightning-fast generative models.
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
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2 text-gray-900">
                    1. Get your API key
                  </h3>
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

              {/* Step 2 */}
              <div className="relative">
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2 text-gray-900">
                    2. Configure MCP
                  </h3>
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

              {/* Step 3 */}
              <div className="relative">
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2 text-gray-900">
                    3. Start generating
                  </h3>
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
            <div className="flex items-center justify-center gap-4 px-4">
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
            <div className="pt-8 border-t border-[rgba(22,22,24,0.1)] relative">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <p className="text-sm">features and labels, 2025. All Rights Reserved.</p>
                  <div className="flex gap-1 text-sm mt-1">
                    <a href="https://fal.ai/terms.html" target="_blank" rel="noopener noreferrer" className="hover:underline">Terms of Service</a>
                    <span>and</span>
                    <a href="https://fal.ai/privacy.html" target="_blank" rel="noopener noreferrer" className="hover:underline">Privacy Policy</a>
                  </div>
                </div>
                
                {/* Large fal logo on the right */}
                <svg viewBox="0 0 120 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-20 md:h-28 lg:h-40 w-auto opacity-30 self-end fill-current md:absolute md:right-0 md:bottom-0">
                  <path d="M120 6.46345V41.6633C120 47.2476 119.937 47.4986 119.248 47.4986H110.724C110.034 47.4986 109.909 47.2476 109.909 41.6633V6.46345C109.909 0.879154 110.034 0.628174 110.724 0.628174H119.248C119.937 0.628174 120 0.879154 120 6.46345Z"/>
                  <path d="M96.0997 27.0431V25.7255C96.0997 22.5882 94.6581 21.3333 92.1509 21.3333C89.7065 21.3333 88.3902 22.651 88.0142 24.9725C87.8888 25.6627 87.9515 26.2274 87.5754 26.2274H79.1138C78.6124 26.2274 78.6124 26.1019 78.6124 25.6627C78.6124 22.3372 81.7463 15.4353 92.6524 15.4353C100.362 15.4353 105.878 18.5098 105.878 27.0431V39.5921C105.878 42.4783 107.445 46.5568 107.445 47.1215C107.445 47.3724 107.257 47.4979 107.068 47.4979H97.6667C97.2279 47.4979 97.1652 47.247 96.8518 45.6783L96.6011 44.4862C96.4131 43.545 96.2877 43.2313 95.9117 43.2313C95.4102 43.2313 95.0968 44.3607 93.7179 45.6783C92.2136 47.0587 90.3959 47.9999 87.262 47.9999C82.185 47.9999 77.6095 45.1136 77.6095 38.8391C77.6095 31.8117 83.0625 28.8 91.1481 28.4862C95.3476 28.298 96.0997 28.7372 96.0997 27.0431ZM96.0997 36.1411V34.8862C96.0997 33.6313 95.7863 33.2548 94.7208 33.3176L92.4017 33.4431C89.4558 33.6313 87.7008 35.1372 87.7008 37.9607C87.7008 40.7215 89.205 42.1019 91.3988 42.1019C93.8433 42.1019 96.0997 39.8431 96.0997 36.1411Z"/>
                  <path d="M60.5509 23.6548C60.5509 22.4627 60.0495 22.3372 57.7304 22.3372H56.6021C56.1634 22.3372 56.1007 22.0234 56.1007 19.4509V19.0117C56.1007 16.4392 56.1634 16.1882 56.6021 16.1882H57.9184C60.2375 16.1882 60.5509 15.9999 60.5509 14.8705V10.9804C60.5509 3.6392 64.2489 0 71.3943 0C74.2148 0 76.1579 0.439212 76.4713 0.627448C76.5966 0.752936 76.5966 0.941172 76.5966 3.26273V4.07842C76.5966 6.46272 76.5966 7.02742 76.4086 7.02742C76.2206 7.02742 75.3431 6.46272 73.8388 6.46272C71.8331 6.46272 70.5795 7.46664 70.5795 10.9804V14.8705C70.5795 15.9999 71.0182 16.1882 73.8388 16.1882H76.6593C77.2234 16.1882 77.2234 16.4392 77.2234 19.0117V19.4509C77.2234 22.0234 77.1607 22.3372 76.722 22.3372H73.8388C71.0182 22.3372 70.5795 22.4627 70.5795 23.6548V41.6626C70.5795 47.2469 70.3914 47.4979 69.89 47.4979H61.1777C60.6762 47.4979 60.5509 47.2469 60.5509 41.6626V23.6548Z"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M30.1574 0.740479C30.9676 0.740479 31.6169 1.39923 31.6944 2.20567C32.3853 9.39891 38.1102 15.1234 45.3039 15.8142C46.1104 15.8917 46.7692 16.541 46.7692 17.3511V30.8959C46.7692 31.706 46.1104 32.3553 45.3039 32.4328C38.1102 33.1236 32.3853 38.8481 31.6944 46.0414C31.6169 46.8478 30.9676 47.5065 30.1574 47.5065H16.6118C15.8016 47.5065 15.1523 46.8478 15.0748 46.0414C14.384 38.8481 8.65901 33.1236 1.46528 32.4328C0.658799 32.3553 0 31.706 0 30.8959V17.3511C0 16.541 0.658803 15.8917 1.46529 15.8142C8.65902 15.1234 14.384 9.39891 15.0748 2.20567C15.1523 1.39923 15.8016 0.740479 16.6118 0.740479H30.1574ZM9.39037 24.0839C9.39037 31.865 15.6915 38.1728 23.4644 38.1728C31.2373 38.1728 37.5385 31.865 37.5385 24.0839C37.5385 16.3028 31.2373 9.99498 23.4644 9.99498C15.6915 9.99498 9.39037 16.3028 9.39037 24.0839Z"/>
                </svg>
              </div>
            </div>
          </div>
        </footer>

        {/* Colored pixel bar decoration */}
        <div className="h-2 flex w-full">
          <div className="h-full w-[5%] bg-[#AB77FF]"></div>
          <div className="h-full w-[40%] bg-[#99EDFF]"></div>
          <div className="h-full w-[7%] bg-[#AB77FF]"></div>
          <div className="h-full w-[25%] bg-black"></div>
          <div className="h-full w-[10%] bg-[#ADFF00]"></div>
          <div className="h-full w-[13%] bg-[#99EDFF]"></div>
        </div>
      </div>
    </LenisProvider>
  );
}
