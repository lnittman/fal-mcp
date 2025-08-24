"use client";

import { cn } from "@/lib/utils";
import { ModelTypeBadge } from "./model-type-badge";
import { NewBadge } from "./new-badge";
import Link from "next/link";
import Image from "next/image";

interface ModelCardProps {
  title: string;
  description: string;
  modelType: string;
  imageUrl?: string;
  href: string;
  isNew?: boolean;
  tags?: string[];
  className?: string;
  variant?: 'default' | 'compact';
}

export function ModelCard({
  title,
  description,
  modelType,
  imageUrl,
  href,
  isNew = false,
  tags = [],
  className,
  variant = 'default'
}: ModelCardProps) {
  if (variant === 'compact') {
    return (
      <Link href={href} className={cn(
        "group block relative overflow-hidden rounded-lg border border-gray-200 hover:border-gray-300 transition-interactive hover:transition-interactive-out hover:shadow-md",
        className
      )}>
        {isNew && <NewBadge />}
        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-medium text-sm text-gray-900 group-hover:text-black line-clamp-1">
              {title}
            </h3>
            <ModelTypeBadge modelType={modelType} className="scale-90 origin-left" />
          </div>
          <p className="text-xs text-gray-600 line-clamp-2">
            {description}
          </p>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium text-gray-600 bg-gray-100 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className={cn(
      "group block relative overflow-hidden rounded-xl border border-gray-200 hover:border-gray-300 transition-interactive hover:transition-interactive-out hover:shadow-lg",
      className
    )}>
      {imageUrl && (
        <div className="relative aspect-video bg-gradient-to-br from-gray-50 to-gray-100">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
          {isNew && <NewBadge />}
        </div>
      )}
      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <ModelTypeBadge modelType={modelType} />
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-black line-clamp-1">
            {title}
          </h3>
        </div>
        <p className="text-sm text-gray-600 line-clamp-3">
          {description}
        </p>
        <div className="flex items-center gap-3 pt-2">
          <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
            Try it now →
          </span>
          <span className="text-sm text-gray-400">|</span>
          <span className="text-sm text-gray-500 hover:text-gray-700">
            See docs
          </span>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
            {tags.map((tag, index) => (
              <span key={index} className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-50 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}