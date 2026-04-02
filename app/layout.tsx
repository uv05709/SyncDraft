import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-lexical/styles.css";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta"
});

export const metadata: Metadata = {
  title: "SyncDraft | Real-time Collaborative Editor",
  description:
    "SyncDraft is a modern collaborative writing workspace built with Next.js, Liveblocks, Lexical, and MongoDB."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} font-sans`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0f172a",
              color: "#e2e8f0",
              border: "1px solid #1e293b"
            }
          }}
        />
      </body>
    </html>
  );
}
