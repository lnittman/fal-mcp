# Contributing to fal-mcp

Thank you for your interest in contributing to fal-mcp! This guide will help you understand our philosophy and how to contribute effectively.

## Core Principle: Discovery Over Prescription

**The most important rule**: We don't hardcode model-specific behavior. Ever.

### ❌ What NOT to Do

```typescript
// NEVER add model-specific logic
if (model.includes("specific-model")) {
  input.special_parameter = value;
}

// NEVER validate parameters
if (!params.requiredField) {
  throw new Error("Field X is required for model Y");
}

// NEVER create model-specific helpers
function prepareModelXInput(params) { ... }
```

### ✅ What TO Do

```typescript
// Let agents discover parameters
const input = {
  ...parameters,
  // Try common variations
  image_url: url,
  image: url,
  input_image: url,
};

// Pass errors back for agent learning
catch (error) {
  return formatError(error, 'Let the agent learn from this');
}
```

## Types of Contributions

### 1. Adding New Tools

When adding a new tool for a `<format>To<format>` conversion:

```typescript
// src/tools/videoToImage.ts
import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";

export const schema = {
  videoUrl: z.string().describe("URL of the input video"),
  model: z.string()
    .default("fal-ai/video-to-image") // Use a sensible default
    .describe("Any fal-ai model ID for video-to-image conversion"),
  parameters: z.record(z.any()).optional()
    .describe("Additional model-specific parameters to discover"),
};

export const metadata: ToolMetadata = {
  name: "videoToImage",
  description: `Extract frames from video using any fal.ai model.

The agent should discover which models and parameters work best.
Common parameters to try: frame_number, timestamp, format.

Remember: Error messages guide parameter discovery.`,
  annotations: {
    title: "Video to Image (Generic)",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
  },
};

export default async function videoToImage(params: InferSchema<typeof schema>) {
  const { videoUrl, model, parameters = {} } = params;
  
  try {
    await validateModel(model, toolName);
    initializeFalClient(toolName);
    
    // Build input with common parameter variations
    const input = {
      ...parameters,
      video_url: videoUrl,
      video: videoUrl,
      input_video: videoUrl,
    };
    
    const response = await submitToFal(model, input, toolName);
    const imageUrl = extractImageUrl(response, toolName);
    return formatMediaResult(imageUrl);
  } catch (error: any) {
    return formatError(error, 'Error extracting frame');
  }
}
```

### 2. Adding Model Documentation

When you discover how a model works, document it:

```markdown
<!-- src/prompts/models/new-model.md -->
# fal-ai/category/new-model

## Overview
Brief description of what this model does.

## Parameters

### Required
- `param_name` (type): Description

### Optional  
- `param_name` (type): Description
  - Range/Values: ...
  - Default: ...

## Output Schema
```json
{
  "field": "type"
}
```

## Example Usage
```json
{
  "example": "parameters"
}
```

## Tips
- Discovered insights
- Performance notes
- Common pitfalls
```

### 3. Improving Tests

Add tests that validate generic behavior, not model specifics:

```typescript
it('should accept any parameters without validation', async () => {
  const result = await tool({
    model: 'fal-ai/any-model',
    parameters: {
      completely_made_up: true,
      nested: { anything: 'goes' },
    },
  });
  
  // Should not throw validation errors
  expect(result).toBeDefined();
});
```

### 4. Enhancing Mock Responses

Update mock responses based on tool context, not model names:

```typescript
// In tool-base.ts getMockResponse()
if (toolName === 'newFormatTool') {
  return {
    // Generic response structure
    result: { url: `mock://result.format` }
  };
}
```

## Code Style Guidelines

1. **TypeScript**: Use explicit types for parameters
2. **Async/Await**: All tool functions should be async
3. **Error Handling**: Always use try/catch with formatError
4. **Parameter Passing**: Use spread operator for parameters
5. **Comments**: Explain WHY, not WHAT

## Testing Your Changes

```bash
# Run build to check TypeScript
pnpm build

# Run tests
pnpm test

# Test with mock mode
export FAL_MCP_MOCK=true
pnpm dev
```

## Documentation Guidelines

1. **Tool Descriptions**: Focus on capabilities, not specifics
2. **Parameter Hints**: Suggest common names to try
3. **Discovery Guidance**: Explain how to explore, not what to use
4. **Examples**: Show patterns, not prescriptions

## Pull Request Process

1. **Branch**: Create a feature branch from `main`
2. **Commits**: Use clear, descriptive commit messages
3. **Tests**: Add tests for new functionality
4. **Docs**: Update relevant documentation
5. **PR Description**: Explain the why behind your changes

### PR Checklist

- [ ] No hardcoded model-specific logic
- [ ] No parameter validation beyond basic types
- [ ] Tests use generic assertions
- [ ] Documentation encourages discovery
- [ ] Code follows the project style

## Questions?

If you're unsure about an approach:

1. Check [ARCHITECTURE.md](./ARCHITECTURE.md) for philosophy
2. Look at existing tools for patterns
3. Ask in the PR - we're happy to guide!

## Recognition

Contributors who embrace the discovery philosophy and help expand the toolset will be recognized in our README. We especially value:

- Tools for new format conversions
- Model documentation from real discoveries
- Improvements to the discovery experience

Thank you for helping make fal-mcp a truly dynamic, evergreen toolset!