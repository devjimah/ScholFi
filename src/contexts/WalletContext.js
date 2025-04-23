"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const WalletContext = createContext({});

export function WalletProvider({ children }) {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [previousConnectionState, setPreviousConnectionState] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check if this is a disconnection event (was connected, now disconnected)
    const isDisconnectionEvent =
      previousConnectionState === true && !isConnected;

    if (isConnected && address) {
      // Store wallet connection status
      Cookies.set("wallet.connected", "true", { expires: 7 });
      setPreviousConnectionState(true);
    } else {
      // Remove wallet connection status
      Cookies.remove("wallet.connected");

      // If this is a disconnection event, clear user data
      if (isDisconnectionEvent) {
        // Clear auth data
        Cookies.remove("auth");
        localStorage.removeItem("user");

        // Redirect to home page
        router.push("/");
      }

      setPreviousConnectionState(false);
    }
  }, [isConnected, address, mounted, previousConnectionState, router]);

  return (
    <WalletContext.Provider value={{ isConnected, address }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
