# Design System Package - CLAUDE.md

## Project Purpose
Shared design system components and utilities for the fal-mcp-xyz ecosystem. This package provides a consistent, reusable component library built on Radix UI primitives with Tailwind CSS styling utilities.

## Architecture Overview
A modern React component library that:
- Wraps Radix UI primitives for accessibility
- Uses CVA (Class Variance Authority) for variant management
- Provides Tailwind merge utilities for className composition
- Exports ready-to-use, styled components
- Maintains design consistency across apps

## Key Technologies
- **Components**: Radix UI for accessible primitives
- **Styling**: Tailwind CSS with custom utilities
- **Variants**: Class Variance Authority (CVA)
- **Runtime**: React 19 with TypeScript
- **Utils**: clsx and tailwind-merge

## Package Structure
```
packages/design/
├── src/
│   ├── lib/
│   │   └── utils.ts      # Tailwind utilities
│   └── index.ts          # Public exports
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript config
```

## Core Utilities

### Utils Module (`src/lib/utils.ts`)
Essential styling utilities:
- `cn()`: Combines clsx and tailwind-merge for safe className merging
- Prevents Tailwind class conflicts
- Handles conditional classes
- Supports variant composition

## Usage Patterns

### Importing Components
```typescript
import { cn } from '@fal-mcp/design'

// Use in components
<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className
)} />
```

### Creating Variants
```typescript
const buttonVariants = cva(
  "base-button-styles",
  {
    variants: {
      variant: {
        default: "default-styles",
        outline: "outline-styles"
      },
      size: {
        sm: "small-size",
        lg: "large-size"
      }
    }
  }
)
```

## Component Guidelines

### Accessibility First
- All components built on Radix UI primitives
- Full keyboard navigation support
- ARIA attributes properly managed
- Screen reader optimized

### Styling Philosophy
- Utility-first with Tailwind CSS
- Consistent spacing and sizing scales
- Dark mode support ready
- Responsive by default

### Component API Design
- Props extend native HTML elements
- ForwardRef for all components
- Compound component patterns
- Controlled and uncontrolled modes

## Development Commands
```bash
# Type checking
pnpm typecheck     # Validate TypeScript
pnpm lint          # Code quality check
pnpm format        # Auto-format code
```

## Integration Points
Used across the monorepo:
- **apps/web**: Primary consumer of components
- **apps/mcp**: UI for web interface
- Future apps will import from here

## Best Practices
- Keep components pure and stateless when possible
- Use forwardRef for DOM element access
- Provide sensible defaults
- Document all props with TypeScript
- Include usage examples in comments

## Design Tokens
Managed through Tailwind config:
- Color palette
- Typography scales
- Spacing system
- Border radius values
- Shadow definitions
- Animation timings

## Performance Considerations
- Tree-shakeable exports
- Minimal runtime overhead
- CSS-in-JS avoided for performance
- Tailwind purging for production

## Future Enhancements
- [ ] Add Storybook for component documentation
- [ ] Create more complex compound components
- [ ] Add animation variants with Framer Motion
- [ ] Build form components with react-hook-form
- [ ] Add theme customization API
- [ ] Create component playground

## Peer Dependencies
Requires host apps to provide:
- `react`: ^19.0.0
- `react-dom`: ^19.0.0

## Component Checklist
When adding new components:
- [ ] Built on Radix UI primitive
- [ ] TypeScript props interface
- [ ] ForwardRef implementation
- [ ] Variant support with CVA
- [ ] Accessibility tested
- [ ] Responsive design
- [ ] Dark mode support
- [ ] Documentation comments

---

*This design system ensures visual consistency and accessibility across all fal-mcp-xyz applications.*