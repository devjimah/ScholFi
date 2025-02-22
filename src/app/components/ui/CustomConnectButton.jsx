'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function CustomConnectButton() {
  const { disconnect } = useDisconnect();
  const router = useRouter();

  const handleDisconnect = async () => {
    disconnect();
    Cookies.remove('wallet.connected');
    router.replace('/');
  };

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        if (!ready) {
          return null;
        }

        if (!mounted) {
          return null;
        }

        if (!account) {
          return (
            <Button onClick={openConnectModal} type="button">
              Connect Wallet
            </Button>
          );
        }

        if (chain.unsupported) {
          return (
            <Button onClick={openChainModal} type="button" variant="destructive">
              Wrong network
            </Button>
          );
        }

        return (
          <div className="flex gap-3">
            <Button
              onClick={openChainModal}
              variant="outline"
              className="flex items-center gap-2"
            >
              {chain.hasIcon && (
                <div className="w-4 h-4">
                  {chain.iconUrl && (
                    <img
                      alt={chain.name ?? 'Chain icon'}
                      src={chain.iconUrl}
                      className="w-4 h-4"
                    />
                  )}
                </div>
              )}
              {chain.name}
            </Button>

            <Button
              onClick={openAccountModal}
              variant="outline"
              className="flex items-center gap-2"
            >
              {account.displayName}
              {account.displayBalance ? ` (${account.displayBalance})` : ''}
            </Button>

            <Button
              onClick={handleDisconnect}
              variant="destructive"
            >
              Disconnect
            </Button>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
