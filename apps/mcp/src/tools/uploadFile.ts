import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import * as fal from "@fal-ai/serverless-client";
import type { InferSchema, ToolMetadata } from "xmcp";
import { z } from "zod";
import { debug } from "../lib/utils/debug";
import { formatError, initializeFalClient } from "../lib/utils/tool-base";

export const schema = {
  filePath: z.string().describe("Local file path to upload (supports ~ for home directory)"),
  contentType: z
    .string()
    .optional()
    .describe("MIME type of the file (auto-detected if not provided)"),
};

export const metadata: ToolMetadata = {
  name: "uploadFile",
  description: `Upload a local file to fal.ai storage for use with other tools.

CAPABILITIES:
• Upload any file type to fal.ai storage
• Get a public URL for the uploaded file
• Automatic MIME type detection
• Support for large files
• Persistent storage for processing

USE CASES:
• Upload local images before processing
• Upload audio/video files for transformation
• Store intermediate results
• Share files between tools
• Prepare files for batch operations

SUPPORTED FORMATS:
• Images: JPG, PNG, WebP, GIF, etc.
• Videos: MP4, MOV, AVI, etc.
• Audio: MP3, WAV, FLAC, etc.
• Documents: PDF, JSON, etc.
• Any other file type

WORKFLOW EXAMPLE:
1. Upload local file: uploadFile({ filePath: "~/photo.jpg" })
2. Get URL from response
3. Use URL with other tools (imageToImage, etc.)`,
  annotations: {
    title: "Upload File to fal.ai Storage",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
  },
};

async function getMimeType(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".bmp": "image/bmp",
    ".svg": "image/svg+xml",
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".avi": "video/x-msvideo",
    ".webm": "video/webm",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".flac": "audio/flac",
    ".ogg": "audio/ogg",
    ".m4a": "audio/mp4",
    ".pdf": "application/pdf",
    ".json": "application/json",
    ".txt": "text/plain",
    ".xml": "application/xml",
  };

  return mimeTypes[ext] || "application/octet-stream";
}

export default async function uploadFile(params: InferSchema<typeof schema>) {
  const { filePath, contentType } = params;
  const toolName = "uploadFile";

  try {
    // Initialize fal client
    initializeFalClient(toolName);

    // Resolve file path
    const resolvedPath = filePath.startsWith("~")
      ? path.join(os.homedir(), filePath.slice(1))
      : filePath;

    // Mock mode handling
    if (process.env.FAL_MCP_MOCK === "true") {
      const fileName = path.basename(resolvedPath);
      const mockUrl = `https://fal.media/mock/files/${fileName}`;

      return {
        content: [
          {
            type: "text",
            text: `✅ File uploaded successfully!

**File**: ${fileName}
**Size**: 1.5 MB
**Type**: ${contentType || (await getMimeType(resolvedPath))}
**URL**: ${mockUrl}

You can now use this URL with any fal.ai tool that accepts file inputs.`,
          },
        ],
      };
    }

    debug(toolName, `Uploading file from: ${resolvedPath}`);

    // Check if file exists
    try {
      await fs.access(resolvedPath);
    } catch {
      throw new Error(`File not found: ${resolvedPath}`);
    }

    // Read file
    const fileBuffer = await fs.readFile(resolvedPath);
    const fileName = path.basename(resolvedPath);
    const mimeType = contentType || (await getMimeType(resolvedPath));

    // Create Blob from buffer
    const blob = new Blob([fileBuffer], { type: mimeType });

    // Upload using fal storage client
    const storage = fal.storage();
    const url = await storage.upload(blob);

    debug(toolName, `File uploaded successfully: ${url}`);

    // Get file stats for additional info
    const stats = await fs.stat(resolvedPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    return {
      content: [
        {
          type: "text",
          text: `✅ File uploaded successfully!

**File**: ${fileName}
**Size**: ${fileSizeMB} MB
**Type**: ${mimeType}
**URL**: ${url}

You can now use this URL with any fal.ai tool that accepts file inputs.`,
        },
      ],
    };
  } catch (error: any) {
    return formatError(error, "Error uploading file");
  }
}
