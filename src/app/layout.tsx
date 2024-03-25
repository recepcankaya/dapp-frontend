"use client";
import { Metadata } from "next";
import { ThirdwebProvider, embeddedWallet } from "@thirdweb-dev/react";

import "./globals.css";

export const metatada: Metadata = {
  title: "Ladder It",
  description: "A blockchain/socialfi app which level you up in the life",
  keywords: "blockchain, decentralized social media, socialfi, ladder, habit",
};

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
      clientId="9cf2156f9e78bdaaecbcef17707d78ad"
      supportedWallets={[embeddedWallet({})]}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ThirdwebProvider>
  );
}
