# fal-mcp Web Application - CLAUDE.md

## Project Purpose
Modern Next.js web application showcasing the fal-mcp-xyz ecosystem. This app provides a beautiful, immersive landing page with documentation and integration guides for the fal-mcp Model Context Protocol server.

## Architecture Overview
A production-ready Next.js 15 application featuring:
- Server components with React 19
- Beautiful motion design with Framer Motion and Lenis smooth scrolling
- Comprehensive UI component library with Radix UI
- Documentation pages for MCP integration
- API routes for server-side MCP operations

## Key Technologies
- **Framework**: Next.js 15 with App Router
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with custom animations
- **Motion**: Framer Motion + Lenis for smooth scrolling
- **Icons**: Lucide React for consistent iconography
- **Type Safety**: TypeScript throughout

## Development Commands
```bash
# Development
```bash
# Development
pnpm dev           # Start dev server on port 3001
pnpm build         # Production build
pnpm start         # Run production server
pnpm lint          # Biome linting
pnpm format        # Auto-format code
pnpm typecheck     # TypeScript validation
```


## Project Structure
```
apps/web/
├── app/
│   ├── api/
│   │   └── mcp/          # MCP API endpoints
│   ├── docs/             # Documentation pages
│   │   └── tools/        # Tool reference
│   ├── fonts/            # Custom typography
│   ├── providers/        # React context providers
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # Reusable UI components
│   ├── motion/           # Animation components
│   ├── navigation/       # Navigation elements
│   └── icons/            # Custom icons
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and helpers
└── public/               # Static assets
```

## Core Pages

### Landing Page (`app/page.tsx`)
Immersive home page featuring:
- Floating header with smooth scroll effects
- MCP client configuration guides
- Interactive code snippets with copy functionality
- Capability showcase with beautiful cards
- Smooth Lenis scrolling experience

### Documentation (`app/docs/`)
Comprehensive guides for:
- MCP server setup and configuration
- Tool reference and capabilities
- Integration patterns and best practices

### API Routes (`app/api/mcp/`)
Server-side MCP operations:
- Proxy requests to MCP server
- Handle authentication
- Process tool executions

## UI Component Library
Built with Radix UI and CVA for flexibility:
- **Button**: Multiple variants (default, destructive, outline, ghost)
- **Card**: Content containers with consistent styling
- **Dialog**: Modal interactions
- **Toast**: Notification system
- **Badge**: Status indicators
- **Input/Textarea**: Form controls
- **Dropdown/Context Menu**: Interactive menus

## Design System

### Typography
Custom font stack with multiple weights:
- **Geist**: Primary sans-serif
- **CX80**: Display font for headings
- **Louize**: Condensed display font
- **Focal/HAL/Commit**: Brand fonts from fal.ai

### Color Palette
Clean, minimal design:
- Pure white backgrounds
- High contrast text
- Subtle borders and shadows
- Accent colors for CTAs

### Motion Design
Sophisticated animations:
- Lenis smooth scrolling
- Framer Motion page transitions
- Micro-interactions on hover
- Staggered fade-in effects

## Configuration Examples
The app provides copy-paste configs for:
- **Claude Desktop**: Anthropic's desktop application
- **Cursor**: AI-first code editor
- **Windsurf**: Modern AI IDE

## Development Workflow
1. Start dev server with `pnpm dev`
2. Edit components in `components/ui/`
3. Add new pages in `app/` directory
4. Test responsive design across breakpoints
5. Build for production with `pnpm build`

## Performance Optimizations
- Next.js App Router for optimal loading
- React Server Components by default
- Font optimization with next/font
- Image optimization with next/image
- Code splitting and lazy loading

## Deployment
Configured for Vercel deployment:
- Automatic preview deployments
- Edge runtime support
- Environment variable management
- Analytics and monitoring

## Best Practices
- Use Server Components for static content
- Client Components only when needed
- Implement proper error boundaries
- Add loading states for async operations
- Ensure full accessibility compliance
- Test across all major browsers

## Future Enhancements
- [ ] Add interactive AI demos
- [ ] Implement user authentication
- [ ] Create dashboard for API usage
- [ ] Add blog for updates and tutorials
- [ ] Integrate analytics and tracking
- [ ] Build component playground

## Related Projects
- **apps/mcp**: Backend MCP server
- **apps/ai**: AI service integration
- **packages/design**: Shared design system

---

*This web application serves as the primary interface for users to discover and integrate with the fal-mcp ecosystem built for fal.ai.*