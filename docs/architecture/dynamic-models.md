# Dynamic Models Architecture

## Overview

The fal-MCP system implements a truly dynamic model discovery system that removes the need for hardcoded model lists and provides instant access to all current and future models on fal.ai.

## The Philosophy

> "The best model list is no model list at all."

By removing hardcoded databases, we've created a system that:

- Never becomes outdated
- Requires zero maintenance
- Supports all current and future models
- Is truly dynamic in every sense

## How It Works

### 1. No More Hardcoded Lists

**Before (Hardcoded Enums):**

```typescript
// Old way - limited to predefined models
model: z.enum([
  "fal-ai/flux/dev",
  "fal-ai/flux/schnell",
  "fal-ai/flux-pro/v1.1-ultra"
])
```

**After (Dynamic Strings):**

```typescript
// New way - accepts any valid model ID
model: z.string()
  .default("fal-ai/flux/dev")
  .describe("Any fal-ai model ID. ALL models work!")
```

### 2. Runtime Validation

The system:

1. **Accepts ANY model ID** starting with `fal-ai/`
2. **Validates at runtime** when you actually use the model
3. **Never needs updates** for new models
4. **Works instantly** with any new model fal.ai releases

### 3. Discovery Tools

While we don't maintain hardcoded lists, we provide powerful discovery tools:

#### `discoverModels` - Advanced Discovery

- **Operations**: list, search, suggest, validate
- **Features**:
  - Browse models by category
  - Search across all models
  - Get personalized recommendations
  - Validate model IDs

#### `listModels` - Simple Discovery

- Quick model listing by category
- Search functionality
- Lightweight alternative

## Benefits

1. **Zero Maintenance**: No database to update
2. **Always Current**: New models work immediately
3. **Truly Dynamic**: No limitations whatsoever
4. **Future Proof**: Works with models that don't exist yet
5. **Access to All Models**: Use any of the 100+ models on fal.ai
6. **Better Discovery**: Find the perfect model for any use case

## Usage Examples

### Basic Usage

```javascript
// Use ANY model you find on fal.ai
{
  "prompt": "sunset over mountains",
  "model": "fal-ai/brand-new-model-2025"  // Works immediately!
}
```

### Discovery Workflow

```javascript
// 1. Discover models
{
  "tool": "discoverModels",
  "operation": "search",
  "query": "anime"
}

// 2. Use discovered model
{
  "prompt": "anime character",
  "model": "fal-ai/anime-diffusion-xl"
}
```

### Migration from Hardcoded Models

**Before:**

```javascript
// Limited to 7 hardcoded models
{
  "prompt": "a beautiful sunset",
  "model": "fal-ai/flux/dev"  // Had to be one of the enum values
}
```

**After:**

```javascript
// Can use any valid text-to-image model
{
  "prompt": "a beautiful sunset", 
  "model": "fal-ai/stable-diffusion-v35-large"  // Any valid model ID
}
```

## Implementation Details

### Updated Tools

All major tools now support dynamic models:

- `textToImage` - Accept any text-to-image model
- `imageToVideo` - Accept any image-to-video model
- `upscaleImage` - Accept any upscaling model
- `backgroundRemoval` - Accept any segmentation model
- All other tools similarly updated

### Model Validation

- Model IDs are validated at runtime
- Helpful error messages for invalid models
- Automatic fallback suggestions

### Discovery Helpers

While we don't have hardcoded lists, we provide:

1. **Pattern Suggestions**: Common model naming patterns
2. **Category Inference**: Guess category from model ID
3. **Use Case Guidance**: Suggestions based on what you want to do

## Getting Started

1. Visit [fal.ai](https://fal.ai)
2. Find any model
3. Use its ID directly
4. It just works!

No more waiting for MCP updates to use new models. True dynamic discovery means the future is always available today.
