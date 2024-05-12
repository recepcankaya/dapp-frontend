"use client";
import { ThirdwebProvider, embeddedWallet } from "@thirdweb-dev/react";

import "./globals.css";

const activeChain = "polygon";

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThirdwebProvider
      activeChain={activeChain}
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      supportedWallets={[
        embeddedWallet({
          auth: {
            options: ["email", "google"],
          },
        }),
      ]}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ThirdwebProvider>
  );
}
