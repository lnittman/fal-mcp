# Troubleshooting Guide

## "Unsupported image type: undefined" Error in Claude Desktop

### Problem
When using fal-mcp tools in Claude Desktop, you may see "Unsupported image type: undefined" errors even though images are being generated successfully.

### What's Actually Happening
- The fal.ai API is working correctly and generating images
- The MCP server is returning the correct response format
- Claude Desktop is having trouble rendering the images

### Temporary Workaround
The tools now include the direct image URL in the text response. You can:
1. Copy the URL from the response
2. Open it in a browser to view the generated image
3. Save the image locally if needed

### Example Response
```
✨ Generated image for: "pixel art penguin"
[Image should appear here]
Image URL: https://v3.fal.media/files/tiger/Y3aRrZy5Dodn1wGsP3Q7v.png
```

### Debugging Tools
We've added two debugging tools to help diagnose the issue:

1. **debug** - Tests different response formats
2. **testImage** - Tests URL vs Markdown image formats

### Known Working Format
The MCP server is using the correct format according to the xmcp specification:
```javascript
{ type: "image", url: "https://..." }
```

### Potential Causes
1. Claude Desktop may have a rendering issue with certain image URLs
2. There might be a version mismatch between the MCP protocol and Claude Desktop
3. CORS or security policies might be blocking image display

### What We've Tried
- ✅ Verified the API is working (images are generated)
- ✅ Confirmed the response format matches xmcp specifications
- ✅ Added URL to text response as a workaround
- ✅ Created debugging tools

### Next Steps
If you continue to experience issues:
1. Check the logs in the Claude Desktop console
2. Try the debug tools to see if any format works
3. Report the issue to Anthropic with the logs

## Other Common Issues

### EPIPE Errors
If you see EPIPE errors in the logs, this usually means Claude Desktop closed the connection. This can happen when:
- Claude Desktop is restarted
- The MCP server is reloaded
- There's a timeout

Solution: Restart Claude Desktop and the error should clear.

### Authentication Errors
If you get 401 or authentication errors:
1. Check your FAL_API_KEY in the config
2. Ensure the key has proper permissions
3. Try regenerating the key at https://fal.ai/dashboard/keys

### Model Not Found Errors
If you get "Model not found" errors:
- The model ID might have changed
- Try using a different model (flux/dev, flux/schnell, etc.)
- Check fal.ai documentation for current model IDs