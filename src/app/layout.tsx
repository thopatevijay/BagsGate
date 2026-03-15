import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth/provider";
import { PostHogProvider } from "@/lib/analytics/posthog";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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
        className={`${dmSans.variable} ${jetbrainsMono.variable} antialiased min-h-screen`}
      >
        <AuthProvider>
          <PostHogProvider>{children}</PostHogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
