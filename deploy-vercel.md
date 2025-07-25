# Deploy to Vercel - Quick Guide

## Option 1: Deploy MCP Server (Recommended)

1. From the root directory:
```bash
vercel
```

2. Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? **Your account**
   - Link to existing project? **No** (create new)
   - Project name? **fal-mcp**
   - Directory? **.**
   - Override settings? **No**

3. Set environment variable:
```bash
vercel env add FAL_API_KEY
```

The MCP server will be available at: `https://fal-mcp.vercel.app/mcp`

## Option 2: Deploy Webapp

1. From the webapp directory:
```bash
cd webapp
vercel
```

2. Follow similar prompts for **fal-mcp-docs**

The webapp will be available at: `https://fal-mcp-docs.vercel.app`

## Option 3: GitHub Integration (Easiest)

1. Push to GitHub:
```bash
git add .
git commit -m "feat: Add webapp and prepare for Vercel deployment"
git push
```

2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Deploy with these settings:
   - **Root Directory**: Leave empty for MCP server OR set to `webapp` for docs
   - **Build Command**: Auto-detected
   - **Environment Variables**: Add `FAL_API_KEY`

## Test Your Deployment

1. MCP Server endpoint:
```bash
curl https://your-deployment.vercel.app/mcp
```

2. Update the HTTP config in your AI assistant to use your live URL!

## Notes

- The MCP server requires `FAL_API_KEY` to function
- The webapp is a static site and doesn't need env vars
- Both can be deployed separately or you can create a monorepo deployment