import dotenv from "dotenv";
import open from "open";
import type { Middleware } from "xmcp";
import { headers } from "xmcp/headers";

dotenv.config({ path: ".env.local" }); // Load .env.local

const isStdio = process.env.MCP_TRANSPORT === "stdio"; // Detect transport

const authMiddleware: Middleware = async (req, res, next) => {
  let apiKey = process.env.FAL_API_KEY;

  if (!isStdio) {
    try {
      const reqHeaders = headers();
      apiKey = reqHeaders["x-fal-api-key"] || apiKey;
    } catch (e) {
      // headers() might not be available in all contexts
    }
  }

  if (!apiKey) {
    if (isStdio) {
      await open("https://fal.ai/dashboard/keys"); // Open auth webpage
      return res.status(401).json({
        error:
          "FAL_API_KEY missing. Browser opened to fal.ai dashboard—copy key to .env.local and restart.",
      });
    } else {
      return res.status(401).json({
        error: "FAL_API_KEY missing. Set in headers (x-fal-api-key) or env.",
      });
    }
  }

  // Set key for fal-js
  process.env.FAL_API_KEY = apiKey;

  return next();
};

export default [authMiddleware]; // Array for chaining if needed
