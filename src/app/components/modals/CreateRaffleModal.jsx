'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { notify } from '@/app/components/ui/NotificationSystem';
import { useContract } from '@/hooks/useContract';

export default function CreateRaffleModal({ open, onClose }) {
  const { createRaffle } = useContract();
  const [ticketPrice, setTicketPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!ticketPrice || !duration) {
      notify({
        title: 'Error',
        description: 'Please fill in all fields',
        type: 'error'
      });
      return;
    }

    if (isNaN(ticketPrice) || parseFloat(ticketPrice) <= 0) {
      notify({
        title: 'Error',
        description: 'Please enter a valid ticket price',
        type: 'error'
      });
      return;
    }

    if (isNaN(duration) || parseFloat(duration) <= 0) {
      notify({
        title: 'Error',
        description: 'Please enter a valid duration in days',
        type: 'error'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await createRaffle(parseFloat(ticketPrice), parseFloat(duration));
      
      onClose();
      setTicketPrice('');
      setDuration('');
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error creating raffle:', error);
      notify({
        title: 'Error',
        description: error.message || 'Failed to create raffle',
        type: 'error'
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Raffle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="ticketPrice">Ticket Price (ETH)</Label>
            <Input
              id="ticketPrice"
              type="number"
              step="0.001"
              min="0"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              placeholder="0.001"
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration (days)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="7"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Raffle'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
