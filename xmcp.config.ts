import type { XmcpConfig } from "xmcp";

const config: XmcpConfig = {
  http: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3002,
    endpoint: "/mcp",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  },
  stdio: true, // Enables local execution for file system access
  experimental: {
    adapter: process.env.VERCEL ? "nextjs" : undefined,
  },
};

export default config;
