'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { notify } from '../components/ui/NotificationSystem';
import { useContract } from '../components/hooks/useContract';
import { Loader2 } from 'lucide-react';

export default function CreatePage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const contract = useContract();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('bet');

  // Bet form state
  const [betForm, setBetForm] = useState({
    description: '',
    amount: '',
  });

  // Poll form state
  const [pollForm, setPollForm] = useState({
    description: '',
    options: ['', '', ''],
  });

  // Raffle form state
  const [raffleForm, setRaffleForm] = useState({
    description: '',
    ticketPrice: '',
    maxTickets: '',
  });

  const handleCreateBet = async (e) => {
    e.preventDefault();
    if (!isConnected) {
      notify('error', 'Please connect your wallet first');
      return;
    }

    try {
      setIsLoading(true);
      const newBet = await contract.createItem({
        type: 'bet',
        description: betForm.description,
        amount: betForm.amount,
      });

      notify('success', 'Bet created successfully!');
      router.push('/bets');
    } catch (error) {
      console.error('Error creating bet:', error);
      notify('error', 'Failed to create bet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    if (!isConnected) {
      notify('error', 'Please connect your wallet first');
      return;
    }

    // Filter out empty options
    const validOptions = pollForm.options.filter(option => option.trim() !== '');
    if (validOptions.length < 2) {
      notify('error', 'Please provide at least 2 options');
      return;
    }

    try {
      setIsLoading(true);
      const newPoll = await contract.createItem({
        type: 'poll',
        description: pollForm.description,
        options: validOptions,
      });

      notify('success', 'Poll created successfully!');
      router.push('/bets');
    } catch (error) {
      console.error('Error creating poll:', error);
      notify('error', 'Failed to create poll');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRaffle = async (e) => {
    e.preventDefault();
    if (!isConnected) {
      notify('error', 'Please connect your wallet first');
      return;
    }

    try {
      setIsLoading(true);
      const newRaffle = await contract.createItem({
        type: 'raffle',
        description: raffleForm.description,
        ticketPrice: raffleForm.ticketPrice,
        maxTickets: parseInt(raffleForm.maxTickets),
      });

      notify('success', 'Raffle created successfully!');
      router.push('/bets');
    } catch (error) {
      console.error('Error creating raffle:', error);
      notify('error', 'Failed to create raffle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPollOption = () => {
    setPollForm(prev => ({
      ...prev,
      options: [...prev.options, ''],
    }));
  };

  const handleRemovePollOption = (index) => {
    setPollForm(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handlePollOptionChange = (index, value) => {
    setPollForm(prev => ({
      ...prev,
      options: prev.options.map((option, i) => i === index ? value : option),
    }));
  };

  if (!isConnected) {
    router.replace('/');
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-transparent bg-clip-text">
        Create New Item
      </h1>

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="bet">Bet</TabsTrigger>
            <TabsTrigger value="poll">Poll</TabsTrigger>
            <TabsTrigger value="raffle">Raffle</TabsTrigger>
          </TabsList>

          <TabsContent value="bet">
            <form onSubmit={handleCreateBet} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bet-description">Description</Label>
                <Textarea
                  id="bet-description"
                  placeholder="What's your prediction?"
                  value={betForm.description}
                  onChange={(e) => setBetForm(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bet-amount">Amount (ETH)</Label>
                <Input
                  id="bet-amount"
                  type="number"
                  step="0.001"
                  min="0"
                  placeholder="0.1"
                  value={betForm.amount}
                  onChange={(e) => setBetForm(prev => ({ ...prev, amount: e.target.value }))}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Create Bet'
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="poll">
            <form onSubmit={handleCreatePoll} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="poll-description">Question</Label>
                <Textarea
                  id="poll-description"
                  placeholder="What would you like to ask?"
                  value={pollForm.description}
                  onChange={(e) => setPollForm(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-4">
                <Label>Options</Label>
                {pollForm.options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handlePollOptionChange(index, e.target.value)}
                      required
                    />
                    {pollForm.options.length > 2 && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleRemovePollOption(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                {pollForm.options.length < 6 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddPollOption}
                  >
                    Add Option
                  </Button>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Create Poll'
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="raffle">
            <form onSubmit={handleCreateRaffle} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="raffle-description">Description</Label>
                <Textarea
                  id="raffle-description"
                  placeholder="What's the prize?"
                  value={raffleForm.description}
                  onChange={(e) => setRaffleForm(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticket-price">Ticket Price (ETH)</Label>
                <Input
                  id="ticket-price"
                  type="number"
                  step="0.001"
                  min="0"
                  placeholder="0.01"
                  value={raffleForm.ticketPrice}
                  onChange={(e) => setRaffleForm(prev => ({ ...prev, ticketPrice: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-tickets">Maximum Tickets</Label>
                <Input
                  id="max-tickets"
                  type="number"
                  min="1"
                  placeholder="100"
                  value={raffleForm.maxTickets}
                  onChange={(e) => setRaffleForm(prev => ({ ...prev, maxTickets: e.target.value }))}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Create Raffle'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </main>
  );
}
