'use client';

import { formatDistanceToNow } from 'date-fns';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Clock, Trophy, ArrowRight } from 'lucide-react';

export default function BetHistory({ bets = [] }) {
  const { address } = useAccount();

  const getInitials = (address) => {
    return address ? `${address.slice(0, 2)}${address.slice(-2)}` : '??';
  };

  const getBetStatus = (bet) => {
    if (bet.resolved) {
      return {
        label: 'Completed',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        icon: Check
      };
    }
    if (bet.challenger) {
      return {
        label: 'In Progress',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        icon: Clock
      };
    }
    return {
      label: 'Open',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      icon: ArrowRight
    };
  };

  const getActivityDescription = (bet) => {
    if (bet.resolved) {
      return `${bet.winner === address ? 'Won' : 'Lost'} bet: ${bet.description}`;
    }
    if (bet.challenger) {
      return `Matched bet: ${bet.description}`;
    }
    return `Created bet: ${bet.description}`;
  };

  const userBets = bets.filter(
    bet => bet.creator === address || bet.challenger === address
  );

  const sortedBets = [...userBets].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-auto pr-4">
        <div className="space-y-6">
          {sortedBets.map((bet) => {
            const status = getBetStatus(bet);
            const StatusIcon = status.icon;

            return (
              <div key={bet.id} className="flex items-start space-x-4">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center ${status.bgColor}`}>
                  <StatusIcon className={`w-5 h-5 ${status.color}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">
                      {getActivityDescription(bet)}
                    </p>
                    <div className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                      {status.label}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="font-medium text-primary">
                      {formatEther(bet.amount)} ETH
                    </span>
                    <span className="mx-1">•</span>
                    <span>
                      {formatDistanceToNow(bet.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                  {bet.resolved && (
                    <div className="flex items-center mt-2">
                      <Trophy className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">
                        Winner: {bet.winner.slice(0, 6)}...{bet.winner.slice(-4)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {sortedBets.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No recent activities
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}