'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import { formatEther, parseEther } from 'viem';
import { Progress } from '@/components/ui/progress';
import { Coins, Clock, Trophy } from 'lucide-react';

export default function StakeCard({ stake, onStake, userAddress }) {
  const [amount, setAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);

  const totalStaked = stake.stakes.reduce((sum, s) => sum + s.amount, 0n);
  const userStake = stake.stakes.find(s => s.staker === userAddress)?.amount || 0n;
  const apy = stake.apy || 0;
  const timeLeft = stake.endTime ? stake.endTime - Date.now() : 0;
  const daysLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60 * 24)));
  
  const handleStake = async () => {
    if (!amount) return;
    
    try {
      setIsStaking(true);
      await onStake(stake.id, parseEther(amount));
      setAmount('');
    } catch (error) {
      console.error('Error staking:', error);
    } finally {
      setIsStaking(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{stake.name}</h3>
          <p className="text-sm text-muted-foreground">
            Created {formatDistanceToNow(stake.createdAt, { addSuffix: true })}
          </p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          stake.locked ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
        }`}>
          {stake.locked ? 'Locked' : 'Active'}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1">
            <Coins className="h-4 w-4" />
            APY
          </span>
          <span className="font-medium text-green-500">{apy}%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Time Left
          </span>
          <span>{daysLeft} days</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            Total Staked
          </span>
          <span>{formatEther(totalStaked)} ETH</span>
        </div>
        
        <div className="pt-2">
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Pool Progress</span>
            <span>{formatEther(totalStaked)}/{formatEther(stake.maxStake)} ETH</span>
          </div>
          <Progress 
            value={(Number(totalStaked) * 100) / Number(stake.maxStake)} 
            className="h-2" 
          />
        </div>
      </div>

      {!stake.locked && (
        <div className="space-y-2 pt-2">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Amount to stake"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />
            <Button 
              onClick={handleStake}
              disabled={isStaking || !amount}
            >
              {isStaking ? 'Staking...' : 'Stake'}
            </Button>
          </div>
          {userStake > 0n && (
            <p className="text-sm text-muted-foreground">
              Your stake: {formatEther(userStake)} ETH
            </p>
          )}
        </div>
      )}
    </div>
  );
}
