"use client";

import React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Menu, ChevronDown } from "lucide-react";
import { MobileMenuOverlay } from "./mobile-menu-overlay";

export function FloatingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/docs", label: "Documentation" },
    { href: "/docs/tools", label: "Tools" },
    { href: "https://github.com/fal-ai/fal-mcp", label: "GitHub", external: true },
  ];

  return (
    <>
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
            {/* Logo - visible on all screens */}
            <Link href="/" className="flex items-center">
              <Logo className="h-5 w-auto text-gray-900" />
            </Link>

            {/* Desktop Navigation with Dropdown */}
            <div className="hidden md:flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1">
                    Menu
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {navLinks.map((link, index) => (
                    <React.Fragment key={link.href}>
                      {index === navLinks.length - 1 && <DropdownMenuSeparator />}
                      {link.external ? (
                        <DropdownMenuItem asChild>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cursor-pointer"
                          >
                            {link.label}
                          </a>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem asChild>
                          <Link href={link.href} className="cursor-pointer">
                            {link.label}
                          </Link>
                        </DropdownMenuItem>
                      )}
                    </React.Fragment>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a
                      href="https://fal.ai/dashboard/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer font-medium"
                    >
                      Get API Key
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors duration-150"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenuOverlay 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
    </>
  );
}