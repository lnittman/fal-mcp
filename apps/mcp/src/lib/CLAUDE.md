# Core Library Components

This directory contains the foundational utilities and abstractions that power all MCP tools.

## Directory Structure

```
lib/
├── fal-client.ts           # fal.ai SDK wrapper and client
├── utils/
│   ├── tool-base.ts        # Base class for all tools
│   ├── errors.ts           # Error handling utilities
│   ├── models.ts           # Model-related utilities
│   ├── debug.ts            # Debug logging helpers
│   └── test/               # Testing utilities
│       ├── mcp-test-client.ts   # MCP client for testing
│       ├── mock-fixtures.ts     # Mock responses
│       └── setup.ts             # Test environment setup
```

## Key Components

### `fal-client.ts`
Central client for all fal.ai interactions:

```typescript
export class FalClient {
  // Main execution method
  async run(model: string, params: any): Promise<any>
  
  // Model discovery (TODO)
  async listModels(): Promise<Model[]>
  async searchModels(query: string): Promise<Model[]>
  
  // File operations
  async uploadFile(path: string): Promise<{ url: string }>
}
```

**Key Features:**
- Singleton pattern for resource efficiency
- Automatic retry logic
- Error standardization
- Mock mode support

**Known TODOs:**
- Line 41: Replace with actual fal.ai models API
- Line 106: Implement search when API available

### `utils/tool-base.ts`
Abstract base class providing common functionality:

```typescript
export abstract class ToolBase {
  // Required implementations
  abstract name: string;
  abstract description: string;
  abstract inputSchema: z.ZodType<any>;
  abstract execute(args: any): Promise<any>;
  
  // Provided utilities
  validateInput(args: unknown): any
  formatResponse(data: any): ToolResponse
  formatError(error: any): ToolError
  getMockResponse(args: any): any
  executeWithRetry(fn: () => Promise<any>): Promise<any>
}
```

**Pattern Benefits:**
- Consistent error handling
- Input validation with Zod
- Mock mode for all tools
- Retry logic built-in
- Standardized responses

### `utils/errors.ts`
Comprehensive error handling system:

```typescript
// Error types
export class ToolError extends Error {
  code: string;
  details?: any;
}

// Standardization
export function standardizeError(error: unknown): ToolError

// User-friendly messages
export function formatErrorMessage(error: ToolError): string
```

**Error Categories:**
- `VALIDATION_ERROR` - Input validation failures
- `API_ERROR` - fal.ai API errors
- `NETWORK_ERROR` - Connection issues
- `TIMEOUT_ERROR` - Operation timeouts
- `UNKNOWN_ERROR` - Unexpected failures

### `utils/models.ts`
Model-related utilities and patterns:

```typescript
// Model ID validation
export function isValidModelId(id: string): boolean

// Category inference
export function inferModelCategory(id: string): ModelCategory

// Parameter discovery helpers
export function extractParametersFromError(error: any): string[]
```

**Discovery Support:**
- Model ID pattern matching
- Category detection from ID
- Parameter extraction from errors
- No hardcoded model lists

### `utils/debug.ts`
Debug logging utilities:

```typescript
// Conditional logging
export function debug(...args: any[]): void

// Performance tracking
export function timeOperation<T>(
  name: string, 
  fn: () => Promise<T>
): Promise<T>
```

**Debug Features:**
- Enabled via `FAL_MCP_DEBUG=true`
- Performance measurements
- Detailed error traces
- Parameter logging

## Testing Utilities

### `test/mcp-test-client.ts`
Full MCP client for end-to-end testing:

```typescript
export class MCPTestClient {
  // Tool execution
  async callTool(name: string, args: any): Promise<any>
  
  // Server lifecycle
  async connect(): Promise<void>
  async disconnect(): Promise<void>
  
  // Utilities
  async listTools(): Promise<Tool[]>
}
```

**Test Features:**
- Real MCP protocol testing
- Process management
- Error capture
- Response validation

### `test/mock-fixtures.ts`
Reusable mock responses:

```typescript
export const mockResponses = {
  textToImage: {
    success: { url: "https://example.com/image.png" },
    error: { message: "Invalid prompt" }
  },
  // ... other tools
}
```

### `test/setup.ts`
Test environment configuration:
- Sets `MOCK_MODE=true`
- Configures test timeouts
- Initializes mock client
- Cleans up after tests

## Usage Patterns

### Creating a New Tool
```typescript
import { ToolBase } from '../lib/utils/tool-base';
import { fal } from '../lib/fal-client';
import { z } from 'zod';

export class MyTool extends ToolBase {
  name = "myTool";
  description = "Does something amazing";
  
  inputSchema = z.object({
    required: z.string(),
    optional: z.string().optional()
  });
  
  async execute(args: z.infer<typeof this.inputSchema>) {
    const params = this.validateInput(args);
    
    try {
      const result = await this.executeWithRetry(
        () => fal.run(params.model || 'default', params)
      );
      return this.formatResponse(result);
    } catch (error) {
      return this.formatError(error);
    }
  }
}
```

### Error Handling
```typescript
try {
  // Tool operation
} catch (error) {
  const standardized = standardizeError(error);
  
  // Learn from errors
  if (standardized.code === 'API_ERROR') {
    const params = extractParametersFromError(error);
    // Use params for discovery
  }
  
  return this.formatError(standardized);
}
```

### Mock Mode Testing
```typescript
describe('MyTool', () => {
  beforeAll(() => {
    process.env.MOCK_MODE = 'true';
  });
  
  it('should return mock response', async () => {
    const tool = new MyTool();
    const result = await tool.execute({ required: 'test' });
    expect(result).toMatchObject(mockResponses.myTool.success);
  });
});
```

## Architecture Decisions

### Why ToolBase?
- **Consistency**: All tools behave predictably
- **Maintainability**: Common logic in one place
- **Testability**: Mock mode for all tools
- **Discovery**: Standardized error learning

### Why Zod?
- **Runtime validation**: Catch errors early
- **Type inference**: TypeScript integration
- **Clear schemas**: Self-documenting
- **Error messages**: Helpful for discovery

### Why Singleton Client?
- **Resource efficiency**: One fal.ai connection
- **State management**: Shared configuration
- **Rate limiting**: Centralized control
- **Mock switching**: Easy test mode

## Performance Considerations

- **Retry Logic**: 3 attempts with exponential backoff
- **Timeouts**: 5 minutes default, configurable
- **Caching**: None at library level (tools decide)
- **Concurrency**: Tools can run in parallel

---

*The lib/ directory provides the robust foundation that enables consistent, discoverable, and testable MCP tools.*