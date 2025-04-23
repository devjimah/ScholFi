export const UNIGAME_CONTRACT_ADDRESS = "0x3667b92dC6dc7934feb034C3261CdE398202B1bb"; // Arbitrum Sepolia address

export const SUPPORTED_CHAINS = {
  ARBITRUM_SEPOLIA: {
    id: 421614,
    name: 'Arbitrum Sepolia',
    rpcUrls: {
      default: {
        http: ['https://sepolia-rollup.arbitrum.io/rpc']
      },
      public: {
        http: ['https://sepolia-rollup.arbitrum.io/rpc']
      }
    },
    blockExplorers: {
      default: {
        name: 'Arbiscan',
        url: 'https://sepolia.arbiscan.io'
      }
    },
    testnet: true
  }
};

