#!/usr/bin/env node

// Suppress console.log in STDIO mode to prevent JSON parsing errors
if (process.env.MCP_TRANSPORT === "stdio" || !process.stdout.isTTY) {
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleInfo = console.info;

  // Redirect console output to stderr only for actual errors
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  console.error = (...args) => {
    // Only output to stderr for critical errors
    if (args.some((arg) => String(arg).toLowerCase().includes("error"))) {
      originalConsoleError(...args);
    }
  };
}

// Import and run the generated stdio server
require("./dist/stdio.js");
