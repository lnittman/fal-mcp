"use client";

import { Button } from "@/components/ui/button";
import { FloatingHeader } from "@/components/floating-header";
import Link from "next/link";
import { useState } from "react";
import { Copy, Check, ChevronRight, Sparkles, Zap, Wand2 } from "lucide-react";
import { FalLogoAnimated } from "@fal-mcp/ascii";
import { DecorativeElements, QuickStartDecorative } from "@/components/decorative-elements";
import { CTADecorative } from "@/components/cta-decorative";

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
    <div className="min-h-screen bg-white">
        <FloatingHeader />

        {/* Hero Section - account for header height and margin */}
        <section className="relative pt-40 pb-24 px-6 md:px-8 overflow-hidden">
          <DecorativeElements />
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center">
              <div className="flex justify-center mb-12">
                <FalLogoAnimated className="text-[0.5rem] md:text-xs" />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 px-6 sm:px-0">
                <Button size="default" asChild className="rounded-[3.75px] w-full sm:w-auto">
                  <a
                    href="https://fal.ai/dashboard/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Started
                  </a>
                </Button>
                <Button variant="secondary" size="default" asChild className="rounded-[3.75px] w-full sm:w-auto">
                  <Link href="/docs">
                    Documentation
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Setup with purple background */}
        <section className="relative py-24 px-6 md:px-8 bg-[#EFEEFC] overflow-hidden">
          <QuickStartDecorative />
          <div className="max-w-3xl mx-auto relative z-10">

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
                      className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-gray-700 transition-interactive hover:transition-interactive-out"
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
        <section className="relative py-24 px-6 md:px-8 text-white overflow-hidden">
          <CTADecorative />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-3xl font-heading font-light mb-6">
              The fastest inference platform on the planet
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Access 600+ generative models through a single MCP interface.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 px-6 sm:px-4">
              <Button size="default" variant="secondary" asChild className="w-full sm:w-auto">
                <Link href="/docs/tools">
                  Explore Tools
                </Link>
              </Button>
              <Button size="default" variant="secondary" asChild className="w-full sm:w-auto">
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

    </div>
  );
}
