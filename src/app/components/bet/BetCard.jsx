'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { formatEther } from 'viem';
import { Trophy, Clock, User, Coins } from 'lucide-react';

export default function BetCard({ bet, onAccept, userAddress }) {
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAccept = async () => {
    try {
      setIsAccepting(true);
      await onAccept(bet.id, bet.amount);
    } catch (error) {
      console.error('Error accepting bet:', error);
    } finally {
      setIsAccepting(false);
    }
  };

  const isCreator = bet.creator === userAddress;
  const isChallenger = bet.challenger === userAddress;
  const canAccept = !isCreator && !bet.challenger && !bet.resolved;

  return (
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
          <span>{isCreator ? 'You' : `${bet.creator.slice(0, 6)}...${bet.creator.slice(-4)}`}</span>
        </div>

        {bet.challenger && (
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              Challenger
            </span>
            <span>{isChallenger ? 'You' : `${bet.challenger.slice(0, 6)}...${bet.challenger.slice(-4)}`}</span>
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

      {canAccept && (
        <Button 
          className="w-full" 
          onClick={handleAccept}
          disabled={isAccepting}
        >
          {isAccepting ? 'Accepting...' : 'Accept Challenge'}
        </Button>
      )}
    </div>
  );
}
