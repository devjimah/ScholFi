"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BetCard from "@/app/components/bet/BetCard";
import PollCard from "@/app/components/polls/PollCard";
import RaffleCard from "@/app/components/raffle/RaffleCard";
import StakeCard from "@/app/components/stake/StakeCard";

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "bets", label: "Bets" },
  { value: "polls", label: "Polls" },
  { value: "raffles", label: "Raffles" },
  { value: "stakes", label: "Stakes" },
];

export default function ActiveItems({
  bets = [],
  polls = [],
  raffles = [],
  stakes = [],
  userAddress,
  onCreateBet,
  onCreatePoll,
  onCreateRaffle,
  onCreateStake,
}) {
  const [filter, setFilter] = useState("all");

  const allItems = [
    ...bets.map((item) => ({
      ...item,
      type: "bets",
      uniqueId: `bet-${item.id}`,
    })),
    ...polls.map((item) => ({
      ...item,
      type: "polls",
      uniqueId: `poll-${item.id}`,
    })),
    ...raffles.map((item) => ({
      ...item,
      type: "raffles",
      uniqueId: `raffle-${item.id}`,
    })),
    ...stakes.map((item) => ({
      ...item,
      type: "stakes",
      uniqueId: `stake-${item.id}`,
    })),
  ];

  const filteredItems = allItems.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  const renderCard = (item) => {
    switch (item.type) {
      case "bets":
        return (
          <BetCard key={item.uniqueId} bet={item} userAddress={userAddress} />
        );
      case "polls":
        return (
          <PollCard key={item.uniqueId} poll={item} userAddress={userAddress} />
        );
      case "raffles":
        return (
          <RaffleCard
            key={item.uniqueId}
            raffle={item}
            userAddress={userAddress}
          />
        );
      case "stakes":
        return (
          <StakeCard
            key={item.uniqueId}
            stake={item}
            userAddress={userAddress}
          />
        );
      default:
        return null;
    }
  };

  const handleCreate = () => {
    switch (filter) {
      case "bets":
        onCreateBet();
        break;
      case "polls":
        onCreatePoll();
        break;
      case "raffles":
        onCreateRaffle();
        break;
      case "stakes":
        onCreateStake();
        break;
      default:
        onCreateBet();
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={filter === option.value ? "default" : "outline"}
            onClick={() => setFilter(option.value)}
            className="flex-grow sm:flex-grow-0"
          >
            {option.label} (
            {option.value === "all"
              ? allItems.length
              : allItems.filter((item) => item.type === option.value).length}
            )
          </Button>
        ))}
      </div>

      {/* Create Button */}
      <div className="flex justify-end">
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Create {filter === "all" ? "Bet" : filter.slice(0, -1)}
        </Button>
      </div>

      {/* Welcome Message for Non-Creator Users */}
      {filteredItems.length > 0 &&
        filteredItems.some((item) => item.creator !== userAddress) && (
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-primary mb-2">
              Welcome to ScholFi!
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              You can participate in any active event on the platform, even if
              you didn't create it.
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Accept bets created by other users</li>
              <li>Vote in community polls</li>
              <li>Buy tickets for active raffles</li>
              <li>Stake your tokens in staking pools</li>
            </ul>
          </div>
        )}

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No active {filter === "all" ? "items" : filter}</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map(renderCard)}
        </div>
      )}
    </div>
  );
}
