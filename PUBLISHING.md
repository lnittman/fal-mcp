# Publishing @fal-ai/mcp to npm

This guide covers publishing the fal-mcp package to npm.

## Prerequisites

1. **npm account**: Create an account at https://www.npmjs.com/
2. **Organization access**: Join the @fal-ai organization on npm
3. **Authentication**: Run `npm login` and authenticate

## Pre-publish Checklist

- [ ] Ensure FAL_API_KEY is removed from any committed files
- [ ] Test the package locally with `npm pack`
- [ ] Verify package.json version is correct
- [ ] Run `npm run build` to create dist files
- [ ] Test installation: `npx @fal-ai/mcp@file:.`

## Publishing Steps

1. **Build the package**:
   ```bash
   npm run build
   ```

2. **Dry run to check what will be published**:
   ```bash
   npm publish --dry-run
   ```

3. **Publish to npm**:
   ```bash
   npm publish --access public
   ```

4. **Verify publication**:
   ```bash
   npm view @fal-ai/mcp
   ```

## Post-publish Testing

1. **Test npx installation**:
   ```bash
   npx @fal-ai/mcp --version
   ```

2. **Test MCP integration**:
   ```bash
   claude mcp add -- npx -y @fal-ai/mcp
   ```

3. **Verify in Claude Desktop**:
   - Open Claude Desktop
   - Check that fal.ai tools appear
   - Test a simple generation

## Version Management

- **Patch releases** (0.1.x): Bug fixes
- **Minor releases** (0.x.0): New features, backward compatible
- **Major releases** (x.0.0): Breaking changes

Update version with:
```bash
npm version patch  # or minor/major
```

## Troubleshooting

### Authentication Issues
```bash
npm whoami  # Check logged in user
npm logout  # If needed
npm login   # Re-authenticate
```

### Scoped Package Issues
Ensure `--access public` flag is used for @fal-ai scoped packages.

### Build Issues
Clean and rebuild:
```bash
rm -rf dist .xmcp
npm run build
```