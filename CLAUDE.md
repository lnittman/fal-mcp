# fal-mcp MCP Server

AI-powered image, video, and audio generation through natural language, designed for Claude and other MCP-compatible clients.

## Project Overview

This is a Model Context Protocol (MCP) server that provides access to fal.ai's comprehensive suite of AI models. The architecture follows a **discovery-based approach** where tools don't hardcode model-specific parameters, allowing seamless support for new models without code changes.

### Core Philosophy

**Discovery Over Prescription**: Rather than maintaining hardcoded parameter lists, the tools accept any parameters and let the fal.ai API guide agents through error messages. This ensures:
- Zero maintenance as new models are released
- Agents learn optimal parameters through experimentation
- True dynamic model support without version drift

## Quick Start for AI Agents

### Key Commands
```bash
# Development
pnpm dev          # Start development server
pnpm test         # Run test suite (currently 18% coverage)
pnpm check        # Lint and format with Biome

# Production
pnpm build        # Build for production
pnpm start        # HTTP server mode
pnpm start-stdio  # STDIO mode for Claude Desktop
```

### Essential Configuration
- **Required**: `FAL_API_KEY` environment variable
- **Optional**: `MOCK_MODE=true` for testing without API calls
- **Debug**: `FAL_MCP_DEBUG=true` for verbose logging

## Architecture Overview

### Tool Categories

1. **Image Generation & Processing** (`/src/tools/`)
   - `textToImage.ts` - Generate images from prompts
   - `imageToImage.ts` - Transform existing images
   - `backgroundRemoval.ts` - Remove backgrounds
   - `objectRemoval.ts` - AI-powered inpainting
   - `upscaleImage.ts` - Enhance resolution
   - `batchProcessImages.ts` - Bulk transformations

2. **Video Tools**
   - `textToVideo.ts` - Generate videos from text
   - `imageToVideo.ts` - Animate static images

3. **Audio Tools**
   - `textToSpeech.ts` - Natural voice synthesis
   - `speechToText.ts` - Transcription (100+ languages)
   - `textToAudio.ts` - Music generation
   - `audioToAudio.ts` - Audio transformations

4. **Discovery & Utility Tools**
   - `discoverModelsDynamic.ts` - Model exploration
   - `recommendModel.ts` - Usage guidance
   - `workflowChain.ts` - Multi-step pipelines
   - `enhancePrompt.ts` - Prompt optimization

### Core Libraries (`/src/lib/`)
- `fal-client.ts` - fal.ai SDK wrapper
- `utils/tool-base.ts` - Base class for all tools
- `utils/errors.ts` - Standardized error handling
- `utils/models.ts` - Model utilities

## Development Patterns

### Tool Development

All tools extend `ToolBase` class:
```typescript
export class MyTool extends ToolBase {
  // Schema validation with Zod
  inputSchema = z.object({
    requiredParam: z.string(),
    optionalParam: z.string().optional()
  });
  
  // Tool implementation
  async execute(args: ToolInput): Promise<ToolOutput> {
    // Validate inputs
    const params = this.validateInput(args);
    
    // Call fal.ai with discovery pattern
    const result = await fal.run(model, {
      ...params,
      // Pass all parameters through
    });
    
    return this.formatResponse(result);
  }
}
```

### Testing Approach

Tests use mock mode to avoid API calls:
```typescript
describe('MyTool', () => {
  beforeAll(() => {
    process.env.MOCK_MODE = 'true';
  });
  
  it('should handle basic functionality', async () => {
    const tool = new MyTool();
    const result = await tool.execute({ /* params */ });
    expect(result).toMatchSnapshot();
  });
});
```

## Current State & Priorities

### Active Development
- 70 uncommitted changes across all areas
- Major refactor recently completed for dynamic model support
- Test coverage at 18% (4 of 22 tools tested)

### Immediate Priorities
1. Complete test coverage for remaining tools
2. Add new tools: courseModels, enhancePrompt, getSystemInstructions
3. Document discovered model parameters

### Known TODOs
- `fal-client.ts:41` - Replace with actual fal.ai models API when available
- `fal-client.ts:106` - Implement when fal.ai provides a search API

## Working with This Codebase

### Discovery Pattern Example

When implementing new functionality:
1. Start with minimal parameters
2. Let error messages guide you
3. Document discovered parameters
4. Share learnings in model docs

### Common Model Patterns

Through discovery, these parameter patterns emerge:
- `prompt` - Text description for generation
- `image_url`, `imageUrl` - Input images
- `strength` - Transformation intensity (0-1)
- `num_inference_steps` - Quality/speed tradeoff
- `guidance_scale` - Prompt adherence
- `seed` - Reproducible results

### Error Handling

All tools provide helpful error messages:
- Parameter validation errors include valid options
- API errors reveal correct parameter names
- Discovery errors guide to working solutions

## Navigation Guide

### Primary Workflows
1. **Generate Image**: Start with `textToImage`
2. **Process Image**: Use `imageToImage` for transformations
3. **Remove Background**: `backgroundRemoval` or `batchBackgroundRemoval`
4. **Create Video**: `textToVideo` or animate with `imageToVideo`
5. **Audio Work**: `textToSpeech`, `speechToText`, `textToAudio`

### Advanced Workflows
- Chain operations with `workflowChain`
- Optimize prompts with `enhancePrompt`
- Explore models with `discoverModelsDynamic`
- Get guidance with `recommendModel`

## Quality Standards

Before committing:
- [ ] TypeScript compiles (`pnpm build`)
- [ ] Biome passes (`pnpm check`)
- [ ] Tests pass (`pnpm test`)
- [ ] No console.log statements
- [ ] Error handling implemented
- [ ] Mock mode supported for testing

## Integration Points

### MCP Clients
- Claude Desktop (STDIO mode)
- Custom MCP clients (HTTP mode)
- Test clients (`mcp-test-client.ts`)

### fal.ai Platform
- All models accessible without hardcoding
- Real-time model availability
- Storage URLs for file handling

---

*This CLAUDE.md provides AI agents with comprehensive understanding of the fal-mcp codebase structure, patterns, and current state.*