# fal-mcp Example Workflows

This document showcases powerful agentic workflows you can achieve by combining fal-mcp tools. These examples demonstrate how LLMs can naturally chain operations through conversational prompts.

## 🎨 Image Generation Workflows

### Basic Generation
```
User: "Generate a cyberpunk cat"
→ Uses: textToImage with prompt "cyberpunk cat"
→ Result: Image URL of a futuristic cat
```

### Style Variations
```
User: "Create a landscape in the style of Van Gogh"
→ Uses: textToImage with prompt "landscape in the style of Van Gogh, swirling brushstrokes, vibrant colors"
→ Result: Impressionist-style landscape
```

### Generation + Transformation Chain
```
User: "Generate a photo of a modern building, then make it look abandoned"
→ Step 1: textToImage "modern glass skyscraper, architectural photography"
→ Step 2: imageToImage with the result URL and prompt "abandoned building, overgrown with vines, broken windows, post-apocalyptic"
→ Result: Transformed dystopian building
```

## 🖼️ Image Editing Workflows

### Style Transfer
```
User: "Take this photo and make it look like pixel art"
→ Uses: imageToImage with prompt "convert to pixel art, 8-bit style, retro game aesthetic"
→ Result: Pixelated version of the image
```

### Artistic Transformations
```
User: "Transform my portrait into different art styles"
→ Chain multiple imageToImage calls:
  1. "oil painting style, thick brushstrokes"
  2. "watercolor style, soft edges, flowing colors"
  3. "comic book style, bold lines, cel shading"
→ Result: Multiple artistic versions
```

## 📁 Batch Processing Workflows

### Folder Style Conversion
```
User: "Convert all images in ~/vacation-photos to vintage style"
→ Uses: batchProcessImages with:
  - directory: "~/vacation-photos"
  - actionPrompt: "vintage photo style, faded colors, film grain, 1970s aesthetic"
→ Result: All photos transformed with vintage look
```

### Batch Enhancement
```
User: "Enhance all product images in ~/shop/products"
→ Uses: batchProcessImages with:
  - directory: "~/shop/products"
  - actionPrompt: "enhance lighting, increase sharpness, professional product photography"
→ Result: Professional-looking product images
```

## 🎬 Video Generation Workflows

### Text to Video
```
User: "Create a video of waves crashing on a beach at sunset"
→ Uses: textToVideo with:
  - prompt: "waves crashing on beach at sunset, golden hour, cinematic"
  - duration: 5
  - aspectRatio: "16:9"
→ Result: Serene beach video
```

### Image Animation
```
User: "Animate this landscape photo with gentle wind"
→ Uses: imageToVideo with:
  - imageUrl: [photo URL]
  - motionPrompt: "gentle wind blowing through trees, leaves rustling"
  - duration: 3
→ Result: Subtly animated landscape
```

## 🎙️ Audio Workflows

### Multi-language Narration
```
User: "Create narration for my video in English and Spanish"
→ Step 1: textToSpeech with text in English, voice "nova"
→ Step 2: textToSpeech with translated text, voice "female1", language "es"
→ Result: Two audio files for different markets
```

### Transcription + Translation
```
User: "Transcribe this Spanish podcast and translate to English"
→ Uses: speechToText with:
  - audioUrl: [podcast URL]
  - task: "translate"
→ Result: English transcription of Spanish audio
```

## 🔗 Complex Multi-Tool Chains

### Complete Brand Asset Generation
```
User: "Create a logo for 'TechNova' startup and prepare all brand assets"

Chain:
1. textToImage: "minimalist tech logo, TechNova text, circuit pattern, blue gradient"
2. saveImage: Save as base logo at 1024x1024
3. imageToImage: "add subtle glow effect, premium feel"
4. saveImage with faviconSizes: true → Creates 16x16, 32x32, 48x48 versions
5. imageToImage: "convert to black and white version"
6. saveImage: Save monochrome variant
```

### Content Creation Pipeline
```
User: "Create a social media post about AI art"

Chain:
1. textToImage: "abstract representation of AI creating art, neural networks, colorful"
2. imageToImage: "add Instagram-friendly square crop, enhance colors"
3. textToSpeech: "AI is revolutionizing creative expression..." → Creates voiceover
4. textToVideo: "AI neural network creating art, abstract visualization" → B-roll footage
```

### Batch Processing + Individual Edits
```
User: "Process my travel photos: vintage style for all, then make the sunset ones more dramatic"

Chain:
1. batchProcessImages: directory "~/travel", actionPrompt "vintage film photography"
2. For sunset images:
   - imageToImage: "enhance sunset, dramatic sky, golden hour intensified"
   - saveImage: Save enhanced versions
```

## 💡 Pro Tips

### Prompt Engineering
- Be specific about styles: "pixel art" → "8-bit pixel art, limited color palette, retro game style"
- Combine attributes: "cyberpunk cat, neon lights, rain, blade runner aesthetic"
- Use art references: "in the style of Studio Ghibli", "like a Banksy stencil"

### Chaining Best Practices
- Save intermediate results with saveImage for non-destructive editing
- Use consistent styling across batches by reusing successful prompts
- Combine different models for best results (e.g., FLUX for creation, Kontext for edits)

### Performance Optimization
- Process similar operations in batches rather than individually
- Use appropriate image sizes - larger isn't always better
- Cache frequently used assets locally with saveImage

## 🚀 Advanced Patterns

### Conditional Processing
```
"For each image in ~/products:
 - If it's a shoe, add 'white background, product photography'
 - If it's clothing, add 'on mannequin, studio lighting'"
```

### Style Consistency
```
"Generate 5 images for my story, all in consistent art style:
 1. 'medieval castle, morning' 
 2. 'knight on horseback'
 3. 'dragon in cave'
 All with: 'watercolor illustration, children's book style, soft pastels'"
```

### Multi-format Export
```
"Create app icon:
 1. Generate 'friendly robot assistant, app icon style'
 2. Save as 1024x1024 PNG
 3. Create rounded corner version
 4. Export as favicon set
 5. Create monochrome version for notifications"
```

## 🌟 Community Workflows

Share your creative workflows! These tools are designed to be combined in unexpected ways. Some community favorites:

- **Meme Generator**: Generate base image → Add text overlay style → Save multiple formats
- **Story Illustrator**: Generate scene images → Apply consistent art style → Create video transitions
- **Brand Refresher**: Take old logo → Modernize with AI → Generate full asset suite
- **Language Learning**: Generate image → Create descriptions in multiple languages → Add audio narration

The possibilities are endless when you combine these tools creatively!