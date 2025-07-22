import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { formatError } from "../utils/tool-base";
import { debug } from "../utils/debug";

// Model database with capabilities and recommendations
const modelDatabase = {
  // Image Generation
  "fal-ai/flux/dev": {
    category: "image-generation",
    name: "Flux Dev",
    strengths: ["High quality", "Detailed outputs", "Complex prompts", "Artistic control"],
    weaknesses: ["Slower generation", "Higher cost"],
    bestFor: ["Professional work", "Detailed artwork", "Complex scenes"],
    speed: "slow",
    quality: "excellent",
  },
  "fal-ai/flux/schnell": {
    category: "image-generation",
    name: "Flux Schnell",
    strengths: ["Fast generation", "Good quality", "Efficient"],
    weaknesses: ["Less detail than Dev", "Simpler prompts work better"],
    bestFor: ["Quick iterations", "Prototyping", "Simple images"],
    speed: "fast",
    quality: "good",
  },
  "fal-ai/flux/pro": {
    category: "image-generation",
    name: "Flux Pro",
    strengths: ["Highest quality", "Best details", "Professional features"],
    weaknesses: ["Most expensive", "Slowest"],
    bestFor: ["Production quality", "Commercial use", "Maximum quality"],
    speed: "slowest",
    quality: "best",
  },
  
  // Background Removal
  "fal-ai/birefnet": {
    category: "background-removal",
    name: "BiRefNet",
    strengths: ["Highest accuracy", "Hair details", "Complex edges"],
    weaknesses: ["Slower processing"],
    bestFor: ["Professional photos", "Hair/fur", "Complex subjects"],
    speed: "moderate",
    quality: "excellent",
  },
  "fal-ai/imageutils/rembg": {
    category: "background-removal",
    name: "RemBG",
    strengths: ["Fast processing", "Good accuracy", "Efficient"],
    weaknesses: ["Less detail on complex edges"],
    bestFor: ["Bulk processing", "Simple subjects", "Quick edits"],
    speed: "fast",
    quality: "good",
  },
  
  // Upscaling
  "fal-ai/aura-sr": {
    category: "upscaling",
    name: "Aura SR",
    strengths: ["Balanced quality/speed", "Natural results", "General purpose"],
    weaknesses: ["Not specialized"],
    bestFor: ["General upscaling", "Photos", "Mixed content"],
    speed: "moderate",
    quality: "good",
  },
  "fal-ai/clarity-upscaler": {
    category: "upscaling",
    name: "Clarity Upscaler",
    strengths: ["High fidelity", "Preserves details", "Professional quality"],
    weaknesses: ["Slower", "Resource intensive"],
    bestFor: ["Professional photos", "Maximum quality", "Print work"],
    speed: "slow",
    quality: "excellent",
  },
  "fal-ai/pasd": {
    category: "upscaling",
    name: "PASD",
    strengths: ["Realistic enhancement", "Style control", "Prompt guidance"],
    weaknesses: ["Complex to use"],
    bestFor: ["Artistic upscaling", "Style enhancement", "Creative work"],
    speed: "moderate",
    quality: "excellent",
  },
  
  // Video Generation
  "fal-ai/wan-effects": {
    category: "video-generation",
    name: "WAN Effects",
    strengths: ["Special effects", "Motion control", "Short clips"],
    weaknesses: ["Limited duration", "Basic motion"],
    bestFor: ["Effects", "Social media", "Quick animations"],
    speed: "fast",
    quality: "good",
  },
  "fal-ai/veo3": {
    category: "video-generation",
    name: "Veo3",
    strengths: ["Highest quality", "Smooth motion", "Professional results"],
    weaknesses: ["Very slow", "Expensive"],
    bestFor: ["Professional video", "High quality needs", "Commercial use"],
    speed: "slowest",
    quality: "best",
  },
};

export const schema = {
  task: z.string().describe("What you want to accomplish (e.g., 'remove background from product photos', 'generate anime artwork', 'upscale old photos')"),
  priority: z.enum(["quality", "speed", "balance"]).default("balance").describe("What matters most for this task"),
  budget: z.enum(["low", "medium", "high"]).optional().describe("Cost considerations"),
  details: z.string().optional().describe("Additional requirements or constraints"),
};

