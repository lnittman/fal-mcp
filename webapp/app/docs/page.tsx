"use client";

import { Button } from "@/components/ui/button";
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

  const httpConfig = `{
  "mcpServers": {
    "fal-mcp": {
      "url": "https://your-mcp-server.vercel.app/api/mcp",
      "transport": {
        "type": "sse"
      },
      "env": {
        "FAL_API_KEY": "your-api-key-here"
      }
    }
  }
}`;

  const llmPrompt = `You have access to fal-mcp, a powerful MCP server that lets you generate images, videos, and audio using natural language. Here are some examples:

Image Generation:
- "Create a stunning landscape with mountains at sunset"
- "Generate a pixel art character in cyberpunk style"
- "Make a product photo of a sleek headphone on white background"

Video Creation:
- "Animate this image with gentle swaying motion"
- "Create a 5-second video of waves crashing on a beach"
- "Generate a timelapse of clouds moving across the sky"

Audio Generation:
- "Create upbeat electronic music for 30 seconds"
- "Generate a voiceover saying 'Welcome to the future'"
- "Transcribe this audio file to text"

Advanced Features:
- Remove backgrounds from images
- Upscale images to higher resolution
- Chain multiple operations together
- Process entire directories of images

The tools will guide you through any parameters needed. Just describe what you want naturally!`;

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
                href="/docs/tools"
                className="text-foreground/60 hover:text-foreground transition-colors font-medium"
              >
                Tools
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
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h1 className="text-display mb-6">
              <span className="gradient-text">AI-Native</span> Documentation
            </h1>
            <p className="text-xl text-foreground/60 mb-8">
              Get started with fal-mcp in seconds. Built for AI assistants and developers.
            </p>
          </FadeIn>

          {/* Quick Integration Buttons */}
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              <div className="bg-background border border-border rounded-lg p-6 hover:border-foreground/20 transition-all hover:shadow-lg">
                <h3 className="text-heading mb-4">Claude Desktop</h3>
                <p className="text-caption mb-4">Add to Settings → Developer → Edit Config</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => copyToClipboard(claudeConfig, 'claude')}
                >
                  {copiedSection === 'claude' ? 'Copied Config!' : 'Copy Claude Config'}
                </Button>
              </div>

              <div className="bg-background border border-border rounded-lg p-6 hover:border-foreground/20 transition-all hover:shadow-lg">
                <h3 className="text-heading mb-4">Cursor IDE</h3>
                <p className="text-caption mb-4">Add to ~/.cursor/mcp.json</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => copyToClipboard(cursorConfig, 'cursor')}
                >
                  {copiedSection === 'cursor' ? 'Copied Config!' : 'Copy Cursor Config'}
                </Button>
              </div>

              <div className="bg-background border border-border rounded-lg p-6 hover:border-foreground/20 transition-all hover:shadow-lg">
                <h3 className="text-heading mb-4">ChatGPT</h3>
                <p className="text-caption mb-4">Custom connectors coming soon!</p>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </div>

              <div className="bg-background border border-border rounded-lg p-6 hover:border-foreground/20 transition-all hover:shadow-lg">
                <h3 className="text-heading mb-4">VS Code</h3>
                <p className="text-caption mb-4">Extension marketplace</p>
                <Button variant="outline" className="w-full" asChild>
                  <a
                    href="https://marketplace.visualstudio.com/search?term=mcp&target=VSCode"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Browse Extensions
                  </a>
                </Button>
              </div>

              <div className="bg-background border border-border rounded-lg p-6 hover:border-foreground/20 transition-all hover:shadow-lg">
                <h3 className="text-heading mb-4">HTTP/SSE (Advanced)</h3>
                <p className="text-caption mb-4">Connect via HTTP endpoint</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => copyToClipboard(httpConfig, 'http')}
                >
                  {copiedSection === 'http' ? 'Copied Config!' : 'Copy HTTP Config'}
                </Button>
              </div>

              <div className="bg-background border border-border rounded-lg p-6 hover:border-foreground/20 transition-all hover:shadow-lg">
                <h3 className="text-heading mb-4">Other Clients</h3>
                <p className="text-caption mb-4">MCP-compatible AI tools</p>
                <Button variant="outline" className="w-full" asChild>
                  <a
                    href="https://modelcontextprotocol.io/clients"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Browse Clients
                  </a>
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-title mb-8">Quick Start</h2>
            
            <div className="bg-background border border-border rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-heading">1. Get your API key</h3>
              </div>
              <p className="text-foreground/60 mb-4">
                Sign up at <a href="https://fal.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">fal.ai</a> and grab your API key from the dashboard.
              </p>
            </div>

            <div className="bg-background border border-border rounded-lg p-6 mb-8">
              <h3 className="text-heading mb-4">2. Configure your AI assistant</h3>
              <p className="text-foreground/60 mb-4">
                Choose your platform above and copy the configuration. Add your API key from step 1.
              </p>
              <p className="text-caption mb-2">
                <strong>Claude Desktop:</strong> Settings → Developer → Edit Config<br />
                <strong>Cursor:</strong> Create ~/.cursor/mcp.json<br />
                <strong>VS Code:</strong> Install MCP extension first<br />
                <strong>HTTP/SSE:</strong> Use the live endpoint (no local install needed)
              </p>
              <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded text-sm">
                <p>💡 Pro tip: The HTTP/SSE config connects to our live MCP server - perfect for testing!</p>
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-heading mb-4">3. Start creating!</h3>
              <p className="text-foreground/60">
                That&apos;s it! Your AI assistant now has access to fal.ai&apos;s lightning-fast models. 
                Just ask naturally: &quot;Generate an image of a futuristic city&quot; or &quot;Create a video from this photo&quot;.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* LLM Prompt Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-title mb-8">Perfect Prompt for AI Assistants</h2>
            
            <div className="bg-background border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-foreground/60">Copy this prompt to give your AI assistant full context:</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(llmPrompt, 'prompt')}
                >
                  {copiedSection === 'prompt' ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <pre className="bg-muted rounded p-4 overflow-x-auto whitespace-pre-wrap">
                <code className="text-sm">{llmPrompt}</code>
              </pre>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-title mb-8">What You Can Build</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-background border border-border rounded-lg p-6">
                <h3 className="text-heading mb-3 gradient-text">Image Magic</h3>
                <ul className="space-y-2 text-foreground/60">
                  <li>• Text-to-image with any style</li>
                  <li>• Image transformations and edits</li>
                  <li>• Background removal</li>
                  <li>• Smart object removal</li>
                  <li>• Resolution upscaling</li>
                  <li>• Batch processing</li>
                </ul>
              </div>

              <div className="bg-background border border-border rounded-lg p-6">
                <h3 className="text-heading mb-3 gradient-text">Video Power</h3>
                <ul className="space-y-2 text-foreground/60">
                  <li>• Text-to-video generation</li>
                  <li>• Image animation</li>
                  <li>• Style transfer on videos</li>
                  <li>• Custom effects and filters</li>
                  <li>• Motion control</li>
                  <li>• Seamless loops</li>
                </ul>
              </div>

              <div className="bg-background border border-border rounded-lg p-6">
                <h3 className="text-heading mb-3 gradient-text">Audio Suite</h3>
                <ul className="space-y-2 text-foreground/60">
                  <li>• Text-to-speech synthesis</li>
                  <li>• Speech-to-text transcription</li>
                  <li>• Music generation</li>
                  <li>• Audio transformations</li>
                  <li>• 100+ language support</li>
                  <li>• Voice cloning</li>
                </ul>
              </div>

              <div className="bg-background border border-border rounded-lg p-6">
                <h3 className="text-heading mb-3 gradient-text">Advanced Workflows</h3>
                <ul className="space-y-2 text-foreground/60">
                  <li>• Multi-step pipelines</li>
                  <li>• Batch operations</li>
                  <li>• Model discovery</li>
                  <li>• Prompt optimization</li>
                  <li>• Custom parameters</li>
                  <li>• File management</li>
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Available Tools */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-title mb-4">27 Powerful Tools</h2>
            <p className="text-foreground/60 mb-8">
              All tools support dynamic model discovery - use any fal.ai model without limitations.
            </p>
            
            <div className="flex gap-4 mb-8">
              <Button asChild>
                <Link href="/docs/tools">Browse All Tools</Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://github.com/fal-ai/fal-mcp#tools" target="_blank" rel="noopener noreferrer">
                  API Reference
                </a>
              </Button>
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