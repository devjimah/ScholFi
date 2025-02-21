'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatEther, parseEther } from 'viem';
import { useContract } from '@/hooks/useContract';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, Timer, TrendingUp, User } from 'lucide-react';

export default function StakeCard({ stake, userAddress }) {
  const [stakeAmount, setStakeAmount] = useState('');
  const { stake: stakeInPool, unstake } = useContract();

  const handleStake = async (e) => {
    e.preventDefault();
    try {
      if (!stakeAmount || isNaN(stakeAmount) || parseFloat(stakeAmount) <= 0) {
        throw new Error('Please enter a valid stake amount');
      }
      await stakeInPool(stake.id, stakeAmount);
      setStakeAmount('');
    } catch (error) {
      console.error('Error staking:', error);
      notify({
        title: 'Error',
        description: error.message || 'Failed to stake',
        type: 'error',
      });
    }
  };

  const handleUnstake = async () => {
    try {
      await unstake(stake.id);
    } catch (error) {
      console.error('Error unstaking:', error);
    }
  };

  const canStake = stake.active && (!stake.userStake || !stake.userStake.active);
  const canUnstake = stake.userStake?.active && 
    BigInt(stake.userStake?.startTime || 0) + BigInt(stake.duration) <= BigInt(Math.floor(Date.now() / 1000));

  // Convert BigInt values to regular numbers for display
  const maxStake = Number(formatEther(BigInt(stake.maxStake)));
  const totalStaked = Number(formatEther(BigInt(stake.totalStaked)));
  const remainingCapacity = maxStake - totalStaked;
  const apyPercent = Number(stake.apy) / 100;
  const durationDays = Number(stake.duration) / (24 * 60 * 60);
  const progress = (totalStaked / maxStake) * 100;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{stake.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <User className="w-4 h-4" />
                <span className="truncate">
                  {stake.creator === userAddress ? 'Created by you' : `${stake.creator.slice(0, 6)}...${stake.creator.slice(-4)}`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm font-medium text-green-500">
                  <TrendingUp className="w-4 h-4" />
                  {apyPercent.toFixed(2)}% APY
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Timer className="w-4 h-4" />
                  {Math.floor(durationDays)} days
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Staked</span>
              <span className="font-medium">{totalStaked.toFixed(4)} / {maxStake.toFixed(4)} ETH</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* User's Stake */}
          {stake.userStake?.active && (
            <div className="p-3 bg-secondary/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Your Stake</span>
                </div>
                <span className="text-sm font-medium">
                  {Number(formatEther(BigInt(stake.userStake.amount))).toFixed(4)} ETH
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          {canStake && (
            <form onSubmit={handleStake} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor="stakeAmount" className="sr-only">
                    Stake Amount
                  </Label>
                  <Input
                    id="stakeAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    max={remainingCapacity}
                    placeholder="Amount to stake"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="shrink-0">Stake</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Available capacity: {remainingCapacity.toFixed(4)} ETH
              </p>
            </form>
          )}

          {canUnstake && (
            <Button onClick={handleUnstake} className="w-full">
              Unstake {Number(formatEther(BigInt(stake.userStake.amount))).toFixed(4)} ETH
            </Button>
          )}

          {stake.userStake?.active && !canUnstake && (
            <p className="text-sm text-center text-muted-foreground">
              Unlocks in {Math.ceil((Number(BigInt(stake.userStake.startTime) + BigInt(stake.duration)) - Date.now() / 1000) / (24 * 60 * 60))} days
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
