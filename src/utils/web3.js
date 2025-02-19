import { formatEther, parseEther } from 'viem'

export function shortenAddress(address, chars = 4) {
  if (!address) return ''
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function formatAmount(amount, decimals = 4) {
  if (!amount) return '0'
  try {
    return Number(formatEther(amount)).toFixed(decimals)
  } catch (error) {
    console.error('Error formatting amount:', error)
    return '0'
  }
}

export function parseAmount(amount) {
  if (!amount) return '0'
  try {
    return parseEther(amount)
  } catch (error) {
    console.error('Error parsing amount:', error)
    return '0'
  }
}

export function getExplorerUrl(chainId, hash, type = 'tx') {
  const baseUrls = {
    1: 'https://etherscan.io',
    11155111: 'https://sepolia.etherscan.io',
  }

  const baseUrl = baseUrls[chainId] || baseUrls[1]
  return `${baseUrl}/${type}/${hash}`
}

export function formatTimestamp(timestamp) {
  if (!timestamp) return ''
  try {
    return new Date(timestamp).toLocaleString()
  } catch (error) {
    console.error('Error formatting timestamp:', error)
    return ''
  }
}
