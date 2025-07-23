# The Discovery Philosophy: A Guide for AI Agents

## Introduction

This guide explains the discovery-based approach used in fal-mcp tools. As an AI agent using these tools, you'll find they work differently from traditional APIs - they empower you to explore and learn rather than constraining you to predefined patterns.

## Core Concept: You Are an Explorer

Traditional approach:
```
Tool says: "For anime images, use model X with parameters Y"
You follow the rules.
```

Discovery approach:
```
Tool says: "Try any fal-ai/* model with any parameters you think might work"
You explore, learn, and build understanding.
```

## How Discovery Works

### 1. Start with Hypotheses

When you need to generate an image:
- Model names often hint at capabilities: `flux`, `stable-diffusion`, `ideogram`
- Try models that sound relevant to your task
- There's no "wrong" choice - every attempt teaches you something

### 2. Learn from Responses

**Success Response:**
```json
{
  "images": [{"url": "https://..."}],
  "parameters_used": {...},
  "model": "fal-ai/flux/dev"
}
```
*Learning: This model works for image generation!*

**Error Response:**
```json
{
  "error": "Missing required parameter 'prompt'",
  "expected_parameters": ["prompt", "image_size", "num_steps"]
}
```
*Learning: Now I know what parameters this model needs!*

### 3. Iterate and Improve

First attempt:
```javascript
{
  model: "fal-ai/flux/dev",
  parameters: {
    text: "A beautiful sunset"  // Guessing parameter name
  }
}
// Error: "Missing required parameter 'prompt'"
```

Second attempt:
```javascript
{
  model: "fal-ai/flux/dev", 
  parameters: {
    prompt: "A beautiful sunset"  // Learned from error!
  }
}
// Success!
```

## Tools for Discovery

### 1. recommendModel
Use this when starting a new task:
```
"I need to generate anime-style images"
→ Provides discovery strategies, not model lists
→ Guides you on HOW to find models, not WHICH to use
```

### 2. listModelsDynamic
Explore available models:
```
"Show me models related to 'video'"
→ Returns patterns you might try
→ Remember: ANY fal-ai/* model could work
```

### 3. modelDocs
Get detailed information when available:
```
modelDocs({ modelId: "fal-ai/flux/dev" })
→ Returns parameter specifications if documented
→ But don't rely on this - models work even without docs
```

### 4. discoverModelsDynamic
Validate and understand models:
```
{ operation: "validate", modelId: "fal-ai/new-model" }
→ Checks if model ID format is valid
→ Infers likely category from name patterns
```

## Discovery Patterns

### Pattern 1: Broad to Specific
```
1. Try textToImage with generic parameters
2. Get error about missing 'image_size'
3. Add image_size parameter
4. Success! Now you know this model's requirements
```

### Pattern 2: Cross-Model Learning
```
1. Learn that flux/dev uses 'prompt' parameter
2. Try flux/schnell - likely uses similar parameters
3. Knowledge compounds across similar models
```

### Pattern 3: Parameter Exploration
```
// The tools send multiple parameter variations:
{
  prompt: "test",        // Some models use this
  text: "test",          // Others might use this  
  description: "test"    // Or this
}
// The API uses whichever it recognizes
```

## Common Discoveries

Through exploration, agents often discover:

- **Image models** often accept: `prompt`, `image_size`, `num_inference_steps`
- **Video models** might use: `duration`, `fps`, `aspect_ratio`
- **Audio models** could need: `text`, `voice`, `language`

But remember: These are patterns, not rules. Always be ready to discover something new!

## Error Messages Are Your Friends

Don't fear errors - they're learning opportunities:

```json
{
  "error": "Invalid parameter 'size'. Did you mean 'image_size'?"
}
```
*This error just taught you the correct parameter name!*

```json
{
  "error": "Model expects 'audio_url' not 'audio'"  
}
```
*Now you know exactly what this model needs!*

## Building Your Knowledge

As you use these tools:

1. **Keep Mental Notes**: Which models work for which tasks
2. **Learn Parameter Patterns**: Similar models often use similar parameters
3. **Share Discoveries**: Use modelDocs findings to help future agents
4. **Stay Curious**: New models appear regularly - explore them!

## The Power of Not Knowing

Traditional systems break when:
- New models are added
- Parameters change
- APIs evolve

Discovery-based systems thrive because:
- Every model works from day one
- Changes become learning opportunities
- You're not limited by outdated documentation

## Best Practices for Agents

1. **Start Simple**: Try basic parameters first
2. **Read Errors Carefully**: They contain valuable information
3. **Build on Success**: What worked before might work again
4. **Experiment Freely**: There are no "wrong" attempts
5. **Trust the Process**: Discovery takes a few tries, but builds lasting knowledge

## Example Discovery Session

```
Task: "Generate a pixel art character"

Attempt 1:
- Model: "fal-ai/pixel-art" (guessing based on task)
- Error: "Model not found"
- Learning: This model doesn't exist

Attempt 2:  
- Model: "fal-ai/flux/dev" (trying a known image model)
- Parameters: { text: "pixel art character" }
- Error: "Missing parameter 'prompt'"
- Learning: Use 'prompt' not 'text'

Attempt 3:
- Model: "fal-ai/flux/dev"
- Parameters: { prompt: "pixel art character, 8-bit style" }
- Success! Generated pixel art
- Learning: Style keywords in prompt work well

Attempt 4:
- Model: "fal-ai/flux/schnell" (trying similar model)
- Parameters: { prompt: "pixel art character, 8-bit style" }  
- Success! Works faster
- Learning: Model variations have different speeds/quality
```

## Conclusion

The discovery philosophy transforms you from a rule-follower to an explorer. Instead of being limited by documentation, you're empowered to discover what's possible. Every error teaches you something, every success builds your knowledge, and every new model is an opportunity to learn.

Remember: In the world of fal-mcp, there are no mistakes - only discoveries!