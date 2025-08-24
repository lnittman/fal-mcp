"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface CategorySectionProps {
  title: string;
  description?: string;
  href?: string;
  children: React.ReactNode;
  className?: string;
  showNavigation?: boolean;
}

export function CategorySection({
  title,
  description,
  href,
  children,
  className,
  showNavigation = true
}: CategorySectionProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(`category-${title}`);
    if (!container) return;

    const scrollAmount = container.offsetWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });

    // Update scroll state after animation
    setTimeout(() => {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.offsetWidth - 10
      );
    }, 300);
  };

  return (
    <section className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {href ? (
            <Link href={href} className="group flex items-center gap-2 hover:opacity-80 transition-interactive hover:transition-interactive-out">
              <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-interactive hover:transition-interactive-out" />
            </Link>
          ) : (
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
        
        {showNavigation && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className={cn(
                "p-1.5 rounded-md transition-interactive hover:transition-interactive-out",
                canScrollLeft 
                  ? "text-gray-700 hover:bg-gray-100" 
                  : "text-gray-300 cursor-not-allowed"
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className={cn(
                "p-1.5 rounded-md transition-interactive hover:transition-interactive-out",
                canScrollRight 
                  ? "text-gray-700 hover:bg-gray-100" 
                  : "text-gray-300 cursor-not-allowed"
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div 
        id={`category-${title}`}
        className="overflow-x-auto scrollbar-hide"
        onScroll={(e) => {
          const target = e.target as HTMLDivElement;
          setCanScrollLeft(target.scrollLeft > 0);
          setCanScrollRight(
            target.scrollLeft < target.scrollWidth - target.offsetWidth - 10
          );
        }}
      >
        <div className="flex gap-4 pb-2">
          {children}
        </div>
      </div>
    </section>
  );
}