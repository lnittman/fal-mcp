"use client";

import { Button } from "@/components/ui/button";
import { NavigationHeader } from "@/components/navigation/header";
import { FadeIn } from "@/components/motion/fade-in";
import Link from "next/link";
import { useState } from "react";

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

  return (
    <main className="min-h-screen bg-background">
      <NavigationHeader />

      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <FadeIn>
          <h1 className="text-5xl font-heading font-bold tracking-tight mb-8">
            Documentation
          </h1>
        </FadeIn>

        {/* Quick Start */}
        <FadeIn delay={0.1}>
          <section className="mb-16">
            <h2 className="text-3xl font-heading font-semibold mb-8">Quick Start</h2>
            
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-lg mb-2">Get your API key</h3>
                  <p className="text-muted-foreground mb-3">
                    Sign up at fal.ai and create an API key from your dashboard.
                  </p>
                  <a
                    href="https://fal.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    Go to fal.ai →
                  </a>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-lg mb-2">Choose your client</h3>
                  <p className="text-muted-foreground mb-6">
                    Select your preferred AI assistant or development environment.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Claude Desktop */}
                    <div className="border border-border rounded-lg p-5 bg-card">
                      <h4 className="font-heading font-semibold mb-2">Claude Desktop</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Settings → Developer → Edit Config
                      </p>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => copyToClipboard(claudeConfig, 'claude')}
                        className="w-full"
                      >
                        {copiedSection === 'claude' ? 'Copied!' : 'Copy Config'}
                      </Button>
                    </div>

                    {/* Cursor */}
                    <div className="border border-border rounded-lg p-5 bg-card">
                      <h4 className="font-heading font-semibold mb-2">Cursor IDE</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add to ~/.cursor/mcp.json
                      </p>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => copyToClipboard(cursorConfig, 'cursor')}
                        className="w-full"
                      >
                        {copiedSection === 'cursor' ? 'Copied!' : 'Copy Config'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-lg mb-2">Start creating</h3>
                  <p className="text-muted-foreground mb-3">
                    That's it! Your AI assistant now has access to fal.ai's models. Try asking:
                  </p>
                  <div className="p-4 bg-muted rounded-lg border border-border">
                    <p className="text-sm font-mono">
                      "Generate an image of a futuristic city at sunset"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Available Tools */}
        <FadeIn delay={0.2}>
          <section className="mb-16">
            <h2 className="text-3xl font-heading font-semibold mb-8">Available Tools</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              fal-mcp provides 27 tools for creative AI generation. Each tool supports dynamic model discovery,
              allowing you to use any fal.ai model without limitations.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {toolCategories.map((category) => (
                <div key={category.title} className="border border-border rounded-lg p-5 bg-card">
                  <h3 className="font-heading font-semibold mb-3">{category.title}</h3>
                  <ul className="space-y-2">
                    {category.tools.map((tool) => (
                      <li key={tool} className="text-sm text-muted-foreground">
                        • {tool}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link href="/docs/tools">
                <Button variant="outline">
                  View All Tools →
                </Button>
              </Link>
            </div>
          </section>
        </FadeIn>

        {/* Example Usage */}
        <FadeIn delay={0.3}>
          <section>
            <h2 className="text-3xl font-heading font-semibold mb-8">Example Usage</h2>
            <div className="space-y-4">
              <div className="p-5 bg-muted rounded-lg border border-border">
                <p className="font-mono text-sm mb-2">
                  <span className="text-muted-foreground">You:</span> Generate a pixel art cat
                </p>
                <p className="font-mono text-sm">
                  <span className="text-muted-foreground">Assistant:</span> I'll create a pixel art cat for you...
                </p>
              </div>
              
              <div className="p-5 bg-muted rounded-lg border border-border">
                <p className="font-mono text-sm mb-2">
                  <span className="text-muted-foreground">You:</span> Now animate it with a wagging tail
                </p>
                <p className="font-mono text-sm">
                  <span className="text-muted-foreground">Assistant:</span> I'll animate your pixel art cat...
                </p>
              </div>
            </div>
          </section>
        </FadeIn>
      </div>
    </main>
  );
}

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