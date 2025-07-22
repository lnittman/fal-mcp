# API Configuration

## Environment Variables

### Required

**`FAL_API_KEY`** - Your fal.ai API key

Get your API key from [fal.ai dashboard](https://fal.ai/dashboard/keys).

```bash
# .env.local
FAL_API_KEY=your-api-key-here
```

## Server Configuration

The MCP server supports two modes:

### STDIO Mode (Recommended)
- Direct communication with MCP clients
- Full filesystem access for local file operations
- Used by Claude Desktop, Cursor, etc.

### HTTP Mode
- Web server for browser/API access
- Limited filesystem access
- Useful for web deployments

Configuration is in `xmcp.config.ts`:

```typescript
const config: XmcpConfig = {
  http: {
    port: 3002,
    endpoint: "/mcp",
  },
  stdio: true, // Enable for MCP clients
};
```

## Available Tools

The server provides 21 tools across 6 categories:

### Image Generation (2 tools)
- `textToImage` - Generate images from text
- `textToImageWithPreset` - Generate with style presets

### Image Processing (5 tools)
- `imageToImage` - Transform images with text prompts
- `upscaleImage` - AI super-resolution
- `backgroundRemoval` - Remove backgrounds
- `objectRemoval` - Remove objects with masks
- `imageToJson` - Analyze and extract image data

### Video Generation (2 tools)
- `textToVideo` - Generate videos from text
- `imageToVideo` - Animate static images

### Audio Tools (3 tools)
- `textToSpeech` - Convert text to speech
- `speechToText` - Transcribe audio to text
- `textToAudio` - Generate music/sound effects
- `audioToAudio` - Transform audio files

### Batch Operations (2 tools)
- `batchProcessImages` - Process multiple images
- `batchBackgroundRemoval` - Remove backgrounds in bulk

### Utilities (7 tools)
- `saveImage` - Save images locally
- `workflowChain` - Chain multiple operations
- `discoverModels` - Find available models
- `listModels` - List models by category
- `recommendModel` - Get model suggestions
- `jsonTools` - JSON utilities

## Model Support

The server uses fal.ai's dynamic model system:

- **No hardcoded model lists** - Use any model from fal.ai
- **Runtime validation** - Models are checked when used
- **Automatic discovery** - New models work immediately
- **Future-proof** - Supports models that don't exist yet

Popular model patterns:
- `fal-ai/flux/dev` - High-quality image generation
- `fal-ai/flux/schnell` - Fast image generation
- `fal-ai/stable-diffusion-*` - Various SD models
- `fal-ai/kling-video/*` - Video generation
- `fal-ai/whisper` - Speech recognition

## Error Handling

The server provides helpful error messages for:

- Missing API keys
- Invalid model IDs
- File not found errors
- Network/API failures

All errors include suggestions for resolution.
