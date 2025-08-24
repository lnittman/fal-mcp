"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { isMobileMenuOpenAtom } from "@/atoms/mobile-menu";

interface MobileMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenuOverlay({ isOpen, onClose }: MobileMenuOverlayProps) {
  const [, setGlobalMenuOpen] = useAtom(isMobileMenuOpenAtom);

  // Sync with global state
  useEffect(() => {
    setGlobalMenuOpen(isOpen);
  }, [isOpen, setGlobalMenuOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/docs", label: "Documentation" },
    { href: "/docs/tools", label: "Tools" },
    { href: "https://github.com/fal-ai/fal-mcp", label: "GitHub", external: true },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Full page overlay with no Y animations */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[95] bg-white md:hidden flex flex-col"
          >
            {/* Spacer for header height */}
            <div className="h-20 flex-shrink-0" />

            {/* Menu content with only opacity animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut", delay: 0.1 }}
              className="flex-1 flex flex-col px-6 py-8 overflow-y-auto"
            >
              {/* Navigation links */}
              <nav className="space-y-6 flex-1">
                {navLinks.map((link) => (
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-2xl text-gray-900 hover:text-gray-600 transition-menu"
                      onClick={onClose}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-2xl text-gray-900 hover:text-gray-600 transition-menu"
                      onClick={onClose}
                    >
                      {link.label}
                    </Link>
                  )
                ))}
              </nav>

              {/* API key button at the bottom */}
              <div className="mt-12">
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
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}