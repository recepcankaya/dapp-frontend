"use client";
import { Metadata } from "next";
import {
  ThirdwebProvider,
  magicLink,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
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
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect(),
        magicLink({
          apiKey: "33cf5af1f3380055e7f1b7ba3161d6c1",
          oauthOptions: {
            providers: ["google", "facebook", "twitter", "apple"],
          },
        }),
      ]}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ThirdwebProvider>
  );
}
