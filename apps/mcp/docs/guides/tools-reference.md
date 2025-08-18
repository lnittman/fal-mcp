# Tools Reference

Complete reference for all fal-mcp tools, organized by category.

## 🎨 Image Generation

### `textToImage`
Generate high-quality images from text descriptions.

**Parameters:**
- `prompt` (required): Description of the image to generate
- `model`: Model ID (default: "fal-ai/flux/dev")
- `imageSize`: Aspect ratio ("square", "landscape_4_3", "portrait_4_3", "landscape_16_9", "portrait_16_9")
- `guidanceScale`: Prompt adherence strength (1-20)
- `numInferenceSteps`: Generation quality steps (1-50)

**Example:**
```javascript
{
  "prompt": "cyberpunk cat with neon eyes, digital art",
  "model": "fal-ai/flux/dev",
  "imageSize": "square"
}
```

### `textToImageWithPreset`
Generate images using predefined style presets.

**Parameters:**
- `subject` (required): Main subject to generate
- `preset`: Style preset ("pixelArt", "anime", "photorealistic", "watercolor", "oilPainting", "cyberpunk", "steampunk", "minimalist", "glassArt", "retroWave")
- `additionalDetails`: Extra style modifiers
- `model`: Model to use (default: "fal-ai/flux/dev")

**Example:**
```javascript
{
  "subject": "mountain landscape",
  "preset": "watercolor",
  "additionalDetails": "sunset lighting, peaceful mood"
}
```

## 🖼️ Image Processing

### `imageToImage`
Transform images using natural language prompts.

**Parameters:**
- `prompt` (required): Transformation description
- `imageUrl` OR `imagePath`: Source image (URL or local file path)
- `model`: Transformation model (default: "fal-ai/flux/dev/image-to-image")
- `strength`: Transformation intensity (0-1)
- `maskUrl`: Optional mask for selective editing
- `referenceImage`: Optional style reference

**Example:**
```javascript
{
  "prompt": "convert to pixel art style",
  "imagePath": "~/Desktop/photo.jpg",
  "strength": 0.8
}
```

### `upscaleImage`
Enhance image resolution with AI super-resolution.

**Parameters:**
- `imageUrl` OR `imagePath`: Source image
- `model`: Upscaling model (default: "fal-ai/aura-sr")
- `scaleFactor`: Upscaling factor (2-8x)
- `style`: Enhancement style for PASD model
- `prompt`: Guided upscaling prompt

**Example:**
```javascript
{
  "imagePath": "~/low-res-photo.jpg",
  "scaleFactor": 4,
  "model": "fal-ai/clarity-upscaler"
}
```

### `backgroundRemoval`
Remove backgrounds from images with AI precision.

**Parameters:**
- `imageUrl` OR `imagePath`: Source image
- `model`: Removal model (default: "fal-ai/birefnet")
- `outputFormat`: Output format ("png", "webp")
- `returnMask`: Return mask along with result

**Example:**
```javascript
{
  "imagePath": "~/product-photo.jpg",
  "outputFormat": "png"
}
```

### `objectRemoval`
Remove unwanted objects from images with AI inpainting.

**Parameters:**
- `imageUrl` OR `imagePath`: Source image
- `maskUrl` (required): Mask defining removal areas
- `model`: Inpainting model (default: "fal-ai/imageutils/lama")
- `backgroundPrompt`: Replacement description for stable-diffusion model
- `dilateAmount`: Pixels to expand mask area

**Example:**
```javascript
{
  "imagePath": "~/photo.jpg",
  "maskUrl": "~/mask.png",
  "model": "fal-ai/imageutils/lama"
}
```

### `imageToJson`
Analyze images and extract structured information.

**Parameters:**
- `imageUrl` (required): Image to analyze
- `prompt`: Analysis question (default: "Describe this image in detail")
- `model`: Vision model (default: "fal-ai/bagel/understand")
- `outputFormat`: Response format ("json", "structured", "raw")

**Example:**
```javascript
{
  "imageUrl": "https://example.com/chart.png",
  "prompt": "Extract all text and data from this chart",
  "outputFormat": "json"
}
```

## 🎬 Video Generation

### `textToVideo`
Generate videos from text descriptions.

**Parameters:**
- `prompt` (required): Video description
- `model`: Video model (default: "fal-ai/ltxv-13b-098-distilled")
- `duration`: Video length in seconds (2-10)
- `fps`: Frames per second (8-30)
- `aspectRatio`: Video format ("16:9", "1:1", "9:16")
- `motionIntensity`: Motion amount (0-1)

**Example:**
```javascript
{
  "prompt": "waves crashing on beach at sunset, cinematic",
  "duration": 5,
  "aspectRatio": "16:9"
}
```

### `imageToVideo`
Animate static images with motion.

**Parameters:**
- `imageUrl` (required): Source image
- `model`: Animation model (default: "fal-ai/wan-effects")
- `duration`: Video length (2-6 seconds)
- `fps`: Frames per second (8-30)
- `motionPrompt`: Motion description
- `motionBucketId`: Motion intensity (1-255)

**Example:**
```javascript
{
  "imageUrl": "https://example.com/landscape.jpg",
  "motionPrompt": "gentle wind through trees",
  "duration": 4
}
```

## 🎙️ Audio Tools

### `textToSpeech`
Convert text to natural speech.

**Parameters:**
- `text` (required): Text to convert
- `voice`: Voice selection (default: "nova")
- `language`: Language code (default: "en")
- `speed`: Speech speed (0.5-2)
- `emotion`: Emotional tone
- `model`: TTS model (default: "fal-ai/text-to-speech")

