#!/bin/bash

echo "🚀 Deploying fal-mcp to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm i -g vercel
fi

# Deploy MCP server
echo "📦 Deploying MCP server..."
vercel --prod --yes

# Get the deployment URL
DEPLOYMENT_URL=$(vercel ls --json | jq -r '.[0].url')
echo "✅ MCP server deployed to: https://$DEPLOYMENT_URL"

# Deploy webapp
echo "📦 Deploying webapp..."
cd webapp
vercel --prod --yes

# Get the webapp URL
WEBAPP_URL=$(vercel ls --json | jq -r '.[0].url')
echo "✅ Webapp deployed to: https://$WEBAPP_URL"

echo ""
echo "🎉 Deployment complete!"
echo "MCP Server: https://$DEPLOYMENT_URL/mcp"
echo "Documentation: https://$WEBAPP_URL"
echo ""
echo "Next steps:"
echo "1. Set FAL_API_KEY in Vercel dashboard"
echo "2. Update HTTP config URL in docs if needed"
echo "3. Test the endpoints"