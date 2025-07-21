# Local Testing Guide

## Quick Start

### 1. Test the STDIO Server Directly

```bash
# Set your API key
export FAL_API_KEY="your-api-key-here"

# Run the STDIO server
npm run start-stdio
```

Test with MCP protocol messages:
```bash
# Initialize
echo '{"jsonrpc":"2.0","method":"initialize","params":{"capabilities":{}},"id":1}' | npm run start-stdio

# List tools
echo '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":2}' | npm run start-stdio
```

### 2. Add to Claude Desktop

Edit your Claude Desktop configuration:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add the fal-mcp server:

```json
{
  "mcpServers": {
    "fal-mcp": {
      "command": "node",
      "args": ["/Users/nit/Developer/fal/fal-mcp/stdio-wrapper.js"],
      "env": {
        "FAL_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### 3. Restart Claude Desktop

1. Quit Claude Desktop completely
2. Restart Claude Desktop
3. The fal.ai tools should appear in the tools list

### 4. Test the Tools

Try these prompts in Claude:
- "Generate a cyberpunk cat image"
- "Create a pixel art landscape" 
- "Convert this prompt to speech: Hello world"
- "Generate a video of a dancing robot"

## Alternative: Test via NPX (simulates production)

```bash
# Pack the project
npm pack

# Test npx execution
npx @fal-ai/mcp@file:fal-ai-mcp-0.1.0.tgz
```

## Troubleshooting

### Tools don't appear in Claude
1. Check Claude Desktop logs: Help → Show Logs
2. Verify the config file syntax (JSON must be valid)
3. Ensure the path to stdio.js is absolute
4. Check FAL_API_KEY is set correctly

### API Key Issues
If you see "FAL_API_KEY missing":
1. The browser should open to fal.ai dashboard
2. Copy your API key
3. Add it to the env section in claude_desktop_config.json
4. Restart Claude Desktop

### Permission Errors
```bash
chmod +x /Users/nit/Developer/fal/fal-mcp/stdio-wrapper.js
```

## Development Workflow

For active development:
```bash
# Terminal 1: Watch and rebuild
npm run dev

# Terminal 2: Test after changes
npm run start-stdio
```

Then restart Claude Desktop to pick up changes.