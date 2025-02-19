'use client';

import { useNetwork } from 'wagmi';

export default function NetworkStatus() {
  const { chain } = useNetwork();

  if (!chain) {
    return null;
  }

  const isTestnet = chain.id !== 1; // 1 is mainnet

  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
      isTestnet
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    }`}>
      {chain.name}
    </div>
  );
}