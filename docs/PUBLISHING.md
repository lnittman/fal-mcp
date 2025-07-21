# Publishing to NPM

This guide covers how to publish @fal-ai/mcp to npm for use with `claude mcp add`.

## Pre-publish Checklist

- [ ] All tools tested and working
- [ ] Documentation complete
- [ ] Version number updated in package.json
- [ ] API key handling tested
- [ ] Build succeeds without errors

## Build and Test

```bash
# Build the project
pnpm build

# Test the STDIO server locally
FAL_API_KEY=your-test-key node dist/stdio.js
```

## Local Testing with npx

Before publishing, test the npx execution:

```bash
# Create a local npm package
npm pack

# Test with npx (from another directory)
cd /tmp
npx /path/to/fal-ai-mcp-0.1.0.tgz

# This should fail with API key message if not set
FAL_API_KEY=test-key npx /path/to/fal-ai-mcp-0.1.0.tgz
```

## Publishing to NPM

1. **Login to npm** (requires access to @fal-ai scope):
   ```bash
   npm login --scope=@fal-ai
   ```

2. **Publish as public package**:
   ```bash
   npm publish --access public
   ```

3. **Verify installation**:
   ```bash
   # Test direct execution
   npx @fal-ai/mcp

   # Test with Claude
   claude mcp add fal -- npx -y @fal-ai/mcp
   ```

## Post-publish

1. Update GitHub releases
2. Announce on social media
3. Update fal.ai documentation

## Version Management

Follow semantic versioning:
- Patch (0.1.1): Bug fixes, dependency updates
- Minor (0.2.0): New tools, non-breaking features
- Major (1.0.0): Breaking changes to tool interfaces

## Troubleshooting

### "Permission denied" when running npx

The dist/stdio.js file needs executable permissions:
```bash
chmod +x dist/stdio.js
```

### API key not found

Ensure the middleware properly checks:
1. process.env.FAL_API_KEY
2. Headers for HTTP mode
3. Opens browser in STDIO mode if missing

### Claude can't find tools

Verify the MCP server starts correctly:
```bash
echo '{"jsonrpc": "2.0", "method": "tools/list", "id": 1}' | FAL_API_KEY=test node dist/stdio.js
```

Should return a list of available tools.