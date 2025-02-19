'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { notify } from '../ui/NotificationSystem';
import { Loader2 } from 'lucide-react';

const defaultRaffle = {
  id: '',
  description: '',
  ticketPrice: '0',
  maxTickets: 0,
  creator: '',
  tickets: {},
  winner: null,
  status: 'open',
  createdAt: new Date().toISOString(),
};

export default function RaffleCard({ raffle = defaultRaffle, onBuyTickets }) {
  const { address } = useAccount();
  const [isBuying, setIsBuying] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);

  const handleBuyTickets = async () => {
    if (!onBuyTickets || ticketCount < 1) return;
    setIsBuying(true);
    try {
      await onBuyTickets(raffle.id, ticketCount);
      notify('success', `Successfully purchased ${ticketCount} ticket(s)!`);
    } catch (error) {
      console.error('Error buying tickets:', error);
      notify('error', 'Failed to purchase tickets');
    } finally {
      setIsBuying(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalTickets = () => {
    return Object.values(raffle.tickets).reduce((sum, count) => sum + count, 0);
  };

  const getMyTickets = () => {
    return raffle.tickets[address] || 0;
  };

  const getRemainingTickets = () => {
    return raffle.maxTickets - getTotalTickets();
  };

  const getWinningChance = () => {
    const totalTickets = getTotalTickets();
    if (totalTickets === 0) return 0;
    return (getMyTickets() / totalTickets) * 100;
  };

  return (
    <Card className="bg-background/50 backdrop-blur-sm border-muted">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{raffle.description}</h3>
            <p className="text-sm text-muted-foreground">
              Created by: {raffle.creator?.slice(0, 6)}...{raffle.creator?.slice(-4)}
            </p>
          </div>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            raffle.status === 'open' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {raffle.status}
          </span>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label>Ticket Price</Label>
              <p className="font-medium">{raffle.ticketPrice} ETH</p>
            </div>
            <div>
              <Label>Remaining Tickets</Label>
              <p className="font-medium">{getRemainingTickets()} / {raffle.maxTickets}</p>
            </div>
            <div>
              <Label>Your Tickets</Label>
              <p className="font-medium">{getMyTickets()}</p>
            </div>
            <div>
              <Label>Winning Chance</Label>
              <p className="font-medium">{getWinningChance().toFixed(1)}%</p>
            </div>
          </div>

          {raffle.status === 'open' && getRemainingTickets() > 0 && (
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  min="1"
                  max={getRemainingTickets()}
                  value={ticketCount}
                  onChange={(e) => setTicketCount(Math.min(
                    Math.max(1, parseInt(e.target.value) || 1),
                    getRemainingTickets()
                  ))}
                  disabled={isBuying}
                  className="bg-background/50"
                />
              </div>
              <Button
                onClick={handleBuyTickets}
                disabled={isBuying || ticketCount < 1}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-lg blur-lg opacity-25 group-hover:opacity-50 animate-gradient bg-300% transition-all duration-500" />
                <span className="relative flex items-center gap-2">
                  {isBuying && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isBuying ? 'Buying...' : 'Buy Tickets'}
                </span>
              </Button>
            </div>
          )}

          {raffle.winner && (
            <div className="mt-4 p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Label>Winner</Label>
              <p className="font-medium text-green-800 dark:text-green-200">
                {raffle.winner?.slice(0, 6)}...{raffle.winner?.slice(-4)}
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
          <span>Total tickets sold: {getTotalTickets()}</span>
          <span>{formatDate(raffle.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
