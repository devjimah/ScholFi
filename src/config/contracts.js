export const UNIGAME_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Local hardhat node address

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
  },
  HARDHAT: {
    id: 31337,
    name: 'Hardhat',
    rpcUrls: {
      default: {
        http: ['http://127.0.0.1:8545']
      },
      public: {
        http: ['http://127.0.0.1:8545']
      }
    },
    testnet: true
  }
};
