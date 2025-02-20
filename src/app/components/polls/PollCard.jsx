'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow } from 'date-fns';

export default function PollCard({ poll, onVote, userAddress }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isVoting, setIsVoting] = useState(false);

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  const hasVoted = poll.voters.includes(userAddress);
  const isCreator = poll.creator === userAddress;

  const handleVote = async () => {
    if (selectedOption === null) return;
    
    try {
      setIsVoting(true);
      await onVote(poll.id, selectedOption);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{poll.description}</h3>
          <p className="text-sm text-muted-foreground">
            Created {formatDistanceToNow(poll.createdAt, { addSuffix: true })}
          </p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          poll.resolved ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
        }`}>
          {poll.resolved ? 'Closed' : 'Active'}
        </div>
      </div>

      <div className="space-y-2">
        {poll.options.map((option, index) => {
          const percentage = totalVotes > 0 ? (option.votes * 100) / totalVotes : 0;
          
          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{option.text}</span>
                <span className="text-muted-foreground">{percentage.toFixed(1)}%</span>
              </div>
              <Progress value={percentage} className="h-2" />
              {!hasVoted && !poll.resolved && (
                <Button
                  variant={selectedOption === index ? "default" : "outline"}
                  size="sm"
                  className="w-full mt-1"
                  onClick={() => setSelectedOption(index)}
                >
                  {selectedOption === index ? 'Selected' : 'Select'}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {!hasVoted && !poll.resolved && selectedOption !== null && (
        <Button 
          className="w-full"
          onClick={handleVote}
          disabled={isVoting}
        >
          {isVoting ? 'Voting...' : 'Submit Vote'}
        </Button>
      )}

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{totalVotes} votes</span>
        {hasVoted && <span>You've voted</span>}
      </div>
    </div>
  );
}
