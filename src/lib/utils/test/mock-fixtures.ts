/**
 * Mock fixtures for testing fal-mcp tools
 */

export const mockUrls = {
  image: "https://fal.media/mock/test-image.png",
  video: "https://fal.media/mock/test-video.mp4",
  audio: "https://fal.media/mock/test-audio.mp3",
  speech: "https://fal.media/mock/test-speech.mp3",
};

export const mockResponses = {
  textToImage: {
    images: [
      {
        url: mockUrls.image,
        width: 1024,
        height: 1024,
        content_type: "image/png",
      },
    ],
  },

  imageToVideo: {
    video: {
      url: mockUrls.video,
      duration: 4,
      fps: 24,
    },
  },

  textToAudio: {
    audio_url: mockUrls.audio,
    duration: 10,
  },

  speechToText: {
    text: "This is a test transcription",
    chunks: [
      { text: "This is a test", timestamp: [0, 2] },
      { text: "transcription", timestamp: [2, 3] },
    ],
  },

  imageToJson: {
    text: "The image shows a red apple on a white table.",
    objects: ["apple", "table"],
    colors: ["red", "white"],
    confidence: 0.95,
  },

  backgroundRemoval: {
    image: {
      url: mockUrls.image.replace(".png", "-nobg.png"),
      content_type: "image/png",
    },
  },

  upscaleImage: {
    image: {
      url: mockUrls.image.replace(".png", "-4x.png"),
      width: 4096,
      height: 4096,
    },
  },
};

export const mockErrors = {
  invalidModel: {
    status: 400,
    message: "Invalid model ID. Model not found.",
  },

  missingParameter: {
    status: 400,
    message: "Missing required parameter 'prompt'",
  },

  rateLimited: {
    status: 429,
    message: "Rate limit exceeded. Please try again later.",
  },

  unauthorized: {
    status: 401,
    message: "Invalid API key",
  },
};

export function createMockToolResponse(type: "success" | "error", data?: any) {
  if (type === "error") {
    return {
      content: [
        {
          type: "text",
          text: data.message || "An error occurred",
        },
      ],
    };
  }

  return {
    content: [
      {
        type: "text",
        text: data.url || JSON.stringify(data, null, 2),
      },
    ],
  };
}
