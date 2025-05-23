"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { notify } from "@/app/components/ui/NotificationSystem";
import { useAuth } from "@/contexts/AuthContext";
import Cookies from "js-cookie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function CustomConnectButton() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleDisconnect = async () => {
    try {
      // First logout to clear user data
      logout();

      // Then disconnect wallet
      await disconnect();

      // Force redirect to home page
      router.push("/");

      notify({
        title: "Success",
        description: "Logged out and wallet disconnected",
        type: "success",
      });
    } catch (error) {
      console.error("Error disconnecting:", error);
      notify({
        title: "Error",
        description: "Failed to disconnect wallet",
        type: "error",
      });

      // Even if there's an error, try to clear user data and redirect
      Cookies.remove("auth");
      localStorage.removeItem("user");
      router.push("/");
    }
  };

  if (isConnected) {
    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            {shortAddress}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleDisconnect}>
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex gap-2">
      {connectors.map((connector) => (
        <Button
          disabled={!connector.ready || isLoading}
          key={connector.id}
          onClick={() => connect({ connector })}
          variant={
            connector.id === pendingConnector?.id ? "secondary" : "default"
          }
        >
          {isLoading && connector.id === pendingConnector?.id
            ? "Connecting..."
            : "Connect Wallet"}
        </Button>
      ))}
    </div>
  );
}
