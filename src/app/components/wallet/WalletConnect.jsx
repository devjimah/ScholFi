'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useRouter } from 'next/navigation';
import { notify } from '../ui/NotificationSystem';

export default function CustomConnectButton() {
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      router.push('/bets');
    }
  }, [isConnected, router]);

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
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-80 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 animate-gradient bg-300% hover:shadow-lg"
                  >
                    Connect Wallet
                  </button>
                );
              }

              return (
                <div className="flex items-center gap-3">
                  <button
                    onClick={openChainModal}
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2 transition-all duration-200"
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div className="w-6 h-6">
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            className="w-6 h-6"
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button
                    onClick={openAccountModal}
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2 transition-all duration-200"
                    type="button"
                  >
                    {account.displayName}
                    {account.displayBalance ? ` (${account.displayBalance})` : ''}
                  </button>

                  <button
                    onClick={() => {
                      disconnect();
                      notify('info', 'Wallet disconnected');
                      router.push('/');
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 transition-all duration-200"
                    type="button"
                  >
                    Disconnect
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}