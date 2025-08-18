"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FloatingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div
        className={cn(
          "mx-4 md:mx-auto max-w-7xl mt-4 px-6 py-4 rounded-sm transition-all duration-300",
          scrolled
            ? "bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm"
            : "bg-transparent border border-transparent"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <Logo className="h-5 w-auto text-gray-900" />
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/docs"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Docs
              </Link>
              <Link
                href="/docs/tools"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Tools
              </Link>
              <a
                href="https://github.com/fal-ai/fal-mcp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                GitHub
              </a>
            </nav>
          </div>
          
          <Button variant="default" size="sm" asChild className="rounded-sm">
            <a
              href="https://fal.ai/dashboard/keys"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get API Key
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}