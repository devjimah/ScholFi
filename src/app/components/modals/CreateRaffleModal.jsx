'use client';

import { useState } from 'react';
import { parseEther } from 'viem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { notify } from '@/app/components/ui/NotificationSystem';

export default function CreateRaffleModal({ onClose, onCreate }) {
  const [ticketPrice, setTicketPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!ticketPrice || !duration) {
      notify('error', 'Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreate({
        ticketPrice: parseEther(ticketPrice),
        duration: parseInt(duration) * 3600 // Convert hours to seconds
      });
      notify('success', 'Raffle created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating raffle:', error);
      notify('error', error.message || 'Failed to create raffle');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Raffle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ticketPrice">Ticket Price (ETH)</Label>
            <Input
              id="ticketPrice"
              type="number"
              step="0.001"
              min="0"
              placeholder="0.1"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (hours)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              placeholder="24"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
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
              {isSubmitting ? 'Creating...' : 'Create Raffle'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
