import type { Metadata } from "next";
import "../styles.css";
import { MotionProvider } from "./providers/motion-provider";
import { focal, hal, halMono, commitMono } from "@/lib/fonts";
import { HeaderFadeGradient } from "@/components/header-fade-gradient";

export const metadata: Metadata = {
  title: "fal-mcp | Lightning-fast AI through natural language",
  description: "Transform ideas into images, videos, and audio through simple conversation. Powered by fal.ai's blazing-fast infrastructure.",
  keywords: [
    "MCP",
    "Model Context Protocol",
    "AI assistant",
    "fal.ai",
    "image generation",
    "video generation",
    "audio synthesis",
    "AI tools",
    "natural language AI",
    "Claude Desktop",
  ],
  authors: [{ name: "fal.ai" }],
  creator: "fal.ai",
  publisher: "fal.ai",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    viewportFit: "cover",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "fal-mcp | Lightning-fast AI through natural language",
    description: "Transform ideas into images, videos, and audio through simple conversation.",
    type: "website",
    locale: "en_US",
    siteName: "fal-mcp",
  },
  twitter: {
    card: "summary_large_image",
    title: "fal-mcp | Lightning-fast AI through natural language",
    description: "Transform ideas into images, videos, and audio through simple conversation.",
    creator: "@fal_ai",
    site: "@fal_ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={[
        hal.variable,
        halMono.variable,
        focal.variable,
        commitMono.variable,
      ].join(" ")}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body className="font-sans bg-background text-foreground min-h-screen">
        <HeaderFadeGradient />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}