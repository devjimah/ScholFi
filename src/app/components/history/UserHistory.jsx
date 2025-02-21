'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatEther } from 'viem';
import { Coins, Vote, Ticket, Wallet } from 'lucide-react';

export default function UserHistory({ bets, polls, raffles, stakes, userAddress }) {
  const [filter, setFilter] = useState('all');

  const getActivityIcon = (type) => {
    switch (type) {
      case 'bet': return <Coins className="w-4 h-4" />;
      case 'poll': return <Vote className="w-4 h-4" />;
      case 'raffle': return <Ticket className="w-4 h-4" />;
      case 'stake': return <Wallet className="w-4 h-4" />;
      default: return null;
    }
  };

  const getActivityStatus = (item, type) => {
    switch (type) {
      case 'bet':
        return item.resolved ? 'Resolved' : item.challenger ? 'In Progress' : 'Open';
      case 'poll':
        return item.ended ? 'Ended' : 'Active';
      case 'raffle':
        return item.drawn ? 'Drawn' : 'Active';
      case 'stake':
        return item.active ? 'Active' : 'Ended';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
      case 'Ended':
      case 'Drawn':
        return 'bg-green-500/10 text-green-500';
      case 'In Progress':
      case 'Active':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'Open':
        return 'bg-blue-500/10 text-blue-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const formatAddress = (address) => {
    if (!address) return 'Unknown';
    if (address === userAddress) return 'Created by you';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    const now = Math.floor(Date.now() / 1000);
    const diff = now - Number(timestamp);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;
    return `${Math.floor(diff / 31536000)}y ago`;
  };

  const allActivities = [
    ...(bets?.map(bet => ({ ...bet, type: 'bet' })) || []),
    ...(polls?.map(poll => ({ ...poll, type: 'poll' })) || []),
    ...(raffles?.map(raffle => ({ ...raffle, type: 'raffle' })) || []),
    ...(stakes?.map(stake => ({ ...stake, type: 'stake' })) || []),
  ].sort((a, b) => b.createdAt - a.createdAt);

  const filteredActivities = filter === 'all' 
    ? allActivities 
    : allActivities.filter(item => item.type === filter);

  if (!allActivities.length) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p>No activity history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'bet' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('bet')}
        >
          <Coins className="w-4 h-4 mr-2" />
          Bets
        </Button>
        <Button
          variant={filter === 'poll' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('poll')}
        >
          <Vote className="w-4 h-4 mr-2" />
          Polls
        </Button>
        <Button
          variant={filter === 'raffle' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('raffle')}
        >
          <Ticket className="w-4 h-4 mr-2" />
          Raffles
        </Button>
        <Button
          variant={filter === 'stake' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('stake')}
        >
          <Wallet className="w-4 h-4 mr-2" />
          Stakes
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredActivities.map((item) => (
          <Card key={`${item.type}-${item.id}`} className="overflow-hidden">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getActivityIcon(item.type)}
                  <span className="font-medium capitalize">{item.type}</span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(getActivityStatus(item, item.type))}`}>
                  {getActivityStatus(item, item.type)}
                </div>
              </div>

              <p className="text-sm line-clamp-1">{item.name || item.description}</p>
              
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="text-muted-foreground">
                  {formatTimeAgo(item.createdAt)}
                </span>
                {item.amount && (
                  <span className="font-medium">{Number(formatEther(item.amount)).toFixed(4)} ETH</span>
                )}
              </div>
              
              <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                {formatAddress(item.creator)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
