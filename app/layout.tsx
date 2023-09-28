"use client";
import { ThirdwebProvider } from "@thirdweb-dev/react";

import "./globals.css";

const activeChain = "mumbai";

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThirdwebProvider activeChain={activeChain}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ThirdwebProvider>
  );
}
