# TypeScript Config Package - CLAUDE.md

## Project Purpose
Shared TypeScript configurations for the fal-mcp-xyz monorepo. This package provides consistent, reusable TypeScript settings across all applications and packages, ensuring type safety and build consistency.

## Architecture Overview
A configuration package that provides:
- Base TypeScript configuration with strict settings
- Specialized configs for different environments (Node.js, Next.js)
- Consistent compiler options across the monorepo
- Path mappings and module resolution settings

## Package Structure
```
packages/typescript-config/
├── base.json         # Base configuration
├── nextjs.json       # Next.js specific config
├── node.json         # Node.js specific config
└── package.json      # Package metadata
```

## Configuration Files

### Base Config (`base.json`)
Core TypeScript settings inherited by all projects:
- Strict mode enabled for maximum type safety
- ESNext target for modern JavaScript features
- Module resolution for workspace packages
- Source map generation for debugging
- Declaration files for type exports

### Next.js Config (`nextjs.json`)
Extends base with Next.js optimizations:
- JSX support for React components
- Path aliases for imports
- Incremental compilation
- Next.js specific module resolution
- Plugin support for styled components

### Node.js Config (`node.json`)
Extends base for Node.js services:
- CommonJS/ESM interop
- Node.js type definitions
- Appropriate target for Node runtime
- Module resolution for npm packages

## Usage Patterns

### In Applications
```json
// apps/*/tsconfig.json
{
  "extends": "@fal-mcp/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### In Packages
```json
// packages/*/tsconfig.json
{
  "extends": "@fal-mcp/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

## Compiler Options

### Strictness Settings
- `strict`: true - Enable all strict checks
- `noImplicitAny`: true - Error on expressions with 'any'
- `strictNullChecks`: true - Null/undefined checking
- `strictFunctionTypes`: true - Strict function signatures
- `noUnusedLocals`: true - Error on unused variables

### Module Settings
- `module`: "ESNext" - Modern module syntax
- `moduleResolution`: "bundler" - For build tools
- `esModuleInterop`: true - CommonJS compatibility
- `resolveJsonModule`: true - Import JSON files

### Output Settings
- `declaration`: true - Generate .d.ts files
- `declarationMap`: true - Source maps for declarations
- `sourceMap`: true - Debugging support
- `incremental`: true - Faster rebuilds

## Best Practices
- Extend configs rather than duplicating settings
- Override only what's necessary for specific needs
- Keep configurations minimal and focused
- Document any unusual overrides
- Regularly update TypeScript version

## Integration Benefits
- **Consistency**: Same rules across all projects
- **Maintenance**: Update in one place
- **Type Safety**: Strict mode prevents bugs
- **Developer Experience**: Better IDE support
- **Build Performance**: Optimized settings

## Migration Guide
When adding to existing projects:
1. Install package: `bun add -D @fal-mcp/typescript-config`
2. Update tsconfig.json to extend appropriate config
3. Remove redundant local settings
4. Fix any new type errors from strict mode
5. Benefit from improved type safety

## Version Management
- TypeScript version pinned in workspace root
- Config changes follow semantic versioning
- Breaking changes documented in changelog
- Gradual migration path for updates

## Troubleshooting

### Common Issues
- **Module not found**: Check path mappings
- **Type errors**: Strict mode may reveal issues
- **Build failures**: Verify extends path is correct
- **IDE problems**: Restart TypeScript service

### Debug Settings
For troubleshooting, temporarily add:
```json
{
  "compilerOptions": {
    "traceResolution": true,
    "listFiles": true
  }
}
```

## Future Enhancements
- [ ] Add React Native configuration
- [ ] Create Deno-specific config
- [ ] Add stricter lint-like rules
- [ ] Provide migration scripts
- [ ] Add configuration validator

---

*This package ensures TypeScript consistency and type safety across the entire fal-mcp-xyz ecosystem.*