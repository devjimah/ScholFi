'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { parseEther } from 'viem';

export default function CreateRaffleModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    description: '',
    ticketPrice: '',
    maxTickets: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      const ticketPrice = parseEther(formData.ticketPrice);
      onCreate({
        description: formData.description,
        ticketPrice,
        maxTickets: parseInt(formData.maxTickets),
      });
      onClose();
      setFormData({ description: '', ticketPrice: '', maxTickets: '' });
    } catch (error) {
      console.error('Error creating raffle:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Raffle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter raffle description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ticketPrice">Ticket Price (ETH)</Label>
            <Input
              id="ticketPrice"
              type="number"
              step="0.000000000000000001"
              min="0"
              placeholder="Enter ticket price in ETH"
              value={formData.ticketPrice}
              onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxTickets">Maximum Tickets</Label>
            <Input
              id="maxTickets"
              type="number"
              min="1"
              placeholder="Enter maximum number of tickets"
              value={formData.maxTickets}
              onChange={(e) => setFormData({ ...formData, maxTickets: e.target.value })}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Raffle</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
