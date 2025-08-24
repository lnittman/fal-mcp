"use client";

import { cn } from "@/lib/utils";

interface NewBadgeProps {
  className?: string;
  variant?: 'default' | 'inline';
}

export function NewBadge({ className, variant = 'default' }: NewBadgeProps) {
  if (variant === 'inline') {
    return (
      <span className={cn(
        "inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-green-500 to-green-600 rounded-[3px]",
        className
      )}>
        new
      </span>
    );
  }

  return (
    <div className={cn(
      "absolute top-2 left-2 z-10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-green-500 to-green-600 rounded-[3px] shadow-sm",
      className
    )}>
      new
    </div>
  );
}