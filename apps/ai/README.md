# @fal-mcp/ai

Mastra AI integration for the fal.ai ecosystem. This app demonstrates how to use Mastra framework to create intelligent agents that leverage fal.ai's generative AI capabilities.

## Features

- 🎨 Text-to-image generation with natural language
- 🔄 Image transformation and editing
- 🎬 Video generation from text descriptions
- 🤖 Intelligent agent that understands creative intent
- 🔗 Seamless integration with fal.ai MCP server

## Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Add your API keys:
- `FAL_API_KEY`: Your fal.ai API key
- `OPENAI_API_KEY`: Your OpenAI API key for the Mastra agent

3. Install dependencies:
```bash
bun install
```

4. Run the development server:
```bash
bun dev
```

## Usage

The AI agent can be integrated into your applications or used standalone:

```typescript
import { falAgent } from '@fal-mcp/ai/agents/fal-agent'

// Generate an image
const result = await falAgent.generate('Create a cyberpunk cityscape at night')

// The agent will understand your intent and use the appropriate tools
```

## Architecture

This app uses:
- **Mastra**: AI agent framework for building intelligent applications
- **fal.ai**: Lightning-fast generative AI platform
- **OpenAI**: For agent reasoning and natural language understanding

## Development

```bash
# Development mode with hot reload
bun dev

# Build for production
bun build

# Type checking
bun typecheck

# Linting
bun lint
```