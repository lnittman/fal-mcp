# Testing Guide for fal-mcp

## Overview

The fal-mcp testing infrastructure allows you to test AI agent interactions with fal.ai tools without incurring API costs. It provides multiple testing approaches:

1. **Unit Tests** - Test individual tools in isolation
2. **Integration Tests** - Test MCP server functionality
3. **Agent Simulation Tests** - Test realistic AI agent workflows
4. **Mock Mode** - Simulate API responses without real calls

## Mock Mode

Set `FAL_MCP_MOCK=true` to enable mock responses:

```bash
export FAL_MCP_MOCK=true
```

In mock mode:
- All API calls return realistic mock responses
- URLs follow the pattern `https://fal.media/mock/{timestamp}/{type}.{ext}`
- Response structure matches real fal.ai API responses
- No API costs incurred

## Running Tests

### 1. Unit Tests (Vitest)

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage
```

### 2. MCP Integration Tests

```bash
# Run MCP client tests
npm run test:mcp

# Run shell-based integration tests
npm run test:integration
```

### 3. Manual Testing with Mock Mode

```bash
# Enable mock mode
export FAL_MCP_MOCK=true

# Build and run the server
npm run build
npm run start-stdio
```

## Testing Strategies

### 1. Parameter Discovery Testing

Test the agent's ability to discover correct parameters:

```typescript
// Agent tries different parameter names
const attempts = [
  { image_url: url },      // Attempt 1
  { image: url },          // Attempt 2  
  { input_image: url },    // Attempt 3
];
```

### 2. Workflow Testing

Test complex multi-step workflows:

```typescript
const workflow = {
  steps: [
    { type: 'generate', model: 'fal-ai/flux/dev', parameters: {...} },
    { type: 'removeBackground', model: 'fal-ai/birefnet' },
    { type: 'animate', model: 'fal-ai/wan-effects', parameters: {...} }
  ]
};
```

### 3. Error Handling

Test various error scenarios:
- Invalid model IDs
- Missing required parameters
- Malformed inputs
- Network failures

## Writing New Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import toolName from '../../tools/toolName';

describe('toolName', () => {
  it('should handle basic input', async () => {
    const result = await toolName({
      // tool parameters
    });
    
    expect(result.content[0].text).toContain('mock');
  });
});
```

### MCP Test Scenario

```typescript
const scenario: TestScenario = {
  name: 'My Test',
  description: 'Test description',
  steps: [
    {
      tool: 'textToImage',
      params: { prompt: 'test' },
      saveResultAs: 'image1'
    },
    {
      tool: 'imageToVideo',
      params: { imageUrl: '{{image1}}' }
    }
  ]
};
```

## Mock Response Patterns

The mock system recognizes model patterns and returns appropriate responses:

| Model Pattern | Mock Response |
|--------------|---------------|
| `text-to-image`, `flux`, `stable-diffusion` | Image URL with metadata |
| `video`, `animate` | Video URL with duration/fps |
| `audio`, `music`, `speech` | Audio URL with duration |
| `whisper`, `transcribe` | Transcription text |
| `background`, `rembg` | Transparent PNG URL |
| `upscale`, `sr`, `aura` | High-res image URL |

## Testing Best Practices

1. **Always test in mock mode first** - Validate logic before using real API
2. **Test parameter discovery** - Ensure agent can find correct params
3. **Test error scenarios** - Verify graceful error handling
4. **Test workflows** - Validate multi-step operations
5. **Use saved results** - Test result passing between steps

## Debugging

Enable debug logs:

```bash
export FAL_MCP_DEBUG=true
```

Debug output includes:
- Tool invocations
- Model selections
- Input parameters
- Mock responses
- Error details

## CI/CD Integration

```yaml
# Example GitHub Actions
- name: Test
  env:
    FAL_MCP_MOCK: true
  run: |
    npm install
    npm run build
    npm test
    npm run test:mcp
```

## Real API Testing

For testing against real fal.ai API:

```bash
# Disable mock mode
unset FAL_MCP_MOCK

# Set real API key
export FAL_API_KEY=your_key_here

# Run specific test
node dist/test-utils/mcp-test-client.js
```

⚠️ **Warning**: Real API testing incurs costs. Use sparingly and only for final validation.