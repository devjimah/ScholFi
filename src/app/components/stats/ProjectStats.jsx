'use client';

import { Card, CardContent } from '@/components/ui/card';
import { formatEther } from 'viem';
import { Coins, Vote, Ticket, Wallet, TrendingUp, Users } from 'lucide-react';

export default function ProjectStats({ bets, polls, raffles, stakes }) {
  const totalBetAmount = (bets || []).reduce((sum, bet) => sum + BigInt(bet.amount), BigInt(0));
  const totalStaked = (stakes || []).reduce((sum, stake) => sum + BigInt(stake.totalStaked), BigInt(0));
  const uniqueUsers = new Set([
    ...(bets || []).map(bet => bet.creator),
    ...(bets || []).filter(bet => bet.challenger).map(bet => bet.challenger),
    ...(polls || []).map(poll => poll.creator),
    ...(raffles || []).map(raffle => raffle.creator),
    ...(stakes || []).map(stake => stake.creator),
  ]).size;

  const stats = [
    {
      title: 'Total Value Locked',
      value: `${Number(formatEther(totalBetAmount + totalStaked)).toFixed(4)} ETH`,
      icon: TrendingUp,
      description: 'Total ETH in bets and stakes',
    },
    {
      title: 'Active Users',
      value: uniqueUsers,
      icon: Users,
      description: 'Unique users across all features',
    },
    {
      title: 'Active Bets',
      value: (bets || []).filter(bet => !bet.resolved).length,
      icon: Coins,
      description: 'Open and in-progress bets',
    },
    {
      title: 'Active Polls',
      value: (polls || []).filter(poll => !poll.ended).length,
      icon: Vote,
      description: 'Ongoing community polls',
    },
    {
      title: 'Active Raffles',
      value: (raffles || []).filter(raffle => !raffle.drawn).length,
      icon: Ticket,
      description: 'Raffles in progress',
    },
    {
      title: 'Stake Pools',
      value: (stakes || []).filter(stake => stake.active).length,
      icon: Wallet,
      description: 'Active staking pools',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex flex-col gap-2">
              <div className="p-2 bg-primary/10 rounded-full w-fit">
                <stat.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <h3 className="text-xl font-bold">{stat.value}</h3>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
