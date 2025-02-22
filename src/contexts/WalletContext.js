'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import Cookies from 'js-cookie';

const WalletContext = createContext({});

export function WalletProvider({ children }) {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isConnected && address) {
      // Store wallet connection status
      Cookies.set('wallet.connected', 'true', { expires: 7 });
    } else {
      // Remove wallet connection status
      Cookies.remove('wallet.connected');
    }
  }, [isConnected, address, mounted]);

  return (
    <WalletContext.Provider value={{ isConnected, address }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
