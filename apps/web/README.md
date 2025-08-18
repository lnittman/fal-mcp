# fal-mcp Webapp

Minimal, utilitarian documentation site for fal-mcp with AI-native features.

## Features

- ⚡ Lightning-fast static site built with Next.js 15
- 🎨 Minimal design aligned with fal.ai brand
- 🤖 AI-native documentation with one-click MCP configuration
- ✨ Smooth animations with Framer Motion
- 📱 Fully responsive design

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Deployment

The webapp is ready for deployment to any static hosting service:

- Vercel (recommended)
- Netlify
- Cloudflare Pages
- GitHub Pages

Simply connect your repository and deploy the `/webapp` directory.

## Structure

```
webapp/
├── app/
│   ├── page.tsx          # Home page
│   ├── docs/
│   │   └── page.tsx      # Documentation page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # shadcn/ui components
│   └── motion/           # Animation components
└── public/               # Static assets
```