# Deployment Guide

## Local Deployment (Recommended)

For most users, local deployment provides the best experience with full filesystem access.

### Claude Desktop

1. **Install via Claude CLI:**
   ```bash
   claude mcp add fal -- npx -y @fal-ai/mcp
   ```

2. **Add API key to config:**
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

3. **Restart Claude Desktop**

### Manual Local Setup

1. **Clone and build:**
   ```bash
   git clone https://github.com/fal-ai/fal-mcp.git
   cd fal-mcp
   pnpm install
   pnpm build
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API key
   ```

3. **Add to MCP client config:**
   ```json
   {
     "mcpServers": {
       "fal-mcp": {
         "command": "node",
         "args": ["/absolute/path/to/fal-mcp/stdio-wrapper.js"],
         "env": {
           "FAL_API_KEY": "your-api-key-here"
         }
       }
     }
   }
   ```

## Cloud Deployment

### Vercel (HTTP Mode)

1. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set environment variables:**
   - `FAL_API_KEY`: Your fal.ai API key

3. **Access via HTTP:**
   ```
   https://your-project.vercel.app/mcp
   ```

**Note:** Cloud deployments have limited filesystem access. Local file operations will not work.

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3002
CMD ["npm", "start"]
```

```bash
docker build -t fal-mcp .
docker run -p 3002:3002 -e FAL_API_KEY=your-key fal-mcp
```

## Configuration Files

### Required Files

- `.env.local` - Environment variables (local development)
- `xmcp.config.ts` - Server configuration

### Optional Files

- `biome.json` - Code formatting rules
- `tsconfig.json` - TypeScript configuration
- `vercel.json` - Vercel deployment settings

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `FAL_API_KEY` | Yes | Your fal.ai API key |
| `PORT` | No | HTTP server port (default: 3002) |
| `NODE_ENV` | No | Environment (development/production) |

## Troubleshooting Deployment

### Common Issues

1. **"FAL_API_KEY missing"**
   - Ensure API key is set in environment
   - Check config file syntax for MCP clients

2. **Tools not appearing**
   - Verify MCP client configuration
   - Restart MCP client after config changes
   - Check server logs for errors

3. **File operations failing**
   - Use STDIO mode for local file access
   - HTTP mode has limited filesystem access
   - Ensure proper file paths (absolute or ~/home)

### Debugging

1. **Test server directly:**
   ```bash
   node stdio-wrapper.js
   ```

2. **Enable debug logging:**
   ```bash
   DEBUG=* npm run dev
   ```

3. **Check MCP client logs:**
   - Claude Desktop: Help → Show Logs
   - Other clients: Check respective documentation

## Production Considerations

### Security

- Keep API keys secure and out of version control
- Use environment variables for sensitive data
- Consider API rate limits and quotas

### Performance

- STDIO mode is faster for local operations
- HTTP mode better for multiple concurrent users
- Consider caching for frequently used models

### Monitoring

- Monitor API usage at fal.ai dashboard
- Track error rates and response times
- Set up alerts for quota limits

## Scaling

For high-volume usage:

1. **Load balancing** - Deploy multiple HTTP instances
2. **Caching** - Cache model responses where appropriate  
3. **Queue management** - Handle concurrent requests gracefully
4. **Resource limits** - Set appropriate timeouts and limits
