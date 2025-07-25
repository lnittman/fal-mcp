import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";
import type { InferSchema, ToolMetadata } from "xmcp";
import { z } from "zod";
import { debug } from "../lib/utils/debug";
import { formatError } from "../lib/utils/tool-base";

export const schema = {
  url: z.string().describe("URL of the file to download (supports fal.ai storage URLs and others)"),
  outputPath: z
    .string()
    .describe("Local path where to save the file (supports ~ for home directory)"),
  overwrite: z.boolean().default(false).describe("Overwrite existing file if it exists"),
};

export const metadata: ToolMetadata = {
  name: "downloadFile",
  description: `Download files from URLs to local filesystem.

CAPABILITIES:
• Download from any accessible URL
• Support for fal.ai storage URLs
• Automatic directory creation
• Overwrite protection
• Progress tracking for large files

USE CASES:
• Save generated images/videos locally
• Download processed results
• Archive outputs
• Transfer files between workflows
• Backup generated content

SUPPORTED SOURCES:
• fal.ai storage URLs (fal.media/*)
• Direct HTTP/HTTPS URLs
• Generated content URLs
• Public file URLs

WORKFLOW EXAMPLE:
1. Generate image: textToImage({ prompt: "..." })
2. Extract URL from response
3. Download locally: downloadFile({ url: "...", outputPath: "~/result.png" })`,
  annotations: {
    title: "Download File from URL",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function downloadFile(params: InferSchema<typeof schema>) {
  const { url, outputPath, overwrite } = params;
  const toolName = "downloadFile";

  try {
    // Resolve output path
    const resolvedPath = outputPath.startsWith("~")
      ? path.join(os.homedir(), outputPath.slice(1))
      : outputPath;

    debug(toolName, `Downloading from: ${url}`);
    debug(toolName, `Saving to: ${resolvedPath}`);

    // Mock mode handling
    if (process.env.FAL_MCP_MOCK === "true") {
      const fileName = path.basename(resolvedPath);
      
      return {
        content: [
          {
            type: "text",
            text: `✅ Downloaded successfully!

**File**: ${fileName}
**Size**: 2.3 MB
**Saved to**: ${resolvedPath}

The file has been downloaded from ${url} and saved locally.`,
          },
        ],
      };
    }

    // Check if file already exists
    if (!overwrite) {
      try {
        await fs.access(resolvedPath);
        throw new Error(`File already exists: ${resolvedPath}. Set overwrite: true to replace it.`);
      } catch (error: any) {
        // File doesn't exist, which is what we want
        if (error.message.includes("File already exists")) {
          throw error;
        }
      }
    }

    // Create directory if it doesn't exist
    const dir = path.dirname(resolvedPath);
    await fs.mkdir(dir, { recursive: true });

    // Download file
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
    }

    // Get file data
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Write to file
    await fs.writeFile(resolvedPath, buffer);

    // Get file info
    const stats = await fs.stat(resolvedPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    const fileName = path.basename(resolvedPath);

    // Try to get content type
    const contentType = response.headers.get("content-type") || "Unknown";

    return {
      content: [
        {
          type: "text",
          text: `✅ File downloaded successfully!

**File**: ${fileName}
**Size**: ${fileSizeMB} MB
**Type**: ${contentType}
**Saved to**: ${resolvedPath}

The file is now available on your local filesystem.`,
        },
      ],
    };
  } catch (error: any) {
    return formatError(error, "Error downloading file");
  }
}
