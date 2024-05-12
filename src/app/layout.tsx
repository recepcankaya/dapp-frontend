"use client";
import { ThirdwebProvider, embeddedWallet } from "@thirdweb-dev/react";

import "./globals.css";

const activeChain = "polygon";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID as string;


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
      clientId={CLIENT_ID}
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
