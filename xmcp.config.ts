import { type XmcpConfig } from "xmcp";

const config: XmcpConfig = {
  http: {
    port: 3002,
    endpoint: "/mcp",
  },
  stdio: true, // Enables local execution for file system access
};

export default config;
