"use client";

import { Button } from "@/components/ui/button";
import { TextScramble } from "@/components/motion/text-scramble";
import { FadeIn } from "@/components/motion/fade-in";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
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
                href="/docs"
                className="text-foreground/60 hover:text-foreground transition-colors font-medium"
              >
                Documentation
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
      <section className="relative flex items-center justify-center px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn delay={0.1}>
            <h1 className="text-display mb-6">
              <span className="block">Natural language meets</span>
              <span className="gradient-text">lightning-fast AI</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-xl text-foreground/60 mb-10 max-w-2xl mx-auto">
              Transform ideas into images, videos, and audio through simple conversation. 
              Powered by fal.ai&apos;s blazing-fast infrastructure.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-base" asChild>
                <Link href="/docs">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base" asChild>
                <a
                  href="https://github.com/fal-ai/fal-mcp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </a>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <h2 className="text-title text-center mb-16">
              AI capabilities through conversation
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn delay={0.1}>
              <div className="bg-background border border-border rounded-lg p-8 hover:border-foreground/20 transition-all hover:shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-fal-green to-fal-teal rounded-lg mb-6" />
                <h3 className="text-heading mb-3">Image Generation</h3>
                <p className="text-foreground/60 leading-relaxed">
                  Create stunning visuals from text descriptions using state-of-the-art models
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-background border border-border rounded-lg p-8 hover:border-foreground/20 transition-all hover:shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-fal-teal to-fal-purple rounded-lg mb-6" />
                <h3 className="text-heading mb-3">Video Creation</h3>
                <p className="text-foreground/60 leading-relaxed">
                  Generate and transform videos with cutting-edge AI models
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="bg-background border border-border rounded-lg p-8 hover:border-foreground/20 transition-all hover:shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-fal-purple to-fal-green rounded-lg mb-6" />
                <h3 className="text-heading mb-3">Audio Processing</h3>
                <p className="text-foreground/60 leading-relaxed">
                  Speech synthesis, transcription, and music generation at your fingertips
                </p>
              </div>
            </FadeIn>
          </div>
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