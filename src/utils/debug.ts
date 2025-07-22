/**
 * Debug logging utility that respects environment settings
 */

const DEBUG = process.env.FAL_MCP_DEBUG === 'true' || process.env.DEBUG === 'true';

export function debug(tool: string, message: string, data?: any) {
  if (DEBUG) {
    if (data !== undefined) {
      console.error(`[${tool}] ${message}`, data);
    } else {
      console.error(`[${tool}] ${message}`);
    }
  }
}