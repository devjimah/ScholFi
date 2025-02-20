export const SUPPORTED_CHAINS = {
  MAINNET: 1,
  SEPOLIA: 11155111,
  ARBITRUM_SEPOLIA: 421614
}

export const CONTRACT_ADDRESSES = {
  [SUPPORTED_CHAINS.MAINNET]: '',  // To be filled when deployed
  [SUPPORTED_CHAINS.SEPOLIA]: '',  // To be filled when deployed
  [SUPPORTED_CHAINS.ARBITRUM_SEPOLIA]: '0xDEAD...',  // TODO: Replace with your actual deployed contract address
}

export const MIN_BET_AMOUNT = '0.01'  // in ETH
export const MAX_BET_AMOUNT = '10'    // in ETH

export const WALLET_CONNECT_PROJECT_ID = 'YOUR_PROJECT_ID' // Replace with your WalletConnect project ID
