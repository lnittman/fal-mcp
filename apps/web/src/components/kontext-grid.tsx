"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface KontextItem {
  title: string;
  href: string;
  modelType: string;
  imageUrl?: string;
}

interface KontextGridProps {
  items: KontextItem[];
  className?: string;
}

export function KontextGrid({ items, className }: KontextGridProps) {
  return (
    <div className={cn(
      "relative rounded-xl overflow-hidden",
      className
    )}>
      {/* Pixel texture background - matches fal.ai's pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.05) 2px,
              rgba(0,0,0,0.05) 4px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.05) 2px,
              rgba(0,0,0,0.05) 4px
            )
          `,
          backgroundSize: '4px 4px'
        }}
      />
      
      <div className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Everything Kontext</h2>
          <p className="text-sm text-gray-600">
            Explore the best Flux Kontext offerings: top-tier base models, curated LoRA adapters, and the official LoRA Trainer endpoint.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="group relative aspect-square rounded-lg overflow-hidden bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-interactive hover:transition-interactive-out"
            >
              {item.imageUrl && (
                <div className="absolute inset-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover opacity-20 group-hover:opacity-30 transition-interactive hover:transition-interactive-out"
                  />
                </div>
              )}
              
              {/* Diagonal striped overlay for visual interest */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 10px,
                    rgba(0,0,0,0.05) 10px,
                    rgba(0,0,0,0.05) 20px
                  )`
                }}
              />

              <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
                <h3 className="font-medium text-sm text-gray-900 group-hover:text-black mb-2">
                  {item.title}
                </h3>
                <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                  {item.modelType}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}