'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { notify } from '@/app/components/ui/NotificationSystem';
import { useContract } from '@/hooks/useContract';

export default function CreatePollModal({ open, onClose }) {
  const { createPoll } = useContract();
  const [question, setQuestion] = useState('');
  const [duration, setDuration] = useState('');
  const [options, setOptions] = useState(['', '']); // Start with 2 empty options
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question || !duration || options.some(opt => !opt.trim())) {
      notify({
        title: 'Error',
        description: 'Please fill in all fields including options',
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

    if (options.length < 2 || options.length > 10) {
      notify({
        title: 'Error',
        description: 'Number of options must be between 2 and 10',
        type: 'error'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await createPoll({
        question,
        duration: parseFloat(duration),
        options: options.map(opt => opt.trim()).filter(opt => opt), // Filter out empty options
      });
      
      onClose();
      setQuestion('');
      setDuration('');
      setOptions(['', '']);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error creating poll:', error);
      setIsSubmitting(false);
    }
  };

  const handleDurationChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setDuration(value);
    }
  };

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Poll</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              placeholder="Enter your question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (days)</Label>
            <Input
              id="duration"
              type="text"
              placeholder="Enter duration in days"
              value={duration}
              onChange={handleDurationChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Options</Label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    required
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeOption(index)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {options.length < 10 && (
              <Button
                type="button"
                variant="outline"
                onClick={addOption}
                className="w-full mt-2"
              >
                Add Option
              </Button>
            )}
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
              {isSubmitting ? 'Creating...' : 'Create Poll'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
