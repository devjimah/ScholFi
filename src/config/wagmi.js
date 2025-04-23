import { configureChains, createConfig } from 'wagmi';import { arbitrumSepolia } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [arbitrumSepolia],  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),    publicProvider(),
  ],);
export const config = createConfig({
  autoConnect: true,  connectors: [
    new MetaMaskConnector({ chains }),    new WalletConnectConnector({
      chains,      options: {
        projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,      },
    }),  ],
  publicClient,
  webSocketPublicClient,
});














