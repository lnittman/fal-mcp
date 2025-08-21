"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface MobileMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenuOverlay({ isOpen, onClose }: MobileMenuOverlayProps) {
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
          {/* Full page overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-white md:hidden"
          >
            {/* Header with close button */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-gray-200">
              <Link href="/" onClick={onClose}>
                <Logo className="h-5 w-auto text-gray-900" />
              </Link>
              
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-150"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Menu content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
              className="px-6 py-8"
            >
              {/* Navigation links */}
              <nav className="space-y-6 mb-12">
                {navLinks.map((link) => (
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-2xl text-gray-900 hover:text-gray-600 transition-colors duration-150"
                      onClick={onClose}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-2xl text-gray-900 hover:text-gray-600 transition-colors duration-150"
                      onClick={onClose}
                    >
                      {link.label}
                    </Link>
                  )
                ))}
              </nav>

              {/* Bottom-aligned API key button */}
              <div className="absolute bottom-8 left-6 right-6">
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