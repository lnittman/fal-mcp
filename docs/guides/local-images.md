# Local Image Support

The fal-mcp server now supports processing images directly from your local filesystem, in addition to URLs.

## Using Local Images

### imageToImage Tool

The `imageToImage` tool accepts either:
- `imageUrl`: A URL pointing to an image on the internet
- `imagePath`: A local file path to an image on your machine

**Important**: Use only one of these parameters, not both.

### Examples

**Transform a local image:**
```
"Transform /Users/me/Desktop/vacation.jpg to pixel art style"
```

**Convert a downloaded image:**
```
"Convert ~/Downloads/screenshot.png to look like a watercolor painting"
```

**Apply effects to a photo:**
```
"Add vintage film effects to /Users/me/Pictures/family-photo.jpg"
```

## Supported Image Formats

The tool supports common image formats:
- PNG (.png)
- JPEG (.jpg, .jpeg)
- WebP (.webp)

## How It Works

When you provide a local file path:
1. The tool reads the file from your filesystem
2. Converts it to a base64-encoded data URL
3. Sends it to fal.ai for processing
4. Returns the transformed image URL

## Tips

1. **Use absolute paths**: Always provide the full path to your image
   - Good: `/Users/me/Desktop/image.png`
   - Bad: `image.png` or `./image.png`

2. **Check file existence**: The tool will error if the file doesn't exist

3. **File size**: Large images will take longer to process due to base64 encoding

4. **Privacy**: Local images are uploaded to fal.ai for processing, so avoid sensitive content

## Error Messages

If you see an error like:
- `"File not found: /path/to/image.jpg"` - Check the file path is correct
- `"Either imageUrl or imagePath must be provided"` - Make sure to specify one input
- `"Only one of imageUrl or imagePath should be provided"` - Don't use both parameters

## Batch Processing

The `batchProcessImages` tool also supports local directories:
```
"Convert all images in ~/Desktop/photos to pixel art style"
```

This will process all supported image files in the specified directory.