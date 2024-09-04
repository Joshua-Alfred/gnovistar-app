import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react"
import {
  ClerkProvider,
} from '@clerk/nextjs'

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "GnoVistar - Advanced Note-Taking App with AI & PDF Handling",
  description: "Discover GnoVistar, a note-taking app designed for students, researchers, and professionals. Leverage AI-powered features and advanced PDF handling for a seamless note-taking experience.",
  keywords: "note-taking app, AI-powered notes, PDF handling, research tools, academic notes, student productivity, GnoVistar",
  openGraph: {
    title: "GnoVistar - Advanced Note-Taking App with AI & PDF Handling",
    description: "Revolutionize your note-taking with GnoVistar's AI-powered tools and advanced PDF management. Perfect for students, researchers, and professionals.",
    url: "https://gnovistar.vercel.app",  // replace with your actual URL
    type: "website",
    siteName: "GnoVistar",
    images: [
      {
        url: "/gnovistar.png",  // replace with your actual image URL
        alt: "GnoVistar - Note-Taking App with AI & PDF Features",
      },
    ],
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" className="scroll-smooth" suppressHydrationWarning>
        <body className={`${poppins.className} `}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
              >
              {children}
              <Analytics/>
            </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
