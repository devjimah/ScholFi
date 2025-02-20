'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useContract } from '@/hooks/useContract';
import { notify } from '@/app/components/ui/NotificationSystem';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  RefreshCw, 
  Loader2,
  Coins,
  Vote,
  Ticket,
  Wallet
} from 'lucide-react';
import CustomConnectButton from '@/app/components/ui/CustomConnectButton';
import BetHistory from '@/app/components/bets/BetHistory';
import PollCard from '@/app/components/polls/PollCard';
import StakeCard from '@/app/components/stake/StakeCard';
import CreateBetModal from '@/app/components/modals/CreateBetModal';
import CreateRaffleModal from '@/app/components/modals/CreateRaffleModal';
import CreatePollModal from '@/app/components/modals/CreatePollModal';
import CreateStakeModal from '@/app/components/modals/CreateStakeModal';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { formatEther } from 'viem';
import BetStats from '../components/stats/BetStats';
import BetCard from '../components/bet/BetCard';

export default function BetsPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [showCreateBetModal, setShowCreateBetModal] = useState(false);
  const [showCreatePollModal, setShowCreatePollModal] = useState(false);
  const [showCreateRaffleModal, setShowCreateRaffleModal] = useState(false);
  const [showCreateStakeModal, setShowCreateStakeModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showBetHistory, setShowBetHistory] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { 
    bets,
    polls,
    raffles, 
    stakes,
    loading: isLoading, 
    error,
    acceptBet,
    buyTicket,
    createBet,
    createPoll,
    createRaffle,
    createStake,
    stake,
    vote,
    fetchBets,
    fetchPolls,
    fetchRaffles,
    fetchStakes
  } = useContract();

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isConnected && mounted) {
      router.push('/');
    }
  }, [isConnected, router, mounted]);

  // Early return while loading or not mounted
  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <Button onClick={handleRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([fetchBets(), fetchPolls(), fetchRaffles(), fetchStakes()]);
      notify('success', 'Data refreshed successfully');
    } catch (error) {
      notify('error', 'Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDisconnect = () => {
    router.push('/');
  };

  const handleCreateBet = async (data) => {
    try {
      await createBet(data);
      notify('success', 'Bet created successfully');
    } catch (error) {
      notify('error', 'Failed to create bet');
    }
  };

  const handleCreatePoll = async (data) => {
    try {
      await createPoll(data);
      notify('success', 'Poll created successfully');
    } catch (error) {
      notify('error', 'Failed to create poll');
    }
  };

  const handleCreateRaffle = async (data) => {
    try {
      await createRaffle(data);
      notify('success', 'Raffle created successfully');
    } catch (error) {
      notify('error', 'Failed to create raffle');
    }
  };

  const handleCreateStake = async (data) => {
    try {
      await createStake(data);
      notify('success', 'Stake created successfully');
    } catch (error) {
      notify('error', 'Failed to create stake');
    }
  };

  const handleVote = async (pollId, optionIndex) => {
    try {
      await vote(pollId, optionIndex);
      notify('success', 'Vote recorded successfully');
    } catch (error) {
      notify('error', error.message || 'Failed to vote');
    }
  };

  const handleStake = async (stakeId, amount) => {
    try {
      await stake(stakeId, amount);
      notify('success', 'Successfully staked ETH');
    } catch (error) {
      notify('error', error.message || 'Failed to stake ETH');
    }
  };

  const calculateStats = () => {
    if (!bets || !address) return null;

    const userBets = bets.filter(bet => bet.creator === address || bet.challenger === address);
    const wonBets = userBets.filter(bet => bet.winner === address);
    const totalVolume = userBets.reduce((acc, bet) => acc + parseFloat(formatEther(bet.amount)), 0);
    const netProfit = wonBets.reduce((acc, bet) => acc + parseFloat(formatEther(bet.amount)), 0);

    return {
      totalBets: userBets.length,
      winRate: userBets.length ? (wonBets.length / userBets.length) * 100 : 0,
      totalVolume,
      netProfit
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/90 to-background/80">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl uppercase font-bold">Your Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">Refresh</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-primary via-purple-500 to-pink-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setShowCreateBetModal(true)}>
                  <Coins className="h-4 w-4 mr-2" />
                  Create Bet
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setShowCreatePollModal(true)}>
                  <Vote className="h-4 w-4 mr-2" />
                  Create Poll
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setShowCreateRaffleModal(true)}>
                  <Ticket className="h-4 w-4 mr-2" />
                  Create Raffle
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setShowCreateStakeModal(true)}>
                  <Coins className="h-4 w-4 mr-2" />
                  Create Stake
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-2">
              <CustomConnectButton />
              {isConnected && (
                <Button variant="outline" size="sm" onClick={handleDisconnect} className="gap-2">
                  <Wallet className="h-4 w-4" />
                  Disconnect
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-8">
          <BetStats stats={calculateStats()} />
        </div>

        <div className="space-y-8">
          <Tabs defaultValue="bets" className="w-full">
            <TabsList>
              <TabsTrigger value="bets">Bets</TabsTrigger>
              <TabsTrigger value="polls">Polls</TabsTrigger>
              <TabsTrigger value="raffles">Raffles</TabsTrigger>
              <TabsTrigger value="staking">Staking</TabsTrigger>
            </TabsList>

            <TabsContent value="bets">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Active Bets</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBetHistory(!showBetHistory)}
                >
                  {showBetHistory ? 'Show Active Bets' : 'Show Bet History'}
                </Button>
              </div>

              {showBetHistory ? (
                <BetHistory bets={bets} userAddress={address} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {bets.filter(bet => !bet.resolved).map((bet) => (
                    <div key={bet.id} className="group relative p-0.5 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
                      <div className="relative rounded-lg bg-background p-1">
                        <Card className="w-full border-0">
                          <CardContent className="p-4">
                            <BetCard bet={bet} onAccept={acceptBet} userAddress={address} />
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                  {bets.filter(bet => !bet.resolved).length === 0 && (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      No active bets available
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="polls">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {polls.map((poll) => (
                  <div key={poll.id} className="group relative p-0.5 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
                    <div className="relative rounded-lg bg-background p-1">
                      <Card className="w-full border-0">
                        <CardContent className="p-4">
                          <PollCard poll={poll} onVote={handleVote} userAddress={address} />
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
                {polls.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No polls available
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="raffles">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {raffles.map((raffle) => (
                  <div key={raffle.id} className="group relative p-0.5 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
                    <div className="relative rounded-lg bg-background p-1">
                      <Card className="w-full border-0">
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-semibold">{raffle.prize}</h3>
                              <p className="text-sm text-muted-foreground">
                                Ticket Price: {formatEther(raffle.ticketPrice)} ETH
                              </p>
                            </div>
                            <Button 
                              className="w-full" 
                              onClick={() => buyTicket(raffle.id)}
                              disabled={raffle.ended}
                            >
                              {raffle.ended ? 'Raffle Ended' : 'Buy Ticket'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
                {raffles.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No raffles available
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="staking">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {stakes.map((stake) => (
                  <div key={stake.id} className="group relative p-0.5 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
                    <div className="relative rounded-lg bg-background p-1">
                      <Card className="w-full border-0">
                        <CardContent className="p-4">
                          <StakeCard stake={stake} onStake={handleStake} userAddress={address} />
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
                {stakes.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No staking pools available
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {showCreateBetModal && (
        <CreateBetModal
          onClose={() => setShowCreateBetModal(false)}
          onCreate={handleCreateBet}
        />
      )}

      {showCreatePollModal && (
        <CreatePollModal
          onClose={() => setShowCreatePollModal(false)}
          onCreate={handleCreatePoll}
        />
      )}

      {showCreateRaffleModal && (
        <CreateRaffleModal
          onClose={() => setShowCreateRaffleModal(false)}
          onCreate={handleCreateRaffle}
        />
      )}

      {showCreateStakeModal && (
        <CreateStakeModal
          onClose={() => setShowCreateStakeModal(false)}
          onCreate={handleCreateStake}
        />
      )}
    </div>
  );
}
