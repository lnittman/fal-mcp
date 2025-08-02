# fal-mcp ⚡

**Natural language meets lightning-fast generative AI.** Transform your ideas into images, videos, and audio through simple conversation.

🌐 **[Live Documentation](https://webapp-luke-labs.vercel.app)** | 📦 **[NPM Package](https://www.npmjs.com/package/@fal-ai/mcp)**

A Model Context Protocol (MCP) server powered by [fal.ai](https://fal.ai) that enables natural language creation through Claude, Cursor, and other MCP-compatible clients.

## ✨ What You Can Create

### 🎨 Images
- **Generate from text**: "A cyberpunk cat in a neon city"
- **Transform existing images**: "Make it pixel art style"
- **Process entire folders**: "Convert all photos to anime style"
- **Smart saving**: Resize, convert formats, organize locally

### 🎬 Videos
- **Text to video**: "Waves crashing on a beach at sunset"
- **Animate images**: Bring your static images to life

### 🔊 Audio
- **Natural speech**: Multiple voices and languages
- **Transcription**: 100+ languages with auto-detection
- **Music generation**: Create soundscapes and melodies

### 🚀 Why fal-mcp?
- **Discovery-based**: No need to memorize parameters - just describe what you want
- **Lightning fast**: Powered by fal.ai's optimized infrastructure
- **Works everywhere**: Claude Desktop, Cursor, any MCP client
- **Learn by doing**: The AI discovers the best approach for you

## 📚 Documentation

### Core Philosophy
- **[Architecture & Philosophy](./docs/ARCHITECTURE.md)** - Understanding our discovery-based approach
- **[Discovery Guide for AI Agents](./docs/guides/discovery-philosophy.md)** - How agents can explore and learn

### Getting Started
- **[Setup Guide](./docs/guides/setup.md)** - Complete installation and configuration
- **[Tools Reference](./docs/guides/tools-reference-new.md)** - All available tools with discovery approach
- **[Example Workflows](./docs/examples/workflows.md)** - Powerful agentic combinations

### Development
- **[Contributing Guide](./docs/CONTRIBUTING.md)** - How to contribute to fal-mcp
- **[Testing Guide](./docs/TESTING.md)** - Testing infrastructure and strategies
- **[Troubleshooting](./docs/guides/troubleshooting.md)** - Common issues and solutions

## 🚀 Get Started in 30 Seconds

### Quick Install with Claude Desktop

```bash
claude mcp add fal -- npx -y @fal-ai/mcp
```

Then add your API key to the Claude configuration. That's it! 🎉

### Manual Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/fal-mcp.git
cd fal-mcp

# Install dependencies
pnpm install

# Set up your fal.ai API key
cp .env.example .env.local
# Edit .env.local and add your key from https://fal.ai/dashboard/keys

# Build and test
pnpm build
pnpm dev
```

## 💬 Example Conversations

```
You: Generate an image of a serene Japanese garden at dawn
Claude: ✨ Beautiful! Your image is ready: [generates stunning image]

You: Now make it look like Studio Ghibli animated it
Claude: 🎨 Transformed with that magical Ghibli style: [transforms image]

You: Can you animate this with gentle wind movement?
Claude: 🎬 Your garden now sways peacefully: [creates video]
```

## 🛠️ Development

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm test         # Run tests (199 passing ✅)
```

### Configure in Claude Desktop

See [Setup Guide](./docs/guides/setup.md) for detailed configuration instructions.

Quick config for `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "fal-mcp": {
      "command": "node",
      "args": ["/path/to/fal-mcp/stdio-wrapper.js"],
      "env": {
        "FAL_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Available Tools

### textToImage
Generate images from text descriptions.

Example prompts:
- "Generate a pixel art cat"
- "Create a watercolor landscape of mountains"
- "Make an 8-bit style robot"

### imageToImage
Transform existing images using natural language. Supports both URLs and local file paths.

Example prompts:
- "Convert this to pixel art" (with URL: https://example.com/image.jpg)
- "Transform /Users/me/Desktop/photo.jpg to vintage style" (with local file)
- "Make it look like a watercolor painting"
- "Add neon glow effects"

### batchProcessImages
Process all images in a folder with the same transformation.

Example: "Convert all images in ~/Pictures to pixel art style"

### saveImage
Save images from URLs to local files with optional resizing.

Example: "Save this image as a 32x32 favicon"

## Example Workflows

### Generate and Set Favicon
1. "Generate a pixel art logo of a rocket"
2. "Save that image as ~/Desktop/favicon.ico with favicon sizes"

### Batch Style Transfer
1. "Convert all images in ~/vacation-photos to watercolor style"

### Create and Transform
1. "Generate a photo of a cat"
2. "Transform it to look like an oil painting"
3. "Save it to ~/Desktop/cat-painting.png"

## Environment Variables

- `FAL_API_KEY`: Your fal.ai API key (required)

## Known Issues

- **Image Display in Claude Desktop**: Currently, Claude Desktop may show "Unsupported image type: undefined" errors even though images are generated successfully. As a workaround, the image URL is included in the text response. See [Troubleshooting Guide](./docs/TROUBLESHOOTING.md) for details.

## Development

The project uses:
- [xmcp](https://xmcp.dev) - MCP server framework
- [@fal-ai/serverless-client](https://fal.ai/docs) - fal.ai SDK
- [sharp](https://sharp.pixelplumbing.com/) - Image processing
- [zod](https://zod.dev) - Schema validation

## License

MIT
