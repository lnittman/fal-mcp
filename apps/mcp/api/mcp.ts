// Since xmcp adapter isn't working directly with Vercel,
// let's create a simple proxy endpoint for now
export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // For now, return basic MCP server info
  // In production, this would handle full MCP protocol
  return res.status(200).json({
    name: "@fal-ai/mcp",
    version: "0.1.0",
    description: "fal.ai Model Context Protocol server",
    status: "ready",
    capabilities: {
      tools: true,
      prompts: true,
      resources: true,
    },
    message:
      "Full MCP protocol implementation coming soon. Use 'npx @fal-ai/mcp' for local installation.",
  });
}
