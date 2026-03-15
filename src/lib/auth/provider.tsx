"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!appId) {
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#7C3AED",
          logo: "/logo.svg",
          landingHeader: "Welcome to BagsGate",
          loginMessage: "Gate your content. Earn from every trade.",
        },
        loginMethods: ["email", "google", "twitter"],
        embeddedWallets: {
          solana: {
            createOnLogin: "all-users",
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
