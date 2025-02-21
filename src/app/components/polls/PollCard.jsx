'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow } from 'date-fns';
import { useContract } from '@/hooks/useContract';
import { notify } from '@/app/components/ui/NotificationSystem';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function PollCard({ poll, userAddress }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const { vote } = useContract();

  const totalVotes = poll?.options?.reduce((sum, opt) => sum + Number(opt?.votes || 0), 0) || 0;
  const hasVoted = poll?.voters?.includes(userAddress) || false;
  const isCreator = poll?.creator === userAddress;
  const isActive = !poll?.resolved && Number(poll?.endTime) * 1000 > Date.now();

  const handleVote = async () => {
    if (selectedOption === null) {
      notify({
        title: 'Error',
        description: 'Please select an option',
        type: 'error'
      });
      return;
    }

    if (!poll?.id) {
      notify({
        title: 'Error',
        description: 'Invalid poll data',
        type: 'error'
      });
      return;
    }
    
    try {
      setIsVoting(true);
      await vote(Number(poll.id), Number(selectedOption));
      setSelectedOption(null);
    } catch (error) {
      console.error('Error voting:', error);
      notify({
        title: 'Error',
        description: error.message || 'Failed to vote',
        type: 'error'
      });
    } finally {
      setIsVoting(false);
    }
  };

  if (!poll) return null;

  const creatorAddress = poll.creator || '0x';
  const shortAddress = `${creatorAddress.slice(0, 6)}...${creatorAddress.slice(-4)}`;

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {shortAddress.slice(2, 4)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm font-medium">{shortAddress}</CardTitle>
              <CardDescription className="text-xs">
                {formatDistanceToNow(Number(poll.endTime) * 1000, { addSuffix: true })}
              </CardDescription>
            </div>
          </div>
          <Badge variant={isActive ? "success" : "destructive"}>
            {isActive ? 'Active' : 'Closed'}
          </Badge>
        </div>
        <CardTitle>{poll.description}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {poll.options?.map((option, index) => {
            const votes = Number(option?.votes || 0);
            const percentage = totalVotes > 0 ? (votes * 100) / totalVotes : 0;
            
            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`poll-option-${poll.id}`}
                      disabled={!isActive || hasVoted}
                      checked={selectedOption === index}
                      onChange={() => setSelectedOption(index)}
                      className="form-radio"
                    />
                    <span>{option.text}</span>
                  </label>
                  <span className="text-muted-foreground text-xs">
                    {votes} votes ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <Progress value={percentage} className="h-1.5" />
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleVote}
          disabled={!isActive || hasVoted || selectedOption === null || isVoting}
          className="w-full"
        >
          {hasVoted ? 'Already Voted' : isVoting ? 'Voting...' : 'Vote'}
        </Button>
      </CardFooter>
    </Card>
  );
}
