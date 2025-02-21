'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useDisconnect } from 'wagmi';
import { useContract } from '@/hooks/useContract';
import { notify } from '@/app/components/ui/NotificationSystem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  RefreshCw, 
  Loader2,
  History,
  LogOut,
  Boxes,
} from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import CustomConnectButton from '@/app/components/ui/CustomConnectButton';
import UserHistory from '@/app/components/history/UserHistory';
import CreateBetModal from '@/app/components/modals/CreateBetModal';
import CreateRaffleModal from '@/app/components/modals/CreateRaffleModal';
import CreatePollModal from '@/app/components/modals/CreatePollModal';
import CreateStakeModal from '@/app/components/modals/CreateStakeModal';
import ProjectStats from '@/app/components/stats/ProjectStats';
import ActiveItems from '@/app/components/active/ActiveItems';

export default function BetsPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [showCreateBetModal, setShowCreateBetModal] = useState(false);
  const [showCreatePollModal, setShowCreatePollModal] = useState(false);
  const [showCreateRaffleModal, setShowCreateRaffleModal] = useState(false);
  const [showCreateStakeModal, setShowCreateStakeModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { 
    bets,
    polls,
    raffles,
    stakes,
    loading: isLoading, 
    error,
    createBet,
    createPoll,
    createRaffle,
    createStake,
  } = useContract();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isConnected && mounted) {
      router.push('/');
    }
  }, [isConnected, router, mounted]);

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <Button onClick={() => router.refresh()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
      {/* Header Actions */}
      <div className="flex justify-end space-x-4">
        <CustomConnectButton />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowCreateBetModal(true)}>
              Create Bet
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowCreatePollModal(true)}>
              Create Poll
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowCreateRaffleModal(true)}>
              Create Raffle
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowCreateStakeModal(true)}>
              Create Stake Pool
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" onClick={() => disconnect()}>
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </Button>
      </div>

      {/* Project Stats */}
      <ProjectStats 
        bets={bets}
        polls={polls}
        raffles={raffles}
        stakes={stakes}
      />

      {/* Main Content */}
      <div className="space-y-8">
        {/* History */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <History className="w-4 h-4 mr-2" />
              Activity History
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <UserHistory 
              bets={bets}
              polls={polls}
              raffles={raffles}
              stakes={stakes}
              userAddress={address}
            />
          </CardContent>
        </Card>

        {/* Active Items */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Boxes className="w-4 h-4 mr-2" />
              Active Items
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ActiveItems 
              bets={bets}
              polls={polls}
              raffles={raffles}
              stakes={stakes}
              userAddress={address}
              onCreateBet={() => setShowCreateBetModal(true)}
              onCreatePoll={() => setShowCreatePollModal(true)}
              onCreateRaffle={() => setShowCreateRaffleModal(true)}
              onCreateStake={() => setShowCreateStakeModal(true)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <CreateBetModal
        open={showCreateBetModal}
        onClose={() => setShowCreateBetModal(false)}
        onCreate={createBet}
      />
      <CreatePollModal
        open={showCreatePollModal}
        onClose={() => setShowCreatePollModal(false)}
        onCreate={createPoll}
      />
      <CreateRaffleModal
        open={showCreateRaffleModal}
        onClose={() => setShowCreateRaffleModal(false)}
        onCreate={createRaffle}
      />
      <CreateStakeModal
        open={showCreateStakeModal}
        onClose={() => setShowCreateStakeModal(false)}
        onCreate={createStake}
      />
    </div>
  );
}
