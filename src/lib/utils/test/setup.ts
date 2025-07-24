import { afterAll, beforeAll } from "vitest";

// Set up test environment
beforeAll(() => {
  // Ensure we are in test mode
  process.env.NODE_ENV = "test";
  process.env.FAL_MCP_MOCK = "true";
});

afterAll(() => {
  // Clean up
  delete process.env.FAL_MCP_MOCK;
});
