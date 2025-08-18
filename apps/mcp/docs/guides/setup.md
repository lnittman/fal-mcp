# fal-mcp Setup & Testing Guide

This guide walks you through setting up, testing, and using fal-mcp with Claude Desktop and other MCP clients.

## 📋 Prerequisites

- Node.js 20+ installed
- fal.ai API key from [https://fal.ai/dashboard/keys](https://fal.ai/dashboard/keys)
- Claude Desktop app (for Claude integration)

## 🚀 Quick Start

### Option 1: Install via Claude Desktop (Recommended)

```bash
claude mcp add fal -- npx -y @fal-ai/mcp
```

After installation, you'll need to add your FAL_API_KEY to the Claude configuration file. See [Claude Configuration](#adding-to-claude-desktop) below.

### Option 2: Manual Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/fal-mcp.git
cd fal-mcp

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local
```

### 2. Configure API Key

Edit `.env.local` and add your fal.ai API key:
```
FAL_API_KEY=your-actual-api-key-here
```

### 3. Build the Project

```bash
# Build for production
pnpm build

# This creates:
# - dist/stdio.js (for local file access)
# - dist/http.js (for HTTP server)
```

## 🧪 Testing Locally

### Option 1: Development Mode (Recommended for Testing)

```bash
# Start in development mode with hot reload
pnpm dev

# You should see:
# ✔ MCP Server running on http://127.0.0.1:3002/mcp
```

### Option 2: Production STDIO Mode

```bash
# Build first
pnpm build

# Run STDIO server
pnpm start-stdio

# Or directly:
node dist/stdio.js
```

### Test the Server Manually

You can test the MCP server using the stdio protocol:

```bash
# In one terminal, start the server
node dist/stdio.js

# The server expects JSON-RPC messages via stdin
# Send a test message:
echo '{"jsonrpc": "2.0", "method": "tools/list", "id": 1}' | node dist/stdio.js
```

## 🤖 Adding to Claude Desktop

### 1. Locate Claude Config

On macOS:
```bash
# Open config file
open ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Or edit directly
nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

On Windows:
```
%APPDATA%\Claude\claude_desktop_config.json
```

### 2. Add fal-mcp Configuration

If you used `claude mcp add`, you'll see an entry like this in your config:

```json
{
  "mcpServers": {
    "fal": {
      "command": "npx",
      "args": ["-y", "@fal-ai/mcp"]
    }
  }
}
```

Add your API key to the configuration:

```json
{
  "mcpServers": {
    "fal": {
      "command": "npx",
      "args": ["-y", "@fal-ai/mcp"],
      "env": {
        "FAL_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

For manual installation, use:

```json
{
  "mcpServers": {
    "fal-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/fal-mcp/dist/stdio.js"],
      "env": {
        "FAL_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**Important**: Replace `/absolute/path/to/fal-mcp` with your actual path!

Example for macOS:
```json
{
  "mcpServers": {
    "fal-mcp": {
      "command": "node",
      "args": ["/Users/yourusername/Developer/fal-mcp/dist/stdio.js"],
      "env": {
        "FAL_API_KEY": "a145e5b2-c7d8-4e66-ba51-e4c24ccd06c9:xxxxx"
      }
    }
  }
}
```

### 3. Restart Claude Desktop

1. Quit Claude Desktop completely (Cmd+Q on Mac)
2. Start Claude Desktop again
3. Open a new conversation

### 4. Verify Installation

In Claude, try:
```
"Can you list the available MCP tools?"
```

You should see:
- textToImage
- imageToImage
- batchProcessImages
- saveImage
- textToVideo
- imageToVideo
- textToSpeech
- speechToText

## 🎯 Testing Workflows

### Test 1: Basic Image Generation
```
You: "Generate an image of a cute robot"
```
Expected: Claude uses `textToImage` tool and shows you an image URL

### Test 2: Image Transformation
```
You: "Take this image [paste image URL] and convert it to pixel art style"
```
Expected: Claude uses `imageToImage` tool with your URL

### Test 3: Local File Operations
```
You: "Save that image to my desktop as robot.png"
```
Expected: Claude uses `saveImage` tool to save locally

### Test 4: Batch Processing
```
You: "Convert all images in ~/Pictures/test to watercolor style"
```
Expected: Claude uses `batchProcessImages` on your folder

## 🔧 Troubleshooting

### Claude doesn't see the tools

1. Check Claude's MCP status:
   - Look for MCP indicator in Claude's interface
   - Check if other MCP servers work

2. Verify config syntax:
   ```bash
   # Validate JSON
   python -m json.tool ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

3. Check server logs:
   ```bash
   # Run manually to see errors
   FAL_API_KEY=your-key node /path/to/dist/stdio.js
   ```

### "FAL_API_KEY missing" errors

1. If running via Claude, ensure the key is in the config env section
2. If running locally, ensure `.env.local` exists and is loaded
3. Test with direct env var:
   ```bash
   FAL_API_KEY=your-key pnpm dev
   ```

### Server crashes or tools fail

1. Check fal.ai dashboard for API quota/limits
2. Verify API key permissions
3. Run in dev mode for detailed errors:
   ```bash
   pnpm dev
   ```

### Images not saving locally

1. Ensure you're using STDIO mode (not HTTP)
2. Check file permissions for target directory
3. Use absolute paths or ~ for home directory

## 🌐 Using with Other MCP Clients

### Cursor

Add to Cursor's settings:
```json
{
  "mcp": {
    "servers": {
      "fal-mcp": {
        "command": "node",
        "args": ["/path/to/fal-mcp/dist/stdio.js"]
      }
    }
  }
}
```

### Continue.dev

Add to `~/.continue/config.json`:
```json
{
  "models": [...],
  "mcpServers": {
    "fal-mcp": {
      "command": "node",
      "args": ["/path/to/fal-mcp/dist/stdio.js"],
      "env": {
        "FAL_API_KEY": "your-key"
      }
    }
  }
}
```

## 📝 Development Tips

### Watch Mode
```bash
# Auto-rebuild on changes
pnpm dev
```

### Add New Tools
1. Create new file in `src/tools/`
2. Follow the pattern of existing tools
3. Restart server to load new tool

### Debug Mode
```bash
# Set debug env var
DEBUG=* pnpm dev
```

### Test Individual Tools
```typescript
// Create test script: test-tool.ts
import textToImage from './src/tools/textToImage';

async function test() {
  const result = await textToImage({
    prompt: "test image",
    model: "fal-ai/flux/dev"
  });
  console.log(result);
}

test();
```

## 🚢 Deployment Options

### Local Only (Recommended)
- Use STDIO mode with Claude Desktop
- No deployment needed
- Full file system access

### HTTP Server (Vercel)
```bash
# Deploy to Vercel
vercel

# Set environment variables in Vercel dashboard
# FAL_API_KEY=your-key
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["node", "dist/http.js"]
```

## 🎉 Success Checklist

- [ ] API key configured
- [ ] Project builds without errors
- [ ] Claude Desktop sees the tools
- [ ] Can generate images via Claude
- [ ] Can save images locally
- [ ] Batch processing works

## 📚 Next Steps

1. Read [EXAMPLES.md](./EXAMPLES.md) for workflow ideas
2. Try chaining multiple operations
3. Customize tools for your needs
4. Share your workflows with the community!

## 🆘 Getting Help

- Check existing issues on GitHub
- Review fal.ai documentation
- Verify MCP setup with simpler servers first
- Enable debug logging for detailed errors

Remember: The most common issues are incorrect paths in config or missing API keys!