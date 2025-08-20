"use client";

import { FloatingHeader } from "@/components/floating-header";
import Link from "next/link";
import { useState } from "react";
import { Copy, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LenisProvider } from "@/components/lenis-provider";
import { FalHeroAnimation } from "@fal-mcp/ascii";

export default function DocsPage() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const claudeConfig = `{
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

  const cursorConfig = `{
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

  const toolCategories = [
    {
      title: "Image Generation",
      tools: ["textToImage", "imageToImage", "upscaleImage", "backgroundRemoval"]
    },
    {
      title: "Video Creation",
      tools: ["textToVideo", "imageToVideo", "videoToVideo"]
    },
    {
      title: "Audio Processing",
      tools: ["textToSpeech", "speechToText", "textToAudio", "audioToAudio"]
    }
  ];

  return (
    <LenisProvider>
      <div className="min-h-screen bg-white">
        <FloatingHeader />

        {/* Main content - account for header height and margin */}
        <div className="pt-40 pb-24">
          <div className="max-w-6xl mx-auto px-8">
            <div className="relative mb-16">
              <FalHeroAnimation 
                width={100} 
                height={8} 
                frameCount={60} 
                fps={20}
                style="pulse"
                className="text-gray-300/15"
                containerClassName=""
              />
              <h1 className="relative text-4xl font-heading font-light text-gray-900">Quick Start</h1>
            </div>

            {/* Installation */}
            <section className="mb-20">
              <h2 className="text-2xl font-heading font-light text-gray-900 mb-8">Deploy in 3 minutes</h2>
              
              <div className="space-y-12">
                {/* Step 1 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">1. Get your API key</h3>
                  <p className="text-gray-600 mb-3">
                    Sign up free. Get $10 in credits. No GPU setup needed.
                  </p>
                  <a
                    href="https://fal.ai/dashboard/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-gray-700 hover:text-gray-900 [transition:color_0ms] hover:[transition:color_150ms]"
                  >
                    Get API key <ChevronRight className="ml-1 h-3 w-3" />
                  </a>
                </div>

                {/* Step 2 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">2. Configure your client</h3>
                  <p className="text-gray-600 mb-6">
                    One-click setup. Works with any MCP client.
                  </p>
                  
                  <div className="space-y-6">
                    {/* Claude Desktop */}
                    <div className="border border-gray-200 rounded-sm p-6">
                      <h4 className="font-medium text-gray-900 mb-2">Claude Desktop</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Add to: <code className="text-xs bg-gray-100 px-2 py-1 rounded-sm font-mono">~/Library/Application Support/Claude/claude_desktop_config.json</code>
                      </p>
                      <div className="relative">
                        <pre className="bg-gray-50 p-4 rounded-sm overflow-x-auto text-xs text-gray-800">
                          <code>{claudeConfig}</code>
                        </pre>
                        <button
                          onClick={() => copyToClipboard(claudeConfig, 'claude')}
                          className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-gray-700 [transition:color_0ms] hover:[transition:color_150ms]"
                        >
                          {copiedSection === 'claude' ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Cursor */}
                    <div className="border border-gray-200 rounded-sm p-6">
                      <h4 className="font-medium text-gray-900 mb-2">Cursor</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Add to: <code className="text-xs bg-gray-100 px-2 py-1 rounded-sm font-mono">~/.cursor/mcp.json</code>
                      </p>
                      <div className="relative">
                        <pre className="bg-gray-50 p-4 rounded-sm overflow-x-auto text-xs text-gray-800">
                          <code>{cursorConfig}</code>
                        </pre>
                        <button
                          onClick={() => copyToClipboard(cursorConfig, 'cursor')}
                          className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-gray-700 [transition:color_0ms] hover:[transition:color_150ms]"
                        >
                          {copiedSection === 'cursor' ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">3. Start building</h3>
                  <p className="text-gray-600 mb-3">
                    Natural language. Lightning-fast inference. Zero MLOps:
                  </p>
                  <div className="bg-gray-100 p-4 rounded-sm">
                    <p className="text-sm font-mono text-gray-800">
                      "Generate a product photo using FLUX Pro"
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Available Tools */}
            <section>
              <h2 className="text-2xl font-heading font-light text-gray-900 mb-8">600+ Models</h2>
              <p className="text-gray-600 mb-8">
                Production-ready. 10x faster inference. One API call away.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {toolCategories.map((category) => (
                  <div key={category.title} className="border border-gray-200 rounded-sm p-6 hover:border-gray-300 [transition:border-color_0ms] hover:[transition:border-color_150ms]">
                    <h3 className="font-medium text-gray-900 mb-3">{category.title}</h3>
                    <ul className="space-y-2">
                      {category.tools.map((tool) => (
                        <li key={tool} className="text-sm text-gray-600 font-mono">
                          {tool}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <Link href="/docs/tools">
                <Button variant="default" size="sm" className="rounded-sm">
                  Explore all models <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </section>
          </div>
        </div>
      </div>
    </LenisProvider>
  );
}