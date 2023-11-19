"use client";
import { Metadata } from "next";
import {
  ThirdwebProvider,
  embeddedWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  rainbowWallet,
  safeWallet,
} from "@thirdweb-dev/react";

import "./globals.css";

export const metatada: Metadata = {
  title: "Ladder It",
  description: "A blockchain/socialfi app which level you up in the life",
  keywords: "blockchain, decentralized social media, socialfi, ladder, habit",
};

const activeChain = "mumbai";

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThirdwebProvider
      clientId="33cf5af1f3380055e7f1b7ba3161d6c1"
      activeChain={activeChain}
      supportedWallets={[
        embeddedWallet({ recommended: true }),
        metamaskWallet({ recommended: true }),
        coinbaseWallet(),
        walletConnect(),
        rainbowWallet(),
        safeWallet(),
      ]}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ThirdwebProvider>
  );
}
