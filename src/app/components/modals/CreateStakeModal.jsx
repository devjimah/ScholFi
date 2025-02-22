'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useContract } from '@/hooks/useContract';

export default function CreateStakeModal({ open, onClose }) {
  const { createStake } = useContract();
  const [formData, setFormData] = useState({
    name: '',
    maxStake: '',
    apy: '',
    duration: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStake({
        name: formData.name,
        maxStake: formData.maxStake,
        apy: parseFloat(formData.apy),
        duration: parseFloat(formData.duration),
      });
      
      onClose();
      setFormData({
        name: '',
        maxStake: '',
        apy: '',
        duration: '',
      });
    } catch (error) {
      console.error('Error creating stake pool:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Stake Pool</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Pool Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter pool name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxStake">Maximum Total Stake (ETH)</Label>
            <Input
              id="maxStake"
              name="maxStake"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Enter maximum stake"
              value={formData.maxStake}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apy">APY (%)</Label>
            <Input
              id="apy"
              name="apy"
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="Enter APY percentage"
              value={formData.apy}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (Days)</Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              step="1"
              min="1"
              placeholder="Enter duration in days"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Pool</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