**Example:**
```javascript
{
  "text": "Hello, this is a test of the speech system.",
  "voice": "nova",
  "speed": 1.0
}
```

### `speechToText`
Transcribe speech to text.

**Parameters:**
- `audioUrl` (required): Audio file URL
- `language`: Source language (auto-detected if not specified)
- `task`: "transcribe" or "translate"
- `model`: STT model (default: "fal-ai/whisper")
- `includeTimestamps`: Include word-level timestamps
- `translate`: Translate to English

**Example:**
```javascript
{
  "audioUrl": "https://example.com/audio.mp3",
  "task": "transcribe",
  "includeTimestamps": true
}
```

### `textToAudio`
Generate music and audio from text descriptions.

**Parameters:**
- `prompt` (required): Audio description
- `duration`: Audio length (1-30 seconds)
- `format`: Output format ("mp3", "wav", "ogg")
- `model`: Audio model (default: "fal-ai/stable-audio")

**Example:**
```javascript
{
  "prompt": "upbeat electronic dance music with heavy bass",
  "duration": 10,
  "format": "mp3"
}
```

### `audioToAudio`
Transform and edit audio files.

**Parameters:**
- `audioUrl` (required): Source audio
- `model`: Transformation model (default: "fal-ai/playai/inpaint/diffusion")
- `prompt`: Transformation description
- `strength`: Change intensity (0-1)
- `startTime`: Start time for modification
- `endTime`: End time for modification

**Example:**
```javascript
{
  "audioUrl": "https://example.com/song.mp3",
  "prompt": "remove vocals, keep instrumental only",
  "strength": 0.8
}
```

## 📁 Batch Processing

### `batchProcessImages`
Process multiple images with the same transformation.

**Parameters:**
- `directory` (required): Directory path containing images
- `actionPrompt` (required): Transformation to apply
- `model`: Processing model (default: "fal-ai/flux-general/image-to-image")
- `strength`: Transformation strength (0-1)
- `outputFormat`: Output format ("png", "jpg", "webp")
- `outputSuffix`: Filename suffix (default: "_processed")
- `overwrite`: Overwrite existing files

**Example:**
```javascript
{
  "directory": "~/vacation-photos",
  "actionPrompt": "vintage film photography style",
  "outputSuffix": "_vintage"
}
```

### `batchBackgroundRemoval`
Remove backgrounds from all images in a directory.

**Parameters:**
- `directory` (required): Directory containing images
- `model`: Removal model (default: "fal-ai/birefnet")
- `outputFormat`: Output format ("png", "webp")
- `outputSuffix`: Filename suffix (default: "_nobg")
- `overwrite`: Overwrite existing files

**Example:**
```javascript
{
  "directory": "~/product-photos",
  "outputFormat": "png",
  "outputSuffix": "_transparent"
}
```

## 🔗 Workflow Tools

### `workflowChain`
Chain multiple operations sequentially.

**Parameters:**
- `steps` (required): Array of operations to perform
- `inputImage`: Starting image (optional for generation workflows)
- `outputPath`: Final result save location
- `saveIntermediates`: Save results from each step

**Example:**
```javascript
{
  "steps": [
    {
      "type": "generate",
      "prompt": "modern logo design"
    },
    {
      "type": "removeBackground"
    },
    {
      "type": "upscale",
      "scaleFactor": 4
    }
  ],
  "outputPath": "~/final-logo.png"
}
```

## 🔍 Model Discovery

### `discoverModels`
Dynamic model discovery and validation.

**Parameters:**
- `operation` (required): "validate", "suggest", or "infer"
- `modelId`: Model ID to validate/analyze
- `useCase`: Description for suggestions

**Example:**
```javascript
{
  "operation": "suggest",
  "useCase": "create anime artwork"
}
```

### `listModels`
Simple model listing and guidance.

**Parameters:**
- `operation` (required): "validate", "suggest", or "infer"
- `category`: Model category hint
- `useCase`: Description for suggestions

**Example:**
```javascript
{
  "operation": "validate",
  "modelId": "fal-ai/flux/dev"
}
```

### `recommendModel`
Get personalized model recommendations.

**Parameters:**
- `task` (required): What you want to accomplish
- `priority`: "quality", "speed", or "balance"
- `budget`: "low", "medium", or "high"
- `details`: Additional requirements

**Example:**
```javascript
{
  "task": "upscale old family photos",
  "priority": "quality",
  "budget": "medium"
}
```

## 💾 Utility Tools

### `saveImage`
Save images locally with optional processing.

**Parameters:**
- `imageUrl` (required): Source image URL
- `outputPath` (required): Local save path
- `format`: Output format ("png", "jpg", "webp", "ico")
- `width`: Resize width
- `height`: Resize height

**Example:**
```javascript
{
  "imageUrl": "https://example.com/image.png",
  "outputPath": "~/Desktop/saved-image.png",
  "width": 1024,
  "height": 1024
}
```

### `jsonTools`
JSON processing utilities.

**Parameters:**
- Various depending on specific JSON operation

**Example:**
```javascript
{
  "operation": "format",
  "data": {...}
}
```

## 🎯 Usage Tips

### File Paths
- Use absolute paths: `/Users/username/image.jpg`
- Home directory shortcut: `~/Desktop/image.jpg`
- Support formats: PNG, JPEG, WebP

### Model Selection
- For quality: Use FLUX models
- For speed: Use Schnell variants
- For specific styles: Use specialized models

### Batch Operations
- Organize files in dedicated directories
- Use descriptive output suffixes
- Test on small batches first

### Chaining Operations
- Save intermediate results for debugging
- Use consistent parameters across chain steps
- Combine different model strengths for best results
