'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';

// Fallback values for development - DO NOT use in production
const FALLBACK_ALCHEMY_KEY = "demo"; // This will fail but prevent errors
const FALLBACK_PROJECT_ID = "demo"; // This will fail but prevent errors

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [
    alchemyProvider({ 
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || FALLBACK_ALCHEMY_KEY
    }),
    publicProvider()
  ]
);

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || FALLBACK_PROJECT_ID;

const { wallets } = getDefaultWallets({
  appName: 'ScholFi',
  projectId,
  chains,
});

const demoWallets = [
  argentWallet({ projectId, chains }),
  trustWallet({ projectId, chains }),
  ledgerWallet({ projectId, chains }),
];

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: demoWallets,
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const queryClient = new QueryClient()

export function Providers({ children }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains}>
          {mounted && children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}
