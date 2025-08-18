# Source Code Structure

This directory contains the core implementation of the fal-mcp MCP server.

## Directory Overview

```
src/
├── tools/              # All MCP tool implementations (28 tools)
├── lib/                # Core utilities and shared functionality
├── prompts/            # Prompt templates and model documentation
├── __tests__/          # Test suite with fixtures and utilities
├── index.ts            # Main server entry point
└── middleware.ts       # MCP middleware configuration
```

## Key Entry Points

### `index.ts`
Main server initialization that:
- Sets up MCP server with xmcp
- Registers all tools from `/tools/`
- Configures error handling
- Initializes fal.ai client

### `middleware.ts`
MCP middleware configuration:
- Request/response logging
- Error boundary handling
- Performance monitoring
- Debug mode support

## Implementation Patterns

### Tool Registration
Tools are automatically discovered and registered:
```typescript
// Each tool exports a class extending ToolBase
export class TextToImage extends ToolBase {
  name = "textToImage";
  description = "Generate images from text";
  // Implementation...
}
```

### Error Handling
Standardized error handling across all tools:
```typescript
try {
  const result = await this.executeWithRetry(params);
  return this.formatSuccess(result);
} catch (error) {
  return this.formatError(error);
}
```

### Mock Mode
All tools support mock mode for testing:
```typescript
if (process.env.MOCK_MODE === 'true') {
  return this.getMockResponse(params);
}
```

## Code Organization

### Naming Conventions
- **Tools**: PascalCase classes (e.g., `TextToImage`)
- **Files**: camelCase (e.g., `textToImage.ts`)
- **Test files**: `*.test.ts` pattern
- **Utilities**: Descriptive names (e.g., `tool-base.ts`)

### Import Structure
```typescript
// External dependencies
import { z } from 'zod';

// Internal utilities
import { ToolBase } from '../lib/utils/tool-base';
import { FalClient } from '../lib/fal-client';

// Type imports
import type { ToolInput, ToolOutput } from '../types';
```

## Development Workflow

### Adding New Tools
1. Create new file in `/tools/`
2. Extend `ToolBase` class
3. Define input schema with Zod
4. Implement `execute` method
5. Add tests in `__tests__/tools/`
6. Export from `/tools/index.ts`

### Testing Tools
```bash
# Test specific tool
pnpm test textToImage

# Test with coverage
pnpm test --coverage

# Test in watch mode
pnpm test --watch
```

## Current Development State

### Recently Added (Uncommitted)
- `courseModels.ts` - Interactive model exploration
- `enhancePrompt.ts` - Prompt optimization
- `getSystemInstructions.ts` - System documentation

### Test Coverage Status
- ✅ Tested: imageToImage, textToImage, backgroundRemoval, upscaleImage
- ⏳ Pending: 18 more tools need tests
- 📊 Coverage: 18% (targeting 80%)

### Active Refactoring
- Migration to discovery-based pattern
- Removal of hardcoded model parameters
- Enhanced error messages for learning

## Architecture Decisions

### Discovery Pattern
Tools don't maintain model-specific parameters:
```typescript
// Good - Discovery based
const result = await fal.run(model, params);

// Avoid - Hardcoded
if (model === 'flux/dev') {
  params.num_inference_steps = 28;
}
```

### Parameter Passing
All parameters pass through to fal.ai:
```typescript
async execute(args: any) {
  const { model = this.defaultModel, ...params } = args;
  return await fal.run(model, params);
}
```

### Error Learning
Errors teach correct usage:
```typescript
// API returns: "Invalid parameter: image_url"
// Agent learns to use "imageUrl" instead
```

## Performance Considerations

### Caching
- Results cached for 15 minutes (WebFetch)
- Mock responses cached indefinitely
- No caching for generation tools

### Timeouts
- Default: 5 minutes per operation
- Configurable per tool
- Graceful degradation on timeout

### Concurrency
- Tools can run in parallel
- Rate limiting handled by fal.ai
- Batch operations for efficiency

---

*This directory contains the heart of the MCP server - all tool implementations following a consistent, discoverable pattern.*