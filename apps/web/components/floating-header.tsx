"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

export function FloatingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/docs", label: "Docs" },
    { href: "/docs/tools", label: "Tools" },
    { href: "https://github.com/fal-ai/fal-mcp", label: "GitHub", external: true },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div
        className={cn(
          "mx-6 md:mx-auto max-w-7xl mt-4 px-4 py-3 rounded-[3.75px] transition-all duration-300",
          scrolled
            ? "bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm"
            : "bg-transparent border border-transparent"
        )}
      >
        <div className="flex items-center justify-between">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <Logo className="h-5 w-auto text-gray-900" />
            </Link>
            
            <nav className="flex items-center gap-6">
              {navLinks.map((link) => (
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-150"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </nav>
          </div>

          {/* Mobile Logo and Hamburger Menu */}
          <div className="flex md:hidden items-center justify-between w-full">
            <Link href="/" className="flex items-center">
              <Logo className="h-5 w-auto text-gray-900" />
            </Link>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] flex flex-col" showCloseButton={false}>
                <SheetHeader className="mb-8">
                  <SheetTitle className="flex justify-start">
                    <Logo className="h-6 w-auto text-gray-900" />
                  </SheetTitle>
                </SheetHeader>
                
                <nav className="flex-1 flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    link.external ? (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg text-gray-600 hover:text-gray-900 transition-colors duration-150 py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-lg text-gray-600 hover:text-gray-900 transition-colors duration-150 py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )
                  ))}
                </nav>
                
                <div className="mt-auto pt-8 border-t pb-4">
                  <Button variant="default" size="lg" asChild className="w-full">
                    <a
                      href="https://fal.ai/dashboard/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get API Key
                    </a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <Button variant="default" size="sm" asChild className="hidden md:inline-flex">
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