import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { formatError } from "../lib/utils/tool-base";
import { debug } from "../lib/utils/debug";

export const schema = {
  topic: z.string().optional().describe("Course topic to explore (e.g., 'image generation', 'video animation')"),
};

export const metadata: ToolMetadata = {
  name: "courseModels",
  description: `Interactive demo showcasing fal.ai models and capabilities.
  
This tool guides users through a hands-on exploration of fal.ai's capabilities:
1. Presents model options based on selected topic
2. Generates sample content with recommended parameters
3. Offers transformation suggestions
4. Demonstrates advanced features like animation

USAGE:
• General exploration: {}
• Topic-specific: { topic: "image generation" }

INTERACTION FLOW:
1. Elicit user interest in different model categories
2. Generate sample content with optimized prompts
3. Suggest transformations or enhancements
4. Demonstrate advanced capabilities (e.g., animation)

EXAMPLE PATHS:
• Image → Style Transfer → Animation
• Text-to-Speech → Voice Cloning → Audio Mixing
• Background Removal → Upscaling → Style Transfer

BENEFITS:
• Hands-on learning experience
• Discover model capabilities interactively
• Learn best practices through examples
• Build confidence with guided workflows`,
  annotations: {
    title: "Interactive Model Course",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function courseModels(params: InferSchema<typeof schema>) {
  const { topic } = params;
  const toolName = 'courseModels';
  
  try {
    debug(toolName, `Starting course`, { topic });
    
    // Build course content based on topic
    let courseContent = "";
    
    if (!topic) {
      courseContent = `🌟 Welcome to the fal.ai Interactive Demo! 🌟

I'll guide you through our most popular capabilities. What interests you most?

1. 🎨 Image Generation & Editing
2. 🎬 Video Creation & Animation
3. 🎵 Audio Production & Voice
4. 🔄 Batch Processing Workflows

Please respond with a number (1-4) to select a topic, or describe your own interest!`;
    } else if (topic.includes("image") || topic.includes("1")) {
      courseContent = `🎨 Image Generation Course

Step 1: Text-to-Image
Let's start by generating an image. Try:
textToImage({ 
  prompt: "a futuristic cityscape at sunset, cyberpunk style",
  model: "fal-ai/flux/dev"
})

Step 2: Style Transfer
Transform your image with:
imageToImage({ 
  imageUrl: "[URL_FROM_STEP_1]",
  prompt: "convert to pixel art style, 8-bit, retro game aesthetic"
})

Step 3: Background Removal
Clean up your image:
backgroundRemoval({ 
  imageUrl: "[URL_FROM_STEP_2]"
})

Step 4: Animation (Bonus)
Animate your creation:
imageToVideo({ 
  imageUrl: "[URL_FROM_STEP_3]",
  prompt: "gentle camera pan, subtle zoom effect"
})

Try these steps in order, or let me know which interests you most!`;
    } else if (topic.includes("video") || topic.includes("2")) {
      courseContent = `🎬 Video Creation Course

Step 1: Text-to-Video
Create a video from text:
textToVideo({ 
  prompt: "waves crashing on a beach at sunset, cinematic",
  model: "fal-ai/ltxv-13b-098-distilled"
})

Step 2: Image-to-Video
Animate a static image:
imageToVideo({ 
  imageUrl: "[YOUR_IMAGE_URL]",
  prompt: "camera slowly zooming in, gentle motion"
})

Step 3: Video Enhancement
Improve video quality:
videoEnhancement({ 
  videoUrl: "[URL_FROM_STEP_1_OR_2]"
})

Try these steps, or let me know what aspect of video creation interests you!`;
    } else if (topic.includes("audio") || topic.includes("3")) {
      courseContent = `🎵 Audio Production Course

Step 1: Text-to-Speech
Generate speech from text:
textToSpeech({ 
  text: "Welcome to our interactive demo!",
  voice: "nova",
  emotion: "happy"
})

Step 2: Text-to-Audio
Create music or sound effects:
textToAudio({ 
  prompt: "upbeat electronic music, 120 bpm",
  model: "fal-ai/stable-audio"
})

Step 3: Speech-to-Text
Transcribe audio content:
speechToText({ 
  audioUrl: "[URL_FROM_STEP_1]"
})

Try these steps, or let me know what aspect of audio production interests you!`;
    } else if (topic.includes("batch") || topic.includes("4")) {
      courseContent = `🔄 Batch Processing Course

Step 1: Batch Image Processing
Apply transformations to multiple images:
batchProcessImages({ 
  directory: "~/my-photos",
  actionPrompt: "convert to watercolor style",
  model: "fal-ai/flux-general/image-to-image"
})

Step 2: Batch Background Removal
Remove backgrounds from product photos:
batchBackgroundRemoval({ 
  directory: "~/product-photos",
  model: "fal-ai/birefnet"
})

Step 3: Workflow Chaining
Combine multiple operations:
workflowChain({ 
  steps: [
    { type: "generate", model: "fal-ai/flux/dev", parameters: { prompt: "product mockup" } },
    { type: "removeBackground", model: "fal-ai/birefnet" },
    { type: "upscale", model: "fal-ai/aura-sr", parameters: { scale: 2 } }
  ]
})

Try these workflows, or let me know what batch processing scenario you'd like to explore!`;
    } else {
      courseContent = `I can help you explore fal.ai capabilities in these areas:

1. 🎨 Image Generation & Editing
2. 🎬 Video Creation & Animation  
3. 🎵 Audio Production & Voice
4. 🔄 Batch Processing Workflows

Please select a topic by number or describe your interest!`;
    }
    
    return {
      content: [
        { type: "text", text: courseContent },
      ],
    };
  } catch (error: any) {
    return formatError(error, 'Error in course models');
  }
}