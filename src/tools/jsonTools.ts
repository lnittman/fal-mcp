import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import {
  initializeFalClient,
  submitToFal,
  formatError,
} from "../utils/tool-base";
import { debug } from "../utils/debug";

// Schema for loudness normalization
export const loudnormSchema = {
  audioUrl: z.string().describe("URL of the audio file to analyze"),
};

export const loudnormMetadata: ToolMetadata = {
  name: "ffmpegLoudnorm",
  description: `Get EBU R128 loudness normalization data from audio files using FFmpeg API.

CAPABILITIES:
• Analyze audio loudness levels
• Get EBU R128 compliant measurements
• Extract normalization parameters
• Prepare audio for broadcast standards

OUTPUT DATA:
• Integrated loudness (LUFS)
• Loudness range (LU)
• True peak (dBTP)
• Normalization parameters

USE CASES:
• Podcast normalization
• Music mastering
• Broadcast compliance
• Audio level matching`,
  annotations: {
    title: "FFmpeg Loudness Analysis",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

// Schema for waveform generation
export const waveformSchema = {
  audioUrl: z.string().describe("URL of the audio file to analyze"),
  width: z.number().min(100).max(4000).default(1000).describe("Width of the waveform image"),
  height: z.number().min(50).max(1000).default(200).describe("Height of the waveform image"),
  color: z.string().default("blue").describe("Color of the waveform"),
};

export const waveformMetadata: ToolMetadata = {
  name: "ffmpegWaveform",
  description: `Generate waveform visualization data from audio files using FFmpeg API.

CAPABILITIES:
• Generate waveform images
• Customize dimensions and colors
• Extract amplitude data
• Create visual representations

USE CASES:
• Audio player interfaces
• Podcast episode previews
• Music visualization
• Audio editing tools`,
  annotations: {
    title: "FFmpeg Waveform Generation",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

// Schema for metadata extraction
export const metadataSchema = {
  mediaUrl: z.string().describe("URL of the video or audio file to analyze"),
};

export const metadataMetadata: ToolMetadata = {
  name: "ffmpegMetadata",
  description: `Extract encoding metadata from video and audio files using FFmpeg API.

CAPABILITIES:
• Get file format information
• Extract codec details
• Retrieve bitrate and sample rate
• Get duration and dimensions
• Read embedded metadata tags

OUTPUT DATA:
• Format and codec info
• Duration and bitrate
• Video resolution and fps
• Audio channels and sample rate
• Metadata tags (title, artist, etc)

USE CASES:
• Media file validation
• Quality assessment
• Catalog generation
• Transcoding preparation`,
  annotations: {
    title: "FFmpeg Metadata Extraction",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

// Implementation for loudnorm
export async function ffmpegLoudnorm(params: InferSchema<typeof loudnormSchema>) {
  const { audioUrl } = params;
  const toolName = 'ffmpegLoudnorm';
  
  try {
    initializeFalClient(toolName);
    debug(toolName, `Analyzing loudness for audio`);

    const result = await submitToFal("fal-ai/ffmpeg-api/loudnorm", {
      audio_url: audioUrl
    }, toolName);

    return {
      content: [
        { type: "text", text: JSON.stringify(result, null, 2) },
      ],
    };
  } catch (error: any) {
    return formatError(error, 'Error analyzing loudness');
  }
}

// Implementation for waveform
export async function ffmpegWaveform(params: InferSchema<typeof waveformSchema>) {
  const { audioUrl, width, height, color } = params;
  const toolName = 'ffmpegWaveform';
  
  try {
    initializeFalClient(toolName);
    debug(toolName, `Generating waveform`, { width, height, color });

    const result = await submitToFal("fal-ai/ffmpeg-api/waveform", { 
      audio_url: audioUrl,
      width,
      height,
      color
    }, toolName);

    return {
      content: [
        { type: "text", text: JSON.stringify(result, null, 2) },
      ],
    };
  } catch (error: any) {
    return formatError(error, 'Error generating waveform');
  }
}

// Implementation for metadata
export async function ffmpegMetadata(params: InferSchema<typeof metadataSchema>) {
  const { mediaUrl } = params;
  const toolName = 'ffmpegMetadata';
  
  try {
    initializeFalClient(toolName);
    debug(toolName, `Extracting metadata from media`);

    const result = await submitToFal("fal-ai/ffmpeg-api/metadata", {
      media_url: mediaUrl
    }, toolName);

    return {
      content: [
        { type: "text", text: JSON.stringify(result, null, 2) },
      ],
    };
  } catch (error: any) {
    return formatError(error, 'Error extracting metadata');
  }
}