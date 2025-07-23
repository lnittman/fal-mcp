# fal-mcp Tools Reference

> **Philosophy**: All tools accept ANY fal-ai/* model and ANY parameters. They are designed for discovery, not prescription. See [Discovery Philosophy](./discovery-philosophy.md) to understand this approach.

## Core Concepts

Every tool follows the same pattern:
- Accepts a `model` parameter (any fal-ai/* model ID)
- Accepts a `parameters` object (any additional parameters)
- Returns appropriate media URLs or data
- Passes errors back for learning

## Tool Categories

### 🎨 Text to Image

#### `textToImage`
Generate images from text descriptions using any fal.ai model.

```typescript
{
  prompt: string,              // Your text description
  model?: string,              // Any fal-ai/* model (default: "fal-ai/flux/dev")
  parameters?: Record<string, any>  // Any additional parameters
}
```

**Discovery hints**: Try parameters like `image_size`, `num_inference_steps`, `guidance_scale`, `seed`

#### `textToImageStyled`
Generate images with style exploration (formerly textToImageWithPreset).

```typescript
{
  prompt: string,              // Complete prompt including style
  model?: string,              // Any fal-ai/* model
  parameters?: Record<string, any>  // Any additional parameters
}
```

**Discovery hints**: Include style keywords in your prompt like "pixel art style", "watercolor painting"

### 🖼️ Image Processing

#### `imageToImage`
Transform images based on prompts using any fal.ai model.

```typescript
{
  imageUrl?: string,           // URL of input image
  imagePath?: string,          // Or local file path
  prompt: string,              // Transformation description
  model?: string,              // Any fal-ai/* model
  parameters?: Record<string, any>  // Any additional parameters
}
```

**Discovery hints**: Try parameters like `strength`, `style`, `mask_url`

#### `backgroundRemoval`
Remove backgrounds from images using any fal.ai model.

```typescript
{
  imageUrl?: string,           // URL of input image
  imagePath?: string,          // Or local file path
  model?: string,              // Any fal-ai/* model (default: "fal-ai/birefnet")
  parameters?: Record<string, any>  // Any additional parameters
}
```

#### `objectRemoval`
Remove unwanted objects from images using any fal.ai model.

```typescript
{
  imageUrl?: string,           // URL of input image
  imagePath?: string,          // Or local file path
  maskUrl: string,             // Mask indicating areas to remove
  model?: string,              // Any fal-ai/* model
  backgroundPrompt?: string,   // Description for inpainting
  dilateAmount?: number,       // Mask expansion pixels
}
```

#### `upscaleImage`
Enhance image resolution using any fal.ai model.

```typescript
{
  imageUrl?: string,           // URL of input image
  imagePath?: string,          // Or local file path
  model?: string,              // Any fal-ai/* model (default: "fal-ai/aura-sr")
  parameters?: Record<string, any>  // Any additional parameters
}
```

**Discovery hints**: Try parameters like `scale`, `upscaling_factor`, `num_steps`

### 🎬 Video Generation

#### `textToVideo`
Generate videos from text using any fal.ai model.

```typescript
{
  prompt: string,              // Video description
  model?: string,              // Any fal-ai/* model
  parameters?: Record<string, any>  // Any additional parameters
}
```

**Discovery hints**: Try parameters like `duration`, `fps`, `aspect_ratio`, `motion_intensity`

#### `imageToVideo`
Animate static images using any fal.ai model.

```typescript
{
  imageUrl: string,            // Static image to animate
  model?: string,              // Any fal-ai/* model
  parameters?: Record<string, any>  // Any additional parameters
}
```

**Discovery hints**: Try parameters like `motion_prompt`, `duration`, `fps`

### 🎵 Audio Generation

#### `textToAudio`
Generate music and audio from text using any fal.ai model.

```typescript
{
  prompt: string,              // Audio/music description
  model?: string,              // Any fal-ai/* model
  parameters?: Record<string, any>  // Any additional parameters
}
```

**Discovery hints**: Try parameters like `duration`, `format`, `tempo`

#### `textToSpeech`
Convert text to speech using any fal.ai model.

```typescript
{
  text: string,                // Text to speak
  voice?: string,              // Voice selection
  language?: string,           // Language code
  speed?: number,              // Speech rate
  emotion?: string,            // Emotional tone
  model?: string,              // Any fal-ai/* model
}
```

#### `audioToAudio`
Transform audio files using any fal.ai model.

```typescript
{
  audioUrl: string,            // Input audio URL
  model?: string,              // Any fal-ai/* model
  parameters?: Record<string, any>  // Any additional parameters
}
```

**Discovery hints**: Try parameters like `prompt`, `strength`, `start_time`, `end_time`

### 📊 Analysis Tools

#### `speechToText`
Transcribe audio to text using any fal.ai model.

```typescript
{
  audioUrl: string,            // Audio to transcribe
  task?: string,               // "transcribe" or "translate"
  language?: string,           // Source language
  includeTimestamps?: boolean, // Include word timings
  translate?: boolean,         // Translate to English
  model?: string,              // Any fal-ai/* model
}
```

#### `imageToJson`
Analyze images and extract structured data using any fal.ai model.

```typescript
{
  imageUrl: string,            // Image to analyze
  prompt?: string,             // Analysis question
  outputFormat?: string,       // "json", "structured", or "raw"
  model?: string,              // Any fal-ai/* model
}
```

### 🔧 Utility Tools

#### `workflowChain`
Chain multiple operations together.

```typescript
{
  inputImage?: string,         // Optional starting image
  steps: Array<{               // Sequence of operations
    type: "generate" | "removeBackground" | "upscale" | "transform" | "animate",
    model: string,             // Any fal-ai/* model
    parameters: Record<string, any>  // Step-specific parameters
  }>,
  outputPath?: string,         // Save location
  saveIntermediates?: boolean  // Save each step
}
```

#### `batchProcessImages`
Apply the same transformation to multiple images.

```typescript
{
  directory: string,           // Input directory
  actionPrompt: string,        // Transformation to apply
  model?: string,              // Any fal-ai/* model
  strength?: number,           // Transformation strength
  outputFormat?: string,       // Output format
  outputSuffix?: string        // Filename suffix
}
```

#### `batchBackgroundRemoval`
Remove backgrounds from all images in a directory.

```typescript
{
  directory: string,           // Input directory
  model?: string,              // Any fal-ai/* model
  outputFormat?: string,       // "png" or "webp"
  outputSuffix?: string,       // Filename suffix
  overwrite?: boolean          // Overwrite existing
}
```

### 🔍 Discovery Tools

#### `recommendModel`
Get discovery strategies for your task (not prescriptive lists).

```typescript
{
  task: string,                // What you want to accomplish
  context?: Record<string, any>  // Previous attempts, errors, etc.
}
```

#### `listModelsDynamic`
Explore available models through patterns.

```typescript
{
  query?: string               // Optional search term
}
```

#### `discoverModelsDynamic`
Validate model IDs and infer capabilities.

```typescript
{
  operation: "validate" | "suggest" | "infer",
  modelId?: string,            // For validate/infer
  useCase?: string             // For suggest
}
```

#### `modelDocs`
Get detailed documentation for a specific model (if available).

```typescript
{
  modelId: string              // The fal.ai model ID
}
```

## Discovery Workflow Example

```javascript
// 1. Get discovery strategy
await recommendModel({ task: "create anime artwork" })

// 2. Explore available models
await listModelsDynamic({ query: "anime" })

// 3. Check documentation if available
await modelDocs({ modelId: "fal-ai/flux/dev" })

// 4. Try the model
await textToImage({
  prompt: "anime character",
  model: "fal-ai/flux/dev",
  parameters: {
    style: "anime",  // Experiment!
    quality: "high"  // Try anything!
  }
})

// 5. Learn from response/error and iterate
```

## Key Principles

1. **No Validation**: Tools don't validate parameters - the API does
2. **Error Learning**: Errors reveal correct parameter names
3. **Experimentation**: Try any model with any parameters
4. **Discovery**: Build knowledge through exploration

## Common Parameter Patterns

These are **discoveries, not rules** - always be ready to find exceptions:

- Image generation: `prompt`, `image_size`, `num_inference_steps`
- Video generation: `duration`, `fps`, `aspect_ratio`
- Audio generation: `duration`, `format`, `sample_rate`
- Model control: `seed`, `guidance_scale`, `strength`

Remember: Every model might use different parameter names. That's the beauty of discovery!