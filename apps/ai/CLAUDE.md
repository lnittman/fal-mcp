# fal-mcp AI Service - CLAUDE.md

## Project Purpose
Mastra AI integration service for the fal-mcp-xyz ecosystem. This app demonstrates direct integration with fal.ai APIs through AI agents and provides a foundation for building intelligent applications powered by generative AI models.

## Architecture Overview
This service acts as an AI orchestration layer that:
- Integrates with fal.ai's serverless AI models
- Implements AI agents for various generative tasks
- Provides a standalone Node.js service for AI operations
- Demonstrates best practices for AI integration patterns

## Key Technologies
- **Runtime**: Node.js with TypeScript
- **AI Platform**: fal.ai serverless client
- **Type Safety**: Zod for runtime validation
- **Build**: TSX for development, TSC for production
- **Code Quality**: Biome for linting and formatting

## Development Commands
```bash
# Development
bun dev           # Watch mode with tsx
bun build         # Compile TypeScript
bun start         # Run production build
bun typecheck     # Type validation
bun lint          # Code quality check
bun format        # Auto-format code
```

## Project Structure
```
apps/ai/
├── src/
│   ├── agents/       # AI agent implementations
│   │   └── fal-agent.ts  # Core fal.ai agent
│   └── index.ts      # Service entry point
├── dist/             # Compiled output
├── package.json      # Dependencies
└── tsconfig.json     # TypeScript config
```

## Core Components

### FalAgent (`src/agents/fal-agent.ts`)
Main AI agent that interfaces with fal.ai models:
- Image generation from text prompts
- Video creation and animation
- Audio synthesis and transcription
- Model selection and optimization

### Service Entry (`src/index.ts`)
Bootstraps the AI service and demonstrates usage patterns:
- Environment configuration with dotenv
- Agent initialization
- Example generation workflows

## Configuration
Required environment variables:
- `FAL_API_KEY`: Your fal.ai API key for model access

## Integration Points
- **Shared Package**: Uses `@fal-mcp/ai` for common AI utilities
- **fal.ai Platform**: Direct API integration for model execution
- **Type Safety**: Shared TypeScript configs from workspace

## Development Workflow
1. Set up environment variables in `.env`
2. Run `bun dev` for development with hot reload
3. Test agent functionality with example prompts
4. Build for production with `bun build`
5. Deploy as standalone Node.js service

## Best Practices
- Use Zod schemas for API response validation
- Implement error handling for API failures
- Cache model results when appropriate
- Log AI operations for debugging
- Keep API keys secure and never commit them

## Future Enhancements
- [ ] Add more specialized agents (image editing, style transfer)
- [ ] Implement agent chaining for complex workflows
- [ ] Add observability and monitoring
- [ ] Create REST API endpoints for agent access
- [ ] Integrate with message queue for async processing

## Related Projects
- **apps/mcp**: MCP server for Claude integration
- **packages/ai**: Shared AI utilities and types
- **apps/web**: Frontend for visualizing AI results

---

*This service demonstrates how to build production-ready AI integrations with fal.ai's powerful generative models.*