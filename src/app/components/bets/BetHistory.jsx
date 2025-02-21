'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatEther } from 'viem';
import { formatDistanceToNow } from 'date-fns';
import { Trophy, Clock, User, Coins } from 'lucide-react';

export default function BetHistory({ bets = [], userAddress }) {
  const [filter, setFilter] = useState('all');

  const filteredBets = (bets || []).filter(bet => {
    switch (filter) {
      case 'active':
        return !bet.resolved;
      case 'resolved':
        return bet.resolved;
      case 'created':
        return bet.creator === userAddress;
      case 'participated':
        return bet.challenger === userAddress;
      default:
        return true;
    }
  });

  const sortedBets = [...filteredBets].sort((a, b) => b.createdAt - a.createdAt);

  if (!bets?.length) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p>No bet history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 pb-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'active' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('active')}
        >
          Active
        </Button>
        <Button
          variant={filter === 'resolved' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('resolved')}
        >
          Resolved
        </Button>
        <Button
          variant={filter === 'created' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('created')}
        >
          Created
        </Button>
        <Button
          variant={filter === 'participated' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('participated')}
        >
          Participated
        </Button>
      </div>

      <div className="space-y-4">
        {sortedBets.map((bet) => (
          <Card key={bet.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold">{bet.description}</h3>
                  <p className="text-sm text-muted-foreground">
                    Created {formatDistanceToNow(new Date(bet.createdAt * 1000), { addSuffix: true })}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  bet.resolved 
                    ? 'bg-green-500/10 text-green-500' 
                    : bet.challenger 
                      ? 'bg-yellow-500/10 text-yellow-500'
                      : 'bg-blue-500/10 text-blue-500'
                }`}>
                  {bet.resolved 
                    ? 'Resolved' 
                    : bet.challenger 
                      ? 'In Progress'
                      : 'Open'}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate">
                    {bet.creator === userAddress ? 'You' : `${bet.creator.slice(0, 6)}...${bet.creator.slice(-4)}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Coins className="w-4 h-4 text-muted-foreground" />
                  <span>{formatEther(bet.amount)} ETH</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
