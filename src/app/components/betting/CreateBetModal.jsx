'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { parseEther } from 'viem';

export default function CreateBetModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      const amount = parseEther(formData.amount);
      onCreate({
        description: formData.description,
        amount,
      });
      onClose();
      setFormData({ description: '', amount: '' });
    } catch (error) {
      console.error('Error creating bet:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Bet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter bet description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (ETH)</Label>
            <Input
              id="amount"
              type="number"
              step="0.000000000000000001"
              min="0"
              placeholder="Enter amount in ETH"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Bet</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
