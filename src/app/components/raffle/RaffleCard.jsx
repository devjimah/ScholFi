'use client';

import { formatEther } from 'viem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Ticket, Users, Trophy } from 'lucide-react';

export default function RaffleCard({ raffle, onBuyTicket, userAddress }) {
  const isCreator = raffle.creator === userAddress;
  const hasParticipated = raffle.participants.includes(userAddress);
  const isActive = raffle.active;
  const timeLeft = new Date(Number(raffle.endTime)) - new Date();
  const isEnded = timeLeft <= 0;

  const getStatusColor = () => {
    if (isEnded) return 'bg-red-500';
    if (hasParticipated) return 'bg-yellow-500';
    return 'bg-green-500';
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
    try {
      await onBuyTicket(raffle.id);
    } catch (error) {
      console.error('Error buying ticket:', error);
    }
  };

  return (
    <Card className="w-[300px] hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-base">Raffle #{raffle.id + 1}</h3>
          <Badge className={`${getStatusColor()} ml-2 shrink-0`}>{getStatusText()}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="truncate">
              {isCreator ? 'You' : `${raffle.creator.slice(0, 6)}...${raffle.creator.slice(-4)}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-primary" />
            <span className="font-medium">{formatEther(raffle.ticketPrice)} ETH</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm">{raffle.participants.length} participants</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatTimeLeft()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        {isActive && !isEnded && !isCreator && !hasParticipated ? (
          <Button 
            onClick={handleBuyTicket}
            className="w-full"
            size="sm"
          >
            Buy Ticket
          </Button>
        ) : isEnded ? (
          <div className="w-full flex items-center justify-center gap-2 text-sm">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-muted-foreground font-medium">Winner drawn!</span>
          </div>
        ) : hasParticipated ? (
          <div className="w-full flex items-center justify-center gap-2 text-sm">
            <Ticket className="h-4 w-4 text-yellow-500" />
            <span className="text-muted-foreground font-medium">You have a ticket!</span>
          </div>
        ) : null}
      </CardFooter>
    </Card>
  );
}
