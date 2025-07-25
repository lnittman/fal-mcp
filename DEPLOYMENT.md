# Deployment Guide

This guide covers deploying both the MCP server and the webapp to Vercel.

## Prerequisites

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Ensure you have a Vercel account and are logged in:
```bash
vercel login
```

## Deploy MCP Server

From the root directory (`/fal-mcp`):

```bash
# Deploy the MCP server
vercel --prod

# Set environment variables
vercel env add FAL_API_KEY production
```

This will deploy the MCP server with the HTTP/SSE endpoint at:
- `https://your-deployment.vercel.app/mcp`

## Deploy Webapp

From the webapp directory (`/fal-mcp/webapp`):

```bash
cd webapp
vercel --prod
```

This will deploy the documentation site separately.

## Combined Deployment (Recommended)

For a single deployment with both MCP server and webapp:

1. Create a new Next.js app that combines both:
```bash
# From root directory
cp -r webapp/* .
rm -rf webapp
```

2. Update `package.json` to include webapp dependencies

3. Move MCP endpoint to Next.js API routes:
```bash
mkdir -p app/api/mcp
mv api/mcp.ts app/api/mcp/route.ts
```

4. Deploy:
```bash
vercel --prod
```

## Environment Variables

Set these in Vercel dashboard or via CLI:

- `FAL_API_KEY` - Your fal.ai API key (required)
- `NODE_ENV` - Set to "production"

## Post-Deployment

1. Update the HTTP config URL in the docs to match your deployment
2. Test the MCP endpoint: `curl https://your-deployment.vercel.app/mcp`
3. Share the webapp URL for documentation

## Custom Domain

To add a custom domain:

```bash
vercel domains add your-domain.com
```

Then follow the DNS configuration instructions in Vercel dashboard.