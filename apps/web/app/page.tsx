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

  const clients = [
    {
      name: "Claude Desktop",
      description: "Anthropic's desktop app",
      configPath: "~/Library/Application Support/Claude/claude_desktop_config.json",
    },
    {
      name: "Cursor",
      description: "AI-first code editor",
      configPath: "~/.cursor/mcp.json",
    },
    {
      name: "Windsurf",
      description: "The IDE for the AI era",
      configPath: "~/.windsurf/mcp.json",
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
        <section className="relative pt-40 pb-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-8">
                <FalLogo className="text-6xl md:text-7xl text-gray-900" interval={200} />
              </div>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Connect any MCP client to fal's lightning-fast generative models.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button size="lg" asChild className="rounded-sm">
                  <a
                    href="https://fal.ai/dashboard/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Started
                  </a>
                </Button>
                <Button variant="secondary" size="lg" asChild className="rounded-sm">
                  <Link href="/docs">
                    Documentation
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Setup - no bg-gray-50, straight to content */}
        <section className="py-24 px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-heading font-light text-center mb-16 text-gray-900">
              Get started in 3 minutes
            </h2>
            
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
                      Sign up at fal.ai and create an API key from your dashboard.
                    </p>
                    <a
                      href="https://fal.ai/dashboard/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-gray-700 hover:text-gray-900 transition-colors"
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
                    <h3 className="text-lg font-medium mb-2 text-gray-900">Add to your MCP client</h3>
                    <p className="text-gray-600 mb-4">
                      Add this configuration to your client:
                    </p>
                    
                    <div className="relative mb-6">
                      <pre className="bg-gray-100 p-4 rounded-sm overflow-x-auto text-xs text-gray-800">
                        <code>{config}</code>
                      </pre>
                      <button
                        onClick={() => copyToClipboard(config, 'config')}
                        className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {copiedClient === 'config' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <div className="space-y-3">
                      {clients.map((client) => (
                        <div key={client.name} className="pl-4 border-l-2 border-gray-200">
                          <p className="font-medium text-gray-900">{client.name}</p>
                          <p className="text-sm text-gray-600">{client.description}</p>
                          <code className="text-xs text-gray-500 font-mono">{client.configPath}</code>
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
                    <h3 className="text-lg font-medium mb-2 text-gray-900">Start creating</h3>
                    <p className="text-gray-600 mb-4">
                      Restart your client and try:
                    </p>
                    <div className="bg-gray-100 p-4 rounded-sm">
                      <p className="text-sm font-mono text-gray-800">
                        "Generate an image of a cyberpunk city at night"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 bg-gray-900 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-light mb-6">
              Ready to build something amazing?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join thousands of developers using fal.ai to create incredible AI experiences.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" variant="secondary" asChild className="rounded-sm">
                <Link href="/docs/tools">
                  Explore 27 Tools
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild className="rounded-sm">
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
        <footer className="py-12 px-6 border-t border-gray-200">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <a
                  href="https://fal.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 transition-colors"
                >
                  fal.ai
                </a>
                <a
                  href="https://github.com/fal-ai/fal-mcp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://discord.gg/fal-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 transition-colors"
                >
                  Discord
                </a>
              </div>
              <p className="text-sm text-gray-600">
                Built with ❤️ by fal.ai
              </p>
            </div>
          </div>
        </footer>
      </div>
    </LenisProvider>
  );
}