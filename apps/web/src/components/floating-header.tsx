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
import { ChevronDown } from "lucide-react";
import { MobileMenuOverlay } from "./mobile-menu-overlay";
import { useAtom } from "jotai";
import { isMobileMenuOpenAtom } from "@/atoms/mobile-menu";

export function FloatingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useAtom(isMobileMenuOpenAtom);

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
      <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6">
        <div
          className="mx-auto max-w-7xl mt-4 px-4 py-3 rounded-[3.75px] border"
          style={{
            transition: "all 300ms ease-in-out",
            backgroundColor: mobileMenuOpen ? "transparent" : scrolled ? "rgba(255, 255, 255, 0.8)" : "transparent",
            borderColor: mobileMenuOpen ? "transparent" : scrolled ? "rgb(229, 231, 235)" : "transparent",
            backdropFilter: mobileMenuOpen ? "none" : scrolled ? "blur(12px)" : "none",
            boxShadow: mobileMenuOpen ? "none" : scrolled ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)" : "none",
          }}
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
                <DropdownMenuContent align="end" className="w-48 rounded-[3.75px] border-gray-200 bg-white/95 backdrop-blur-sm shadow-lg">
                  {navLinks.map((link, index) => (
                    <React.Fragment key={link.href}>
                      {index === navLinks.length - 1 && <DropdownMenuSeparator className="bg-gray-100" />}
                      {link.external ? (
                        <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50">
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.label}
                          </a>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50">
                          <Link href={link.href}>
                            {link.label}
                          </Link>
                        </DropdownMenuItem>
                      )}
                    </React.Fragment>
                  ))}
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50">
                    <a
                      href="https://fal.ai/dashboard/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium"
                    >
                      Get API Key
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button - Hamburger to X animation */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-interactive hover:transition-interactive-out"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="relative h-5 w-5">
                <span 
                  className={cn(
                    "absolute left-0 top-[7px] h-[2px] w-5 bg-current transition-all duration-150 linear",
                    mobileMenuOpen && "rotate-45 top-[9px]"
                  )} 
                />
                <span 
                  className={cn(
                    "absolute left-0 bottom-[7px] h-[2px] w-5 bg-current transition-all duration-150 linear",
                    mobileMenuOpen && "-rotate-45 bottom-[9px]"
                  )} 
                />
              </div>
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