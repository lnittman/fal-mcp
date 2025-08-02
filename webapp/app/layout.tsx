import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "fal-mcp | Lightning-fast AI through natural language",
  description: "Transform ideas into images, videos, and audio through simple conversation. Powered by fal.ai.",
  openGraph: {
    title: "fal-mcp | Lightning-fast AI through natural language",
    description: "Transform ideas into images, videos, and audio through simple conversation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}