"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { formatEther } from "viem";
import { Trophy, Clock, User, Coins, Swords, Users } from "lucide-react";
import { useContract } from "@/hooks/useContract";

export default function BetCard({ bet, userAddress }) {
  const { acceptBet, isAcceptBetLoading } = useContract();

  const handleAccept = async () => {
    try {
      await acceptBet(bet.id, formatEther(bet.amount));
    } catch (error) {
      console.error("Error accepting bet:", error);
    }
  };

  const isCreator = bet.creator === userAddress;
  const isChallenger = bet.challenger === userAddress;
  const isParticipant = isCreator || isChallenger;
  const canAccept = !isCreator && !bet.challenger && bet.state === 0; // BetState.Pending
  const timeLeft = formatDistanceToNow(Number(bet.deadline) * 1000, {
    addSuffix: true,
  });
  const isActive = bet.state === 0 || bet.state === 1; // Pending or Accepted

  const getStatusInfo = () => {
    switch (bet.state) {
      case 0: // Pending
        return {
          color: "bg-blue-500/10 text-blue-500",
          icon: Users,
          text: "Open for Challenge",
        };
      case 1: // Accepted
        return {
          color: "bg-yellow-500/10 text-yellow-500",
          icon: Swords,
          text: "Battle in Progress",
        };
      case 2: // Resolved
        return {
          color: "bg-green-500/10 text-green-500",
          icon: Trophy,
          text: "Bet Resolved",
        };
      case 3: // Cancelled
        return {
          color: "bg-red-500/10 text-red-500",
          icon: Clock,
          text: "Bet Cancelled",
        };
      default:
        return null;
    }
  };

  const status = getStatusInfo();
  const StatusIcon = status?.icon;

  const getAddressDisplay = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getAvatarFallback = (address) => {
    return address ? address.slice(2, 4).toUpperCase() : "??";
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {status.text}
          </div>
          <div className="flex items-center text-muted-foreground text-xs">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {timeLeft}
          </div>
        </div>

        {/* Description */}
        <h3 className="font-semibold mb-4 line-clamp-2">{bet.description}</h3>

        {/* Participants */}
        <div className="space-y-3 mb-6">
          {/* Creator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {getAvatarFallback(bet.creator)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                {isCreator ? "You" : getAddressDisplay(bet.creator)}
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              Creator
            </Badge>
          </div>

          {/* Challenger */}
          {bet.challenger && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {getAvatarFallback(bet.challenger)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {isChallenger ? "You" : getAddressDisplay(bet.challenger)}
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                Challenger
              </Badge>
            </div>
          )}

          {/* Winner */}
          {bet.winner && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {getAvatarFallback(bet.winner)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {bet.winner === userAddress
                    ? "You"
                    : getAddressDisplay(bet.winner)}
                </span>
              </div>
              <Badge
                variant="outline"
                className="text-xs bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
              >
                Winner
              </Badge>
            </div>
          )}
        </div>

        {/* Amount */}
        <div className="flex items-center justify-between py-3 px-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Stake Amount</span>
          </div>
          <span className="text-sm font-bold">
            {formatEther(bet.amount)} ETH
          </span>
        </div>
      </CardContent>

      {/* Action Button */}
      <CardFooter className="pt-2 pb-6">
        {canAccept && (
          <Button
            onClick={handleAccept}
            disabled={isAcceptBetLoading}
            className="w-full"
            size="lg"
            variant="default"
          >
            {isAcceptBetLoading ? "Accepting..." : "Accept Challenge"}
          </Button>
        )}

        {isParticipant && isActive && (
          <div className="w-full text-center">
            <Badge
              variant="outline"
              className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
            >
              {isCreator ? "You created this bet" : "You accepted this bet"}
            </Badge>
          </div>
        )}

        {!canAccept && !isParticipant && bet.state === 1 && (
          <div className="w-full text-center text-muted-foreground text-sm">
            This bet has already been accepted
          </div>
        )}

        {!canAccept &&
          !isParticipant &&
          (bet.state === 2 || bet.state === 3) && (
            <div className="w-full text-center text-muted-foreground text-sm">
              This bet has been {bet.state === 2 ? "resolved" : "cancelled"}
            </div>
          )}
      </CardFooter>
    </Card>
  );
}
