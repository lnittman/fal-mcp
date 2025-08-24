"use client";

import { Search } from "lucide-react";
import Link from "next/link";

interface SearchSuggestionsProps {
  suggestions?: string[];
  className?: string;
}

const defaultSuggestions = [
  "Newest image to video models",
  "Flux Kontext",
  "Generate 3D model", 
  "Create music",
  "Remove background",
  "Upscale",
  "Training",
  "Try on clothing"
];

export function SearchSuggestions({ 
  suggestions = defaultSuggestions,
  className = "" 
}: SearchSuggestionsProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Try:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Link
            key={index}
            href={`/explore/search?q=${encodeURIComponent(suggestion)}`}
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-sm text-gray-700 hover:text-gray-900 transition-interactive hover:transition-interactive-out"
          >
            <Search className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-500" />
            <span>{suggestion}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}