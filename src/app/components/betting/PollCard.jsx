'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { notify } from '../ui/NotificationSystem';

const defaultPoll = {
  id: '',
  description: '',
  options: [],
  creator: '',
  votes: {},
  status: 'open',
  createdAt: new Date().toISOString(),
};

export default function PollCard({ poll = defaultPoll, onVote }) {
  const { address } = useAccount();
  const [isVoting, setIsVoting] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleVote = async (optionIndex) => {
    if (!onVote) return;
    setIsVoting(true);
    try {
      await onVote(poll.id, optionIndex);
      notify('success', 'Vote recorded successfully!');
      setSelectedOption(optionIndex);
    } catch (error) {
      console.error('Error voting:', error);
      notify('error', 'Failed to record vote');
    } finally {
      setIsVoting(false);
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

  const getTotalVotes = () => {
    return Object.values(poll.votes).reduce((sum, count) => sum + count, 0);
  };

  const getVotePercentage = (optionIndex) => {
    const totalVotes = getTotalVotes();
    if (totalVotes === 0) return 0;
    return ((poll.votes[optionIndex] || 0) / totalVotes) * 100;
  };

  const hasVoted = () => {
    return Object.entries(poll.votes).some(([_, voters]) => 
      Array.isArray(voters) && voters.includes(address)
    );
  };

  return (
    <Card className="bg-background/50 backdrop-blur-sm border-muted">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{poll.description}</h3>
            <p className="text-sm text-muted-foreground">
              Created by: {poll.creator?.slice(0, 6)}...{poll.creator?.slice(-4)}
            </p>
          </div>
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {poll.status}
          </span>
        </div>

        <div className="space-y-3">
          {poll.options.map((option, index) => {
            const percentage = getVotePercentage(index);
            const isSelected = selectedOption === index;

            return (
              <div key={index} className="relative">
                <div
                  className="absolute left-0 top-0 h-full bg-primary/10 rounded-lg transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
                <Button
                  onClick={() => handleVote(index)}
                  disabled={isVoting || hasVoted() || poll.status !== 'open'}
                  className={`w-full relative z-10 justify-between ${
                    isSelected ? 'bg-primary text-primary-foreground' : ''
                  }`}
                  variant={isSelected ? 'default' : 'outline'}
                >
                  <span>{option}</span>
                  <span className="text-sm opacity-70">{percentage.toFixed(1)}%</span>
                </Button>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
          <span>Total votes: {getTotalVotes()}</span>
          <span>{formatDate(poll.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
