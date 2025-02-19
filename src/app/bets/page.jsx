'use client';

import { useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Search, Filter, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BetCard from '../components/betting/BetCard';
import PollCard from '../components/betting/PollCard';
import RaffleCard from '../components/betting/RaffleCard';
import { notify } from '../components/ui/NotificationSystem';
import { useMockContract } from '../components/hooks/useMockContract';

export default function BetsPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const contract = useMockContract();
  console.log('Current contract items:', contract.items);

  useEffect(() => {
    // Redirect to home if not connected
    if (!isConnected) {
      router.replace('/');
      return;
    }

    const fetchItems = async () => {
      try {
        setIsLoading(true);
        await contract.getAllItems();
      } catch (error) {
        console.error('Error fetching items:', error);
        notify('error', 'Failed to fetch items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [isConnected, router, contract]);

  const handleDisconnect = async () => {
    try {
      await disconnect();
      notify('success', 'Wallet disconnected');
      router.replace('/');
    } catch (error) {
      console.error('Error disconnecting:', error);
      notify('error', 'Failed to disconnect wallet');
    }
  };

  const handleAcceptBet = async (betId, amount) => {
    try {
      await contract.acceptBet(betId, amount);
      notify('success', 'Bet accepted successfully!');
    } catch (error) {
      console.error('Error accepting bet:', error);
      notify('error', 'Failed to accept bet');
    }
  };

  const handleVotePoll = async (pollId, optionIndex) => {
    try {
      await contract.votePoll(pollId, optionIndex);
      notify('success', 'Vote recorded successfully!');
    } catch (error) {
      console.error('Error voting in poll:', error);
      notify('error', 'Failed to vote in poll');
    }
  };

  const handleBuyRaffleTickets = async (raffleId, amount) => {
    try {
      await contract.buyRaffleTickets(raffleId, amount);
      notify('success', `Successfully purchased ${amount} ticket(s)!`);
    } catch (error) {
      console.error('Error buying raffle tickets:', error);
      notify('error', 'Failed to buy raffle tickets');
    }
  };

  const renderItem = (item) => {
    console.log('Rendering item:', item);
    switch (item.type) {
      case 'bet':
        return (
          <BetCard 
            key={item.id} 
            bet={item} 
            onAccept={handleAcceptBet}
          />
        );
      case 'poll':
        return (
          <PollCard 
            key={item.id} 
            poll={item} 
            onVote={handleVotePoll}
          />
        );
      case 'raffle':
        return (
          <RaffleCard 
            key={item.id} 
            raffle={item} 
            onBuyTickets={handleBuyRaffleTickets}
          />
        );
      default:
        console.log('Unknown item type:', item.type);
        return null;
    }
  };

  const filteredItems = contract.items.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesType = activeTab === 'all' || item.type === activeTab;
    return matchesSearch && matchesStatus && matchesType;
  });

  console.log('Filtered items:', filteredItems);

  // Show nothing while checking connection status
  if (!isConnected) {
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-transparent bg-clip-text">
              Betting Platform
            </h1>
            <p className="text-muted-foreground mt-2">
              Create, join, and track various betting activities
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Card className="bg-background/50">
                <CardContent className="py-2 px-4 flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </CardContent>
              </Card>
              <Button
                variant="outline"
                onClick={handleDisconnect}
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                Disconnect
              </Button>
            </div>

            <Link href="/create">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create New
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs and Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 max-w-[400px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="bet">Bets</TabsTrigger>
            <TabsTrigger value="poll">Polls</TabsTrigger>
            <TabsTrigger value="raffle">Raffles</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => renderItem(item))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold">No items found</h3>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your filters or create a new item
                </p>
                <Link href="/create">
                  <Button className="mt-4">
                    Create New Item
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </main>
  );
}
