# AI Utilities Package - CLAUDE.md

## Project Purpose
Shared AI utilities and abstractions for the fal-mcp-xyz ecosystem. This package provides common types, client configurations, and helper functions used across all AI-related applications in the monorepo.

## Architecture Overview
A lightweight package that serves as the foundation for AI operations:
- Type definitions for AI model interactions
- fal.ai client wrapper and configuration
- Shared validation schemas with Zod
- Common error handling patterns
- Reusable AI utility functions

## Key Technologies
- **AI Platform**: fal.ai serverless client
- **Validation**: Zod for schema validation
- **Type Safety**: TypeScript with strict mode
- **Module System**: ESM modules

## Package Structure
```
packages/ai/
├── src/
│   ├── client.ts     # fal.ai client configuration
│   ├── types.ts      # Shared type definitions
│   └── index.ts      # Public API exports
├── package.json      # Dependencies
└── tsconfig.json     # TypeScript config
```

## Core Exports

### Client Module (`src/client.ts`)
fal.ai client configuration and initialization:
- API key management
- Client instance creation
- Request/response interceptors
- Error handling middleware
- Rate limiting logic

### Types Module (`src/types.ts`)
Shared TypeScript definitions:
- Model parameter interfaces
- API response types
- Error types and codes
- Validation schemas
- Utility types for AI operations

## Usage Patterns

### Importing in Apps
```typescript
import { createFalClient, ModelParams } from '@fal-mcp/ai'

const client = createFalClient({
  apiKey: process.env.FAL_API_KEY
})
```

### Type Safety
All AI operations are fully typed:
```typescript
import type { ImageGenerationParams, ModelResponse } from '@fal-mcp/ai'

async function generateImage(params: ImageGenerationParams): Promise<ModelResponse> {
  // Implementation
}
```

## Development Commands
```bash
# Type checking
bun typecheck     # Validate TypeScript
bun lint          # Code quality check
bun format        # Auto-format code
```

## Integration Points
Used by multiple apps in the monorepo:
- **apps/ai**: Direct usage for AI service
- **apps/mcp**: Core dependency for MCP tools
- **apps/web**: Type imports for frontend

## Best Practices
- Export only necessary types and functions
- Keep the package lightweight and focused
- Maintain backward compatibility
- Document all public APIs with JSDoc
- Use Zod for runtime validation

## API Conventions
- Consistent error handling across all clients
- Unified response format for all models
- Standard parameter naming conventions
- Proper TypeScript generics for flexibility

## Future Enhancements
- [ ] Add streaming response support
- [ ] Implement response caching layer
- [ ] Add retry logic with exponential backoff
- [ ] Create model-specific type guards
- [ ] Add telemetry and metrics collection

## Dependencies
Minimal dependencies for maximum compatibility:
- `@fal-ai/serverless-client`: Core fal.ai SDK
- `zod`: Runtime validation

## Version Management
- Follows semantic versioning
- Breaking changes require major version bump
- New features increment minor version
- Bug fixes increment patch version

---

*This package provides the foundational AI utilities that power the entire fal-mcp-xyz ecosystem built for fal.ai.*