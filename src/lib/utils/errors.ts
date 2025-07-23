/**
 * Utility functions for consistent error handling across all tools
 */

export interface SerializedError {
  message: string;
  statusCode?: number;
}

/**
 * Extracts a meaningful error message from various error types
 */
export function extractErrorInfo(error: any): SerializedError {
  let message = 'Unknown error';
  let statusCode: number | undefined;

  // Handle different error structures
  if (typeof error === 'string') {
    message = error;
  } else if (error?.message) {
    message = error.message;
  } else if (error?.detail) {
    message = error.detail;
  } else if (error?.error) {
    message = error.error;
  } else if (Array.isArray(error)) {
    message = error.map(e => extractErrorInfo(e).message).join(', ');
  } else if (error && typeof error === 'object') {
    // Try to extract any meaningful property
    const keys = Object.keys(error);
    if (keys.length > 0) {
      // Look for common error properties
      for (const key of ['message', 'error', 'detail', 'description', 'msg']) {
        if (error[key]) {
          message = String(error[key]);
          break;
        }
      }
      // If no common property found, stringify the object
      if (message === 'Unknown error') {
        try {
          message = JSON.stringify(error, null, 2);
        } catch {
          message = 'Error object could not be serialized';
        }
      }
    }
  }

  // Extract status code from various sources
  if (error?.response?.status) {
    statusCode = error.response.status;
    // Also check for error message in response
    if (error.response.data?.message) {
      message = error.response.data.message;
    } else if (error.response.data?.error) {
      message = error.response.data.error;
    } else if (error.response.data?.detail) {
      message = error.response.data.detail;
    }
  } else if (error?.status) {
    statusCode = error.status;
  } else if (error?.statusCode) {
    statusCode = error.statusCode;
  }

  // Handle specific error types
  if (statusCode === 404 || message.includes('Not Found') || (message.includes('Application') && message.includes('not found'))) {
    message = `Model not found. This might be due to:
- Invalid model ID
- Model deprecated or renamed
- API key doesn't have access to this model

Try using a different model or check fal.ai documentation for current model IDs.`;
  } else if (statusCode === 401 || message.includes('Unauthorized') || message.includes('Authentication')) {
    message = 'Authentication failed. Please check your FAL_API_KEY.';
  } else if (statusCode === 422 || message.includes('Unprocessable')) {
    message = 'Invalid input parameters. Please check your request.';
  } else if (statusCode === 429 || message.includes('Rate limit')) {
    message = 'Rate limit exceeded. Please try again later.';
  } else if (statusCode === 500 || message.includes('Internal')) {
    message = 'Server error. Please try again or contact support.';
  }

  return { message, statusCode };
}

/**
 * Formats an error for display in tool output
 */
export function formatErrorMessage(prefix: string, error: any): string {
  const { message, statusCode } = extractErrorInfo(error);
  return `❌ ${prefix}${statusCode ? ` (${statusCode})` : ''}: ${message}`;
}