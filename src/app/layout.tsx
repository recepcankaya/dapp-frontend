"use client";
import {
  ThirdwebProvider as OldThirdwebProvider,
  embeddedWallet,
} from "@thirdweb-dev/react";
import { ThirdwebProvider } from "thirdweb/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    <OldThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
      activeChain="polygon"
      supportedWallets={[
        embeddedWallet({
          auth: {
            options: ["email", "google"],
          },
        }),
      ]}>
      <ThirdwebProvider>
        <html lang="en">
          <body>{children}</body>
          <ToastContainer />
        </html>
      </ThirdwebProvider>
    </OldThirdwebProvider>
  );
}
