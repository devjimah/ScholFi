'use client';

import { formatEther } from 'viem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Ticket, Users, Trophy } from 'lucide-react';
import { useContract } from '@/hooks/useContract';

export default function RaffleCard({ raffle, userAddress }) {
  const { buyTicket, isBuyTicketLoading } = useContract();
  
  if (!raffle) return null;

  const isCreator = raffle.creator === userAddress;
  const hasParticipated = raffle.hasParticipated;
  const timeLeft = Number(raffle.endTime) * 1000 - Date.now();
  const isEnded = timeLeft <= 0 || !raffle.active;

  const formatAddress = (address, isUser = false) => {
    if (!address) return 'Unknown';
    if (isUser && address === userAddress) return 'You';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusColor = () => {
    if (isEnded) return 'bg-red-500/10 text-red-500';
    if (hasParticipated) return 'bg-yellow-500/10 text-yellow-500';
    return 'bg-green-500/10 text-green-500';
  };

  const getStatusText = () => {
    if (isEnded) return 'Ended';
    if (hasParticipated) return 'Participated';
    return 'Active';
  };

  const formatTimeLeft = () => {
    if (isEnded) return 'Ended';
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m left`;
  };

  const handleBuyTicket = async () => {
    if (!raffle.id) return;
    
    try {
      await buyTicket(raffle.id, formatEther(raffle.ticketPrice));
    } catch (error) {
      console.error('Error buying ticket:', error);
    }
  };

  return (
    <Card className="w-[300px] hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-base">Raffle #{(raffle.id ?? 0).toString()}</h3>
          <Badge className={getStatusColor()}>{getStatusText()}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span>Creator: {formatAddress(raffle.creator, true)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{formatTimeLeft()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Ticket className="w-4 h-4" />
            <span>Price: {formatEther(raffle.ticketPrice)} ETH</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Total Pool: {formatEther(raffle.totalPool)} ETH</span>
          </div>
          {raffle.winner && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="w-4 h-4" />
              <span>Winner: {formatAddress(raffle.winner, true)}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleBuyTicket}
          disabled={isEnded || hasParticipated || isBuyTicketLoading}
        >
          {isEnded ? 'Ended' : hasParticipated ? 'Already Participated' : isBuyTicketLoading ? 'Buying...' : 'Buy Ticket'}
        </Button>
      </CardFooter>
    </Card>
  );
}
