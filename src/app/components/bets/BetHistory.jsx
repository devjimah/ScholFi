'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatEther } from 'viem';
import { formatDistanceToNow } from 'date-fns';
import { Trophy, Clock, User, Coins } from 'lucide-react';

export default function BetHistory({ bets, userAddress }) {
  const [filter, setFilter] = useState('all');

  const filteredBets = bets.filter(bet => {
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

  return (
    <div className="space-y-4">
      <div className="flex gap-2 pb-2">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedBets.map((bet) => (
          <div key={bet.id} className="group relative p-0.5 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
            <div className="relative rounded-lg bg-background p-1">
              <Card className="w-full border-0">
                <CardContent className="p-4">
                  <div className="w-full space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{bet.description}</h3>
                        <p className="text-sm text-muted-foreground">
                          Created {formatDistanceToNow(bet.createdAt, { addSuffix: true })}
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

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Coins className="h-4 w-4" />
                          Amount
                        </span>
                        <span className="font-medium">{formatEther(bet.amount)} ETH</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Creator
                        </span>
                        <span>{bet.creator === userAddress ? 'You' : 'Anonymous'}</span>
                      </div>

                      {bet.challenger && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            Challenger
                          </span>
                          <span>{bet.challenger === userAddress ? 'You' : 'Anonymous'}</span>
                        </div>
                      )}

                      {bet.resolved && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Trophy className="h-4 w-4" />
                            Winner
                          </span>
                          <span className="text-green-500">
                            {bet.winner === userAddress ? 'You' : 'Opponent'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
        {sortedBets.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No bets found
          </div>
        )}
      </div>
    </div>
  );
}
