# Test Suite Documentation

This directory contains the comprehensive test suite for the fal-mcp MCP server, following the discovery-based testing philosophy.

## Directory Structure

```
__tests__/
├── integration/
│   └── workflows.test.ts       # Multi-tool workflow tests
├── tools/                      # Individual tool tests
│   ├── [toolName].test.ts      # One test file per tool
│   └── ... (27 test files)
├── utils/
│   └── tool-base.test.ts       # Base class tests
├── TESTING_ROADMAP.md          # Test implementation plan
└── test-fixes.md               # Recent test refactoring notes
```

## Testing Philosophy

### Discovery-Based Testing
Tests validate the discovery pattern:
```typescript
it('should pass unknown parameters through', async () => {
  const result = await tool.execute({
    prompt: "test",
    unknownParam: "should work",  // Not in schema
    anotherParam: 123            // Also not in schema
  });
  // Tool should attempt with all params
});
```

### Mock Mode Testing
All tests use mock mode to avoid API calls:
```typescript
beforeAll(() => {
  process.env.MOCK_MODE = 'true';
});
```

## Test Categories

### 1. Unit Tests (`/tools/`)
Each tool has its own test file covering:
- **Basic functionality** - Core features work
- **Parameter validation** - Required fields checked
- **Error handling** - Graceful failure modes
- **Mock responses** - Predictable test outputs
- **Discovery pattern** - Unknown params accepted

### 2. Integration Tests (`/integration/`)
Complex multi-tool workflows:
- **Image generation → transformation → animation**
- **Upload → process → download chains**
- **Error propagation across tools**
- **Resource cleanup**

### 3. Utility Tests (`/utils/`)
Core functionality tests:
- **ToolBase** - Base class behavior
- **Error handling** - Standardization works
- **Mock system** - Fixtures return correctly
- **Validation** - Zod schemas work

## Test Implementation Status

### Current Coverage: 18% (4/22 tools)

#### ✅ Completed Tests
1. **textToImage.test.ts** - Image generation
2. **imageToImage.test.ts** - Image transformation  
3. **backgroundRemoval.test.ts** - Background removal
4. **upscaleImage.test.ts** - Image upscaling

#### 🚧 Pending Tests (18 tools)
- Video tools: textToVideo, imageToVideo
- Audio tools: textToSpeech, speechToText, textToAudio, audioToAudio
- Batch tools: batchBackgroundRemoval, batchProcessImages
- Discovery tools: discoverModelsDynamic, listModelsDynamic, recommendModel
- Utility tools: uploadFile, downloadFile, saveImage, workflowChain
- Analysis tools: imageToJson, modelDocs, objectRemoval
- New tools: courseModels, enhancePrompt, getSystemInstructions

## Writing Tests

### Test Template
```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import { ToolName } from '../../src/tools/toolName';

describe('ToolName', () => {
  let tool: ToolName;
  
  beforeAll(() => {
    process.env.MOCK_MODE = 'true';
    tool = new ToolName();
  });
  
  describe('Basic Functionality', () => {
    it('should execute with required parameters', async () => {
      const result = await tool.execute({
        requiredParam: 'value'
      });
      
      expect(result).toHaveProperty('status', 'success');
      expect(result.data).toBeDefined();
    });
  });
  
  describe('Discovery Pattern', () => {
    it('should accept unknown parameters', async () => {
      const result = await tool.execute({
        requiredParam: 'value',
        unknownParam: 'should pass through',
        customOption: true
      });
      
      expect(result.status).toBe('success');
    });
  });
  
  describe('Error Handling', () => {
    it('should handle missing required parameters', async () => {
      const result = await tool.execute({});
      
      expect(result.status).toBe('error');
      expect(result.error).toContain('required');
    });
  });
});
```

### Mock Fixtures
Located in `src/lib/utils/test/mock-fixtures.ts`:
```typescript
export const mockResponses = {
  toolName: {
    success: {
      url: 'https://example.com/result',
      // Tool-specific response
    },
    error: {
      message: 'Mock error for testing'
    }
  }
};
```

## Running Tests

### Commands
```bash
# Run all tests
pnpm test

# Run specific tool tests
pnpm test textToImage

# Run with coverage
pnpm test --coverage

# Watch mode for development
pnpm test --watch

# Run integration tests only
pnpm test integration
```

### Environment Variables
- `MOCK_MODE=true` - Always set for tests
- `FAL_MCP_DEBUG=true` - Enable debug logging
- `TEST_TIMEOUT=30000` - Extended timeout for complex tests

## Test Best Practices

### 1. Test Discovery Pattern
Always verify tools accept unknown parameters:
```typescript
it('should not strip unknown parameters', async () => {
  const spy = vi.spyOn(fal, 'run');
  await tool.execute({
    prompt: 'test',
    customParam: 'value'
  });
  
  expect(spy).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      customParam: 'value'
    })
  );
});
```

### 2. Avoid API-Specific Tests
Don't test for specific API behaviors:
```typescript
// ❌ Bad - Too specific
expect(result.data.model).toBe('flux/dev');

// ✅ Good - General validation
expect(result.data).toHaveProperty('url');
```

### 3. Test Error Learning
Verify tools can learn from errors:
```typescript
it('should expose parameter errors', async () => {
  const result = await tool.execute({
    wrongParam: 'value'
  });
  
  // Error should guide to correct param
  expect(result.error).toMatch(/parameter/i);
});
```

## Integration Test Patterns

### Workflow Testing
```typescript
describe('Image Generation Workflow', () => {
  it('should generate, transform, and animate', async () => {
    // Step 1: Generate
    const generated = await textToImage.execute({
      prompt: 'sunset landscape'
    });
    
    // Step 2: Transform
    const transformed = await imageToImage.execute({
      imageUrl: generated.data.url,
      prompt: 'make it cyberpunk'
    });
    
    // Step 3: Animate
    const animated = await imageToVideo.execute({
      imageUrl: transformed.data.url,
      prompt: 'gentle wind movement'
    });
    
    expect(animated.status).toBe('success');
  });
});
```

## Debugging Tests

### Enable Debug Logging
```typescript
beforeAll(() => {
  process.env.FAL_MCP_DEBUG = 'true';
});
```

### Inspect Mock Calls
```typescript
const spy = vi.spyOn(tool, 'getMockResponse');
await tool.execute(params);
console.log('Mock called with:', spy.mock.calls[0]);
```

### Test Isolation
Each test should be independent:
```typescript
afterEach(() => {
  vi.clearAllMocks();
  // Reset any shared state
});
```

## Contributing Tests

### Priority Order
1. Tools with no tests (0% → basic coverage)
2. High-usage tools (image, video generation)
3. Complex tools (workflowChain, discovery)
4. Edge cases and error paths

### Review Checklist
- [ ] Uses mock mode
- [ ] Tests discovery pattern
- [ ] Handles errors gracefully
- [ ] Includes success and failure cases
- [ ] Documents any special behavior
- [ ] Follows naming conventions

---

*The test suite ensures fal-mcp tools work reliably while maintaining the flexibility of the discovery pattern.*