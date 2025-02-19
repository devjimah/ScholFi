'use client';

import { useState } from 'react';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';

const defaultBet = {
  id: '',
  description: '',
  amount: '0',
  creator: '',
  challenger: '',
  resolved: false,
  status: 'open',
};

export default function BetCard({ bet = defaultBet, onAccept, onResolve }) {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    if (!onAccept) return;
    setIsLoading(true);
    try {
      await onAccept(bet.id, bet.amount);
    } catch (error) {
      console.error('Error accepting bet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async (winner) => {
    if (!onResolve) return;
    setIsLoading(true);
    try {
      await onResolve(bet.id, winner);
    } catch (error) {
      console.error('Error resolving bet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-700 rounded-lg p-6 shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {bet.description || 'No description available'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Created by: {bet.creator || 'Unknown'}
          </p>
        </div>
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {bet.resolved ? 'Resolved' : bet.challenger ? 'Active' : 'Open'}
        </span>
      </div>

      {!bet.resolved && !bet.challenger && bet.creator !== address && (
        <button
          onClick={handleAccept}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Accepting...' : 'Accept Bet'}
        </button>
      )}

      {!bet.resolved && bet.challenger && (address === bet.creator || address === bet.challenger) && (
        <div className="space-x-2">
          <button
            onClick={() => handleResolve(bet.creator)}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isLoading ? 'Resolving...' : 'Creator Won'}
          </button>
          <button
            onClick={() => handleResolve(bet.challenger)}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isLoading ? 'Resolving...' : 'Challenger Won'}
          </button>
        </div>
      )}
      <div className="mt-4 flex justify-between items-center">
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          {bet.amount} ETH
        </p>
      </div>
    </div>
  );
}