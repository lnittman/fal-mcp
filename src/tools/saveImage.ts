import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import fs from "fs-extra";
import path from "path";
import os from "os";
import { formatError } from "../utils/tool-base";
import { debug } from "../utils/debug";

export const schema = {
  imageUrl: z.string().describe("URL of the image to save"),
  outputPath: z.string().describe("Output file path (use ~ for home directory)"),
  width: z.number().optional().describe("Resize width in pixels"),
  height: z.number().optional().describe("Resize height in pixels"),
  format: z.enum(["png", "jpg", "webp", "ico"]).optional().describe("Output format (defaults to extension from outputPath)"),
};

export const metadata: ToolMetadata = {
  name: "saveImage",
  description: "Save an image from URL to local file system",
  annotations: {
    title: "Save Image",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function saveImage(params: InferSchema<typeof schema>) {
  const { imageUrl, outputPath, width, height, format } = params;
  const toolName = 'saveImage';
  
  try {
    debug(toolName, `Saving image from URL to: ${outputPath}`);
    // Resolve output path (handle ~ for home)
    let resolvedPath: string;
    if (outputPath.startsWith('~')) {
      resolvedPath = path.join(os.homedir(), outputPath.slice(1));
    } else if (path.isAbsolute(outputPath)) {
      resolvedPath = outputPath;
    } else {
      // For relative paths, default to Desktop directory for better Claude Desktop compatibility
      const desktopPath = path.join(os.homedir(), 'Desktop');
      resolvedPath = path.join(desktopPath, outputPath);
    }

    // Ensure directory exists
    const dir = path.dirname(resolvedPath);
    await fs.ensureDir(dir);

    // Download image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save the image
    await fs.writeFile(resolvedPath, buffer);

    const stats = await fs.stat(resolvedPath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    
    debug(toolName, `Image saved successfully`, { path: resolvedPath, sizeKB });

    return {
      content: [
        { type: "text", text: `Saved image to: ${resolvedPath} (${sizeKB} KB)` },
      ],
    };
  } catch (error: any) {
    return formatError(error, 'Error saving image');
  }
}