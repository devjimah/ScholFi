'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { parseEther } from 'viem';

export default function CreateStakeModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [maxStake, setMaxStake] = useState('');
  const [apy, setApy] = useState('');
  const [duration, setDuration] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !maxStake || !apy || !duration) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreate({
        name,
        maxStake: parseEther(maxStake),
        apy: parseFloat(apy),
        duration: parseInt(duration),
      });
      onClose();
    } catch (error) {
      console.error('Error creating stake:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Staking Pool</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Pool Name</Label>
            <Input
              id="name"
              placeholder="Enter pool name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxStake">Maximum Total Stake (ETH)</Label>
            <Input
              id="maxStake"
              type="number"
              placeholder="Enter maximum stake"
              value={maxStake}
              onChange={(e) => setMaxStake(e.target.value)}
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apy">APY (%)</Label>
            <Input
              id="apy"
              type="number"
              placeholder="Enter APY percentage"
              value={apy}
              onChange={(e) => setApy(e.target.value)}
              min="0"
              max="1000"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (days)</Label>
            <Input
              id="duration"
              type="number"
              placeholder="Enter duration in days"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="1"
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Pool'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
