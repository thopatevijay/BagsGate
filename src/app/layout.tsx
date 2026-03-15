import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth/provider";
import { PostHogProvider } from "@/lib/analytics/posthog";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BagsGate — Token-Gated Creator Access",
  description:
    "Gate your content behind your Bags token. Fans buy to access. Earn from every trade. Patreon on Solana.",
  manifest: "/manifest.json",
  openGraph: {
    title: "BagsGate — Token-Gated Creator Access",
    description:
      "Gate your content behind your Bags token. Fans buy to access. Earn from every trade.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BagsGate — Token-Gated Creator Access",
    description:
      "Gate your content behind your Bags token. Fans buy to access. Earn from every trade.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BagsGate",
  },
};

export const viewport: Viewport = {
  themeColor: "#7C3AED",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <AuthProvider>
          <PostHogProvider>{children}</PostHogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
