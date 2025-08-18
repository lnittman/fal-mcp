# MCP Tools Directory

This directory contains all Model Context Protocol tool implementations for fal.ai models. Each tool follows the discovery pattern - accepting any parameters and learning from API responses.

## Tool Categories

### 🎨 Image Generation & Processing

#### Core Generation
- **textToImage.ts** - Generate images from text prompts
  - Supports any fal.ai image model
  - Common models: flux/dev, flux-pro, stable-diffusion-*
  
- **textToImageStyled.ts** - Generate with style exploration
  - Encourages creative style discovery
  - No fixed presets, pure experimentation

- **textToImageWithPreset.ts** - Legacy preset-based generation
  - Being phased out for pure discovery approach

#### Image Transformation
- **imageToImage.ts** - Transform images with prompts
  - Style transfer, modifications, enhancements
  - Accepts both URLs and local paths

- **backgroundRemoval.ts** - Remove backgrounds from single images
  - Default: birefnet for quality
  - Alternative: imageutils/rembg for speed

- **batchBackgroundRemoval.ts** - Bulk background removal
  - Process entire directories
  - Maintains folder structure

- **batchProcessImages.ts** - Bulk transformations
  - Apply same prompt to multiple images
  - Parallel processing for efficiency

- **objectRemoval.ts** - AI-powered inpainting
  - Remove unwanted objects
  - Automatic or mask-based

- **upscaleImage.ts** - Enhance image resolution
  - Multiple upscaling models
  - Preserves or enhances details

### 🎬 Video Generation

- **textToVideo.ts** - Generate videos from text
  - Various duration and style options
  - Multiple aspect ratios

- **imageToVideo.ts** - Animate static images
  - Add motion to photos
  - Custom motion prompts

### 🔊 Audio Tools

#### Speech & Voice
- **textToSpeech.ts** - Natural voice synthesis
  - Multiple voices and languages
  - Emotional tone control

- **speechToText.ts** - Transcription & translation
  - 100+ language support
  - Word-level timestamps

#### Music & Audio
- **textToAudio.ts** - Music generation
  - Create music from descriptions
  - Various genres and styles

- **audioToAudio.ts** - Audio transformations
  - Effects, modifications
  - Voice changing

### 🔍 Discovery & Analysis

- **discoverModelsDynamic.ts** - Model exploration
  - Validate model IDs
  - Suggest models for use cases
  - No hardcoded lists

- **listModelsDynamic.ts** - Model listing
  - Starting point for discovery
  - Not prescriptive

- **recommendModel.ts** - Usage guidance
  - Learn HOW to find models
  - Not WHICH models to use

- **modelDocs.ts** - Model documentation
  - Get parameters if available
  - Best practices

- **courseModels.ts** - Interactive tutorials
  - Hands-on model exploration
  - Guided learning paths

### 🧠 AI Enhancement

- **imageToJson.ts** - Analyze images
  - Extract structured data
  - Visual question answering
  - Object detection

- **enhancePrompt.ts** - Optimize prompts
  - XML-structured enhancement
  - Model-specific optimization
  - Style presets

- **getSystemInstructions.ts** - System documentation
  - Comprehensive tool reference
  - XML/JSON/Markdown formats

### 🔧 Utilities

- **uploadFile.ts** - Upload local files
  - Get URLs for processing
  - Support for all file types

- **downloadFile.ts** - Save files locally
  - Download generated content
  - Progress tracking

- **saveImage.ts** - Save and resize images
  - Format conversion
  - Dimension adjustment

- **workflowChain.ts** - Multi-step pipelines
  - Chain operations
  - Intermediate result saving

- **jsonTools.ts** - JSON utilities
  - Validation and transformation
  - Schema tools

## Tool Development Pattern

### Base Structure
```typescript
export class MyTool extends ToolBase {
  name = "myTool";
  description = "Tool description";
  
  inputSchema = z.object({
    // Required parameters only
    prompt: z.string().describe("Generation prompt"),
    // Optional with defaults
    model: z.string().default("fal-ai/default-model")
  });
  
  async execute(args: z.infer<typeof this.inputSchema>) {
    const validated = this.validateInput(args);
    
    // Pass ALL parameters through
    const result = await fal.run(validated.model, {
      ...validated,
      // Let API validate parameters
    });
    
    return this.formatResponse(result);
  }
}
```

### Discovery Guidelines

1. **Minimal Schema** - Only validate truly required fields
2. **Pass Everything** - Let all parameters through to API
3. **Learn from Errors** - API errors teach correct usage
4. **Document Discoveries** - Share what you learn

### Common Discoveries

Through experimentation, these patterns emerge:
```typescript
// Image generation
prompt: "description"
image_size: "landscape_4_3" | "square" | "portrait_3_4"
num_inference_steps: 4-50 (quality/speed)
guidance_scale: 1-20 (prompt adherence)

// Video generation  
duration: 5-10 (seconds)
aspect_ratio: "16:9" | "1:1" | "9:16"

// Transformations
strength: 0-1 (transformation intensity)
seed: number (reproducibility)
```

## Testing Tools

### Test Structure
```typescript
describe('ToolName', () => {
  const tool = new ToolName();
  
  it('should handle basic input', async () => {
    const result = await tool.execute({
      prompt: "test prompt"
    });
    expect(result).toHaveProperty('url');
  });
  
  it('should work with discovery', async () => {
    // Test parameter discovery
    const result = await tool.execute({
      prompt: "test",
      unexpectedParam: "value" // Should pass through
    });
  });
});
```

### Mock Mode
All tools support `MOCK_MODE=true` for testing without API calls.

## Adding New Tools

1. **Create Tool File**
   ```bash
   touch src/tools/newTool.ts
   ```

2. **Implement Tool**
   - Extend ToolBase
   - Define minimal schema
   - Pass parameters through

3. **Add Tests**
   ```bash
   touch src/__tests__/tools/newTool.test.ts
   ```

4. **Export Tool**
   - Add to tool registry
   - Update documentation

## Current State

### Test Coverage
- ✅ 4 tools tested (18%)
- 🚧 18 tools need tests
- 🎯 Goal: 80% coverage

### Recent Additions
- courseModels - Interactive demos
- enhancePrompt - Prompt optimization  
- getSystemInstructions - Full docs

### In Progress
- Removing hardcoded parameters
- Enhancing discovery patterns
- Improving error messages

---

*Each tool in this directory empowers AI agents to discover and use fal.ai models without prescriptive limitations.*