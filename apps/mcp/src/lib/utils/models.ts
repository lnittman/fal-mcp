/**
 * Minimal model validation utilities for true dynamic discovery
 * No hardcoded patterns, no assumptions - just basic validation
 */

/**
 * Validate that a model ID follows basic fal.ai naming convention
 * This is the ONLY validation we do - everything else is discovered at runtime
 */
export async function validateModelDynamic(modelId: string): Promise<boolean> {
  // Basic format validation
  if (!modelId || typeof modelId !== "string") {
    return false;
  }

  // Must start with fal-ai/
  if (!modelId.startsWith("fal-ai/")) {
    return false;
  }

  // Must have at least one segment after fal-ai/
  const parts = modelId.split("/");
  if (parts.length < 2 || parts[1].length === 0) {
    return false;
  }

  // That's it! The model's actual validity will be determined when used
  return true;
}

/**
 * Format a model ID for display (simple string manipulation only)
 */
export function formatModelName(modelId: string): string {
  const parts = modelId.split("/");
  const name = parts[parts.length - 1];
  return name
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * NO LONGER USED - Keeping for backwards compatibility only
 * The agent should discover categories through actual usage
 */
export function inferModelCategory(_modelId: string): string {
  return "discovery-required";
}

/**
 * NO LONGER USED - Keeping for backwards compatibility only
 * The agent should explore models directly
 */
export function getDynamicModelSuggestions(_useCase: string): string[] {
  return [
    "Use listModelsDynamic to explore available models",
    "Try models that seem relevant based on their names",
    "Learn from API responses and errors",
    "Build your own understanding through experimentation",
  ];
}

/**
 * NO LONGER USED - Keeping for backwards compatibility only
 */
export function modelMatchesCategory(_modelId: string, _category: string): boolean {
  return true; // Let the agent figure this out
}
