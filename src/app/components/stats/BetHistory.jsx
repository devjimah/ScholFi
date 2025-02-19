'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import BetCard from '../betting/BetCard';

export default function BetHistory({ bets = [] }) {
  const { address } = useAccount();
  const [filter, setFilter] = useState('all');

  const userBets = bets.filter(
    bet => bet.creator === address || bet.challenger === address
  );

  const filteredBets = userBets.filter(bet => {
    if (filter === 'all') return true;
    if (filter === 'won') return bet.status === 'won';
    if (filter === 'lost') return bet.status === 'lost';
    return true;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Your Bet History</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('won')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'won'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Won
          </button>
          <button
            onClick={() => setFilter('lost')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'lost'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Lost
          </button>
        </div>
      </div>

      {filteredBets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">You haven't participated in any bets yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBets.map((bet) => (
            <div
              key={bet.id}
              className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <BetCard bet={bet} showActions={false} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}