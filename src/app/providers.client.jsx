"use client";

import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { arbitrumSepolia } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import {
  RainbowKitProvider,
  connectorsForWallets,
  DisclaimerComponent,
} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  coinbaseWallet,
  trustWallet,
  rainbowWallet,
  braveWallet,
  ledgerWallet,
  phantomWallet,
  okxWallet,
  injectedWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { WalletProvider } from "@/contexts/WalletContext";
import { AuthProvider } from "@/contexts/AuthContext";
import "@rainbow-me/rainbowkit/styles.css";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

// Create a proper disclaimer component
const Disclaimer = ({ Text, Link }) => (
  <Text>
    By connecting your wallet, you agree to the{" "}
    <Link href="https://scholfi.com/terms">Terms of Service</Link> and
    acknowledge you have read and understand the{" "}
    <Link href="https://scholfi.com/privacy">Privacy Policy</Link>
  </Text>
);

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [arbitrumSepolia],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
    publicProvider(),
  ]
);

const connectors = connectorsForWallets(
  [
    {
      groupName: "Popular",
      wallets: [
        metaMaskWallet({ projectId, chains }),
        coinbaseWallet({ appName: "ScholFi", chains }),
        rainbowWallet({ projectId, chains }),
        trustWallet({ projectId, chains }),
      ],
    },
    {
      groupName: "More Options",
      wallets: [
        braveWallet({ chains }),
        ledgerWallet({ projectId, chains }),
        phantomWallet({ chains }),
        okxWallet({ projectId, chains }),
      ],
    },
    {
      groupName: "Other Wallets",
      wallets: [
        injectedWallet({ chains }),
        walletConnectWallet({ projectId, chains }),
      ],
    },
  ],
  {
    appName: "ScholFi",
    projectId,
  }
);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          chains={chains}
          modalSize="wide"
          appInfo={{
            appName: "ScholFi",
            learnMoreUrl: "https://scholfi.com/about",
            disclaimer: Disclaimer,
          }}
        >
          <WalletProvider>
            <AuthProvider>{children}</AuthProvider>
          </WalletProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}
