"use client";

import { useState } from "react";
import { formatEther } from "viem";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, User, Ticket, Users, Trophy, Plus, Minus } from "lucide-react";
import { useContract } from "@/hooks/useContract";
import { notify } from "@/app/components/ui/NotificationSystem";

export default function RaffleCard({ raffle, userAddress }) {
  const { buyTicket, isBuyTicketLoading } = useContract();

  if (!raffle) return null;

  const isCreator = raffle.creator === userAddress;
  const hasParticipated = raffle.hasParticipated;
  const timeLeft = Number(raffle.endTime) * 1000 - Date.now();
  const isEnded = timeLeft <= 0 || !raffle.active;

  const formatAddress = (address, isUser = false) => {
    if (!address) return "Unknown";
    if (isUser && address === userAddress) return "You";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusColor = () => {
    if (isEnded) return "bg-red-500/10 text-red-500";
    if (hasParticipated) return "bg-yellow-500/10 text-yellow-500";
    return "bg-green-500/10 text-green-500";
  };

  const getStatusText = () => {
    if (isEnded) return "Ended";
    if (hasParticipated) return "Participated";
    return "Active";
  };

  const formatTimeLeft = () => {
    if (isEnded) return "Ended";
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m left`;
  };

  const [ticketCount, setTicketCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBuyTicket = async () => {
    if (!raffle.id) return;

    try {
      setIsSubmitting(true);
      await buyTicket(raffle.id, ticketCount);
      notify({
        title: "Success",
        description: `Successfully purchased ${ticketCount} ticket${
          ticketCount > 1 ? "s" : ""
        }!`,
        type: "success",
      });
    } catch (error) {
      console.error("Error buying ticket:", error);
      notify({
        title: "Error",
        description: error.message || "Failed to buy ticket",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-[300px] hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-base">
            Raffle #{(raffle.id ?? 0).toString()}
          </h3>
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
      <CardFooter className="flex-col space-y-4">
        {!isEnded && !hasParticipated && (
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ticketCount">Number of tickets:</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                  disabled={ticketCount <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="ticketCount"
                  type="number"
                  min="1"
                  value={ticketCount}
                  onChange={(e) =>
                    setTicketCount(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-16 text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setTicketCount(ticketCount + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground text-right">
              Total cost:{" "}
              {(Number(formatEther(raffle.ticketPrice)) * ticketCount).toFixed(
                4
              )}{" "}
              ETH
            </div>
          </div>
        )}

        {!isEnded && !hasParticipated && (
          <Button
            className="w-full"
            onClick={handleBuyTicket}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Buying..."
              : `Buy ${ticketCount} Ticket${ticketCount > 1 ? "s" : ""}`}
          </Button>
        )}

        {hasParticipated && (
          <div className="w-full text-center">
            <Badge
              variant="outline"
              className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
            >
              You've already participated in this raffle
            </Badge>
          </div>
        )}

        {isEnded && (
          <div className="w-full text-center text-muted-foreground">
            This raffle has ended
            {raffle.winner && (
              <div className="mt-2">
                <Badge
                  variant="outline"
                  className="bg-green-500/10 text-green-500 border-green-500/20"
                >
                  Winner: {formatAddress(raffle.winner, true)}
                </Badge>
              </div>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