export const metadata: ToolMetadata = {
  name: "recommendModel",
  description: "Get personalized model recommendations based on your specific task and requirements",
  annotations: {
    title: "Model Recommendations",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function recommendModel(params: InferSchema<typeof schema>) {
  const { task, priority, budget, details } = params;
  const toolName = 'recommendModel';
  
  try {
    debug(toolName, `Finding recommendations for: ${task}`, { priority, budget });
  
  // Analyze task to determine category
  const taskLower = task.toLowerCase();
  let categories: string[] = [];
  
  // Determine relevant categories
  if (taskLower.includes("generat") || taskLower.includes("create") || taskLower.includes("make")) {
    if (taskLower.includes("video") || taskLower.includes("animate") || taskLower.includes("motion")) {
      categories.push("video-generation");
    } else {
      categories.push("image-generation");
    }
  }
  
  if (taskLower.includes("background") || taskLower.includes("remove") || taskLower.includes("cutout")) {
    categories.push("background-removal");
  }
  
  if (taskLower.includes("upscale") || taskLower.includes("enhance") || taskLower.includes("resolution")) {
    categories.push("upscaling");
  }
  
  // If no specific category detected, analyze for general terms
  if (categories.length === 0) {
    if (taskLower.includes("photo") || taskLower.includes("image") || taskLower.includes("picture")) {
      categories.push("image-generation", "upscaling", "background-removal");
    } else if (taskLower.includes("video") || taskLower.includes("clip") || taskLower.includes("movie")) {
      categories.push("video-generation");
    } else {
      // Default to image generation
      categories.push("image-generation");
    }
  }
  
  // Filter models by category
  const relevantModels = Object.entries(modelDatabase).filter(([_, info]) => 
    categories.includes(info.category)
  );
  
  // Score and rank models
  const scoredModels = relevantModels.map(([modelId, info]) => {
    let score = 0;
    
    // Priority scoring
    if (priority === "quality") {
      if (info.quality === "best") score += 30;
      else if (info.quality === "excellent") score += 20;
      else if (info.quality === "good") score += 10;
    } else if (priority === "speed") {
      if (info.speed === "fast") score += 30;
      else if (info.speed === "moderate") score += 15;
      else if (info.speed === "slow") score += 5;
      else if (info.speed === "slowest") score += 0;
    } else { // balance
      if (info.quality === "excellent" && info.speed === "moderate") score += 25;
      else if (info.quality === "good" && info.speed === "fast") score += 20;
      else score += 10;
    }
    
    // Budget considerations
    if (budget === "low") {
      if (info.speed === "fast") score += 10; // Faster = cheaper
      if (modelId.includes("schnell") || modelId.includes("rembg")) score += 10;
    } else if (budget === "high") {
      if (info.quality === "best" || info.quality === "excellent") score += 10;
    }
    
    // Task-specific bonuses
    if (taskLower.includes("professional") || taskLower.includes("commercial")) {
      if (info.bestFor.some(use => use.toLowerCase().includes("professional"))) score += 15;
    }
    
    if (taskLower.includes("quick") || taskLower.includes("fast")) {
      if (info.speed === "fast") score += 15;
    }
    
    if (taskLower.includes("detail") || taskLower.includes("quality")) {
      if (info.quality === "excellent" || info.quality === "best") score += 15;
    }
    
    return { modelId, info, score };
  });
  
  // Sort by score
  scoredModels.sort((a, b) => b.score - a.score);
  
  // Build recommendations
  const recommendations: string[] = [];
  
  if (scoredModels.length === 0) {
    return {
      content: [
        { type: "text", text: "No specific models found for your task. Try rephrasing or being more specific." },
      ],
    };
  }
  
  // Primary recommendation
  const primary = scoredModels[0];
  recommendations.push(`**Recommended:** ${primary.modelId} (${primary.info.name})`);
  recommendations.push(`Best for: ${primary.info.bestFor.join(", ")}`);
  recommendations.push(`Strengths: ${primary.info.strengths.join(", ")}`);
  
  // Alternative recommendations
  if (scoredModels.length > 1) {
    recommendations.push("\n**Alternatives:**");
    for (let i = 1; i < Math.min(3, scoredModels.length); i++) {
      const alt = scoredModels[i];
      recommendations.push(`- ${alt.modelId}: ${alt.info.strengths.slice(0, 2).join(", ")}`);
    }
  }
  
  // Priority-specific advice
  recommendations.push("\n**Advice:**");
  if (priority === "quality") {
    recommendations.push("For maximum quality, expect longer processing times and higher costs.");
  } else if (priority === "speed") {
    recommendations.push("For fastest results, you may sacrifice some output quality.");
  } else {
    recommendations.push("Balanced approach gives good results with reasonable speed.");
  }
  
    return {
      content: [
        { type: "text", text: recommendations.join("\n") },
      ],
    };
  } catch (error: any) {
    return formatError(error, 'Error generating recommendations');
  }
}