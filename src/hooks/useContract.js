'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { parseEther, keccak256, stringToHex, toHex } from 'viem';
import { UNIGAME_ABI } from '@/config/abi';
import { UNIGAME_CONTRACT_ADDRESS } from '@/config/addresses';
import { notify } from '@/app/components/ui/NotificationSystem';
import { useTransactionConfirm } from '@/hooks/useTransactionConfirm';

export function useContract() {
  const { address, account } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { confirmTransaction } = useTransactionConfirm();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bets, setBets] = useState([]);
  const [stakes, setStakes] = useState([]);
  const [polls, setPolls] = useState([]);
  const [raffles, setRaffles] = useState([]);

  // Helper function to wait for transaction and handle confirmation
  const waitForTransaction = async (hash, actionName) => {
    try {
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status === 'success' || receipt.status === 1) {
        notify({
          title: 'Success',
          description: `${actionName} was successful!`,
          type: 'success',
        });
        confirmTransaction(); // Trigger page refresh
        return true;
      }
      throw new Error(`${actionName} failed`);
    } catch (error) {
      notify({
        title: 'Error',
        description: `${actionName} failed: ${error.message}`,
        type: 'error',
      });
      return false;
    }
  };

  const fetchBets = useCallback(async () => {
    if (!publicClient) return;
    
    try {
      const betCount = await publicClient.readContract({
        address: UNIGAME_CONTRACT_ADDRESS,
        abi: UNIGAME_ABI,
        functionName: 'betCounter',
      });

      const betPromises = Array.from({ length: Number(betCount) }, async (_, i) => {
        const betId = i + 1; // betCounter starts from 1
        try {
          const bet = await publicClient.readContract({
            address: UNIGAME_CONTRACT_ADDRESS,
            abi: UNIGAME_ABI,
            functionName: 'bets',
            args: [betId],
          });

          return {
            id: betId,
            creator: bet[0],
            description: bet[1],
            eventId: bet[2],
            amount: bet[3],
            challenger: bet[4],
            challengerAmount: bet[5],
            state: bet[6],
            winner: bet[7],
            deadline: Number(bet[8]),
          };
        } catch (error) {
          console.error(`Error fetching bet ${betId}:`, error);
          return null;
        }
      });

      const bets = (await Promise.all(betPromises)).filter(Boolean);
      setBets(bets);
      setError(null);
    } catch (error) {
      console.error('Error fetching bets:', error);
      setError('Failed to fetch bets');
    } finally {
      setLoading(false);
    }
  }, [publicClient]);

  const fetchStakes = useCallback(async () => {
    if (!publicClient) return;
    
    try {
      const stakeCount = await publicClient.readContract({
        address: UNIGAME_CONTRACT_ADDRESS,
        abi: UNIGAME_ABI,
        functionName: 'stakePoolCounter',
      });

      const stakePromises = Array.from({ length: Number(stakeCount) }, async (_, i) => {
        const poolId = i + 1; // stakePoolCounter starts from 1
        try {
          const stake = await publicClient.readContract({
            address: UNIGAME_CONTRACT_ADDRESS,
            abi: UNIGAME_ABI,
            functionName: 'stakePools',
            args: [poolId],
          });

          // Get user stake if address is available
          let userStake = null;
          if (walletClient?.account) {
            try {
              const userStakeData = await publicClient.readContract({
                address: UNIGAME_CONTRACT_ADDRESS,
                abi: UNIGAME_ABI,
                functionName: 'userStakes',
                args: [poolId, walletClient.account.address],
              });
              userStake = {
                amount: userStakeData[0],
                startTime: Number(userStakeData[1]),
                active: userStakeData[2],
              };
            } catch (error) {
              console.error('Error fetching user stake:', error);
            }
          }

          return {
            id: poolId,
            name: stake[0],
            creator: stake[1],
            maxStake: stake[2],
            totalStaked: stake[3],
            apy: stake[4],
            duration: stake[5],
            startTime: Number(stake[6]),
            active: stake[7],
            userStake,
          };
        } catch (error) {
          console.error(`Error fetching stake pool ${poolId}:`, error);
          return null;
        }
      });

      const stakes = (await Promise.all(stakePromises)).filter(Boolean);
      setStakes(stakes);
      setError(null);
    } catch (error) {
      console.error('Error fetching stakes:', error);
      setError('Failed to fetch stakes');
    } finally {
      setLoading(false);
    }
  }, [publicClient, walletClient]);

  const fetchPolls = useCallback(async () => {
    if (!publicClient) return;
    
    try {
      const pollLength = await publicClient.readContract({
        address: UNIGAME_CONTRACT_ADDRESS,
        abi: UNIGAME_ABI,
        functionName: 'getPollsLength',
      });

      const pollPromises = Array.from({ length: Number(pollLength) }, async (_, i) => {
        const pollDetails = await publicClient.readContract({
          address: UNIGAME_CONTRACT_ADDRESS,
          abi: UNIGAME_ABI,
          functionName: 'getPollDetails',
          args: [i],
        });

        const options = pollDetails[1].map((text, idx) => ({
          text,
          votes: pollDetails[2][idx].toString()
        }));

        return {
          id: i,
          creator: pollDetails[4],
          question: pollDetails[0],
          options,
          endTime: Number(pollDetails[3]),
          active: pollDetails[5],
        };
      });

      const polls = await Promise.all(pollPromises);
      setPolls(polls);
      setError(null);
    } catch (error) {
      console.error('Error fetching polls:', error);
      setError('Failed to fetch polls');
    } finally {
      setLoading(false);
    }
  }, [publicClient]);

  const fetchRaffles = useCallback(async () => {
    if (!publicClient) return;
    
    try {
      const raffleCount = await publicClient.readContract({
        address: UNIGAME_CONTRACT_ADDRESS,
        abi: UNIGAME_ABI,
        functionName: 'raffleCount',
      });

      const rafflePromises = Array.from({ length: Number(raffleCount) }, async (_, i) => {
        try {
          const raffle = await publicClient.readContract({
            address: UNIGAME_CONTRACT_ADDRESS,
            abi: UNIGAME_ABI,
            functionName: 'raffles',
            args: [i],
          });

          // Get participant status if user is connected
          let hasParticipated = false;
          if (walletClient?.account) {
            try {
              // Using ticketsBought mapping directly
              const ticketCount = await publicClient.readContract({
                address: UNIGAME_CONTRACT_ADDRESS,
                abi: UNIGAME_ABI,
                functionName: 'raffles',
                args: [i],
              });
              hasParticipated = ticketCount[3] > 0; // totalPool > 0 means tickets were bought
            } catch (error) {
              console.error('Error checking participation:', error);
            }
          }

          return {
            id: i,
            creator: raffle[0] || '0x0000000000000000000000000000000000000000',
            ticketPrice: raffle[1] || 0n,
            totalPool: raffle[2] || 0n,
            endTime: Number(raffle[3] || 0),
            active: raffle[4] || false,
            winner: raffle[5] || null,
            hasParticipated,
          };
        } catch (error) {
          console.error(`Error fetching raffle ${i}:`, error);
          return null;
        }
      });

      const raffles = (await Promise.all(rafflePromises)).filter(Boolean);
      setRaffles(raffles);
      setError(null);
    } catch (error) {
      console.error('Error fetching raffles:', error);
      setError('Failed to fetch raffles');
    } finally {
      setLoading(false);
    }
  }, [publicClient, walletClient]);

  const createBet = async ({ description, amount }) => {
    if (!walletClient) throw new Error('Wallet not connected');
    if (!description || !amount) throw new Error('Missing required fields');
    if (amount <= 0) throw new Error('Amount must be greater than 0');
    
    try {
      const now = BigInt(Math.floor(Date.now() / 1000));
      const deadline = now + BigInt(7 * 24 * 60 * 60); // 7 days from now
      
      const eventId = keccak256(
        stringToHex(`${description}-${now}-${Math.random()}`)
      );

      const { hash } = await walletClient.writeContract({
        address: UNIGAME_CONTRACT_ADDRESS,
        abi: UNIGAME_ABI,
        functionName: 'createBet',
        args: [description, eventId, deadline],
        value: parseEther(amount.toString()),
      });

      const success = await waitForTransaction(hash, 'Create Bet');
      if (success) {
        await fetchBets();
      }
    } catch (error) {
      console.error('Error creating bet:', error);
      notify({
        title: 'Error',
        description: error.message || 'Failed to create bet',
        type: 'error',
      });
      throw error;
    }
  };

  const createStake = async ({ name, maxStake, apy, duration }) => {
    if (!walletClient) throw new Error('Wallet not connected');
    if (!name || !maxStake || !apy || !duration) throw new Error('Missing required fields');
    if (maxStake <= 0) throw new Error('Max stake must be greater than 0');
    if (apy <= 0 || apy > 100) throw new Error('APY must be between 0 and 100');
    if (duration <= 0) throw new Error('Duration must be greater than 0');
    
    try {
      const maxStakeBigInt = parseEther(maxStake.toString());
      const apyBigInt = BigInt(Math.floor(apy * 100)); // Convert percentage to basis points
      const durationBigInt = BigInt(Math.floor(duration * 24 * 60 * 60)); // Convert days to seconds
      
      const { hash } = await walletClient.writeContract({
        address: UNIGAME_CONTRACT_ADDRESS,
        abi: UNIGAME_ABI,
        functionName: 'createStakePool',
        args: [name, maxStakeBigInt, apyBigInt, durationBigInt],
      });

      const success = await waitForTransaction(hash, 'Create Stake Pool');
      if (success) {
        await fetchStakes();
      }
    } catch (error) {
      console.error('Error creating stake pool:', error);
      notify({
        title: 'Error',
        description: error.message || 'Failed to create stake pool',
        type: 'error',
      });
      throw error;
    }
  };

  const createPoll = async ({ question, options, duration }) => {
    if (!walletClient) throw new Error('Wallet not connected');
    if (!question || !options || !duration) throw new Error('Missing required fields');
    if (!Array.isArray(options) || options.length < 2) throw new Error('At least 2 options are required');
    if (duration <= 0) throw new Error('Duration must be greater than 0');
    
    try {
      const durationBigInt = BigInt(Math.floor(duration * 24 * 60 * 60)); // Convert days to seconds
      
      const { hash } = await walletClient.writeContract({
        address: UNIGAME_CONTRACT_ADDRESS,
        abi: UNIGAME_ABI,
        functionName: 'createPoll',
        args: [question, options, durationBigInt],
      });

      const success = await waitForTransaction(hash, 'Create Poll');
      if (success) {
        await fetchPolls();
      }
    } catch (error) {
      console.error('Error creating poll:', error);
      notify({
        title: 'Error',
        description: error.message || 'Failed to create poll',
        type: 'error',
      });
      throw error;
    }
  };

  const createRaffle = useCallback(async ({ ticketPrice, duration }) => {
    if (!walletClient) throw new Error('Wallet not connected');
    if (!ticketPrice || !duration) throw new Error('Missing required fields');
    if (ticketPrice <= 0) throw new Error('Ticket price must be greater than 0');
    if (duration <= 0) throw new Error('Duration must be greater than 0');

    try {
      const ticketPriceBigInt = parseEther(ticketPrice.toString());
      const durationBigInt = BigInt(Math.floor(duration * 24 * 60 * 60)); // Convert days to seconds

      const { hash } = await walletClient.writeContract({
        address: UNIGAME_CONTRACT_ADDRESS,
        abi: UNIGAME_ABI,
        functionName: 'createRaffle',
        args: [ticketPriceBigInt, durationBigInt],
      });

      const success = await waitForTransaction(hash, 'Create Raffle');
      if (success) {
        await fetchRaffles();
      }
    } catch (error) {
      console.error('Error creating raffle:', error);
      notify({
        title: 'Error',
        description: error.message || 'Failed to create raffle',
        type: 'error',
      });
      throw error;
    }
  }, [walletClient, publicClient, fetchRaffles]);

  const stake = async (poolId, amount) => {
    if (!walletClient) throw new Error('Wallet not connected');
    
    try {
      console.log('Staking in pool:', poolId, 'amount:', amount);
      
      const value = parseEther(amount.toString());
      console.log('Parsed value:', value);
      
      const { hash } = await walletClient.writeContract({
        address: UNIGAME_CONTRACT_ADDRESS,
        abi: UNIGAME_ABI,
        functionName: 'stake',
        args: [poolId],
        value,
      });

      const success = await waitForTransaction(hash, 'Stake');
      if (success) {
        await fetchStakes();
      }
    } catch (error) {
      console.error('Error staking:', error);
      notify({
        title: 'Error',
        description: error.message || 'Failed to stake',
        type: 'error',
      });
      throw error;
    }
  };

  const unstake = async (poolId) => {
    if (!walletClient) throw new Error('Wallet not connected');
    
    try {
      console.log('Unstaking from pool:', poolId);
      
      const { hash } = await walletClient.writeContract({
        address: UNIGAME_CONTRACT_ADDRESS,
        abi: UNIGAME_ABI,
        functionName: 'unstake',
        args: [poolId],
      });

      const success = await waitForTransaction(hash, 'Unstake');
      if (success) {
        await fetchStakes();
      }
    } catch (error) {
      console.error('Error unstaking:', error);
      notify({
        title: 'Error',
        description: error.message || 'Failed to unstake',
        type: 'error',
      });
      throw error;
    }
  };

  const vote = useCallback(async (pollId, optionIndex) => {
    if (!walletClient) {
      throw new Error('Wallet not connected');
    }

    try {
      const { request } = await publicClient.simulateContract({
        address: UNIGAME_CONTRACT_ADDRESS,
        abi: UNIGAME_ABI,
        functionName: 'vote',
        args: [pollId, optionIndex],
        account: walletClient.account,
      });

      const hash = await walletClient.writeContract(request);
      const success = await waitForTransaction(hash, 'Vote');
      if (success) {
        await fetchPolls();
      }
    } catch (error) {
      console.error('Vote error:', error);
      throw error;
    }
  }, [walletClient, publicClient, fetchPolls]);

  // Bet Participation
  const acceptBet = async (betId, amount) => {
    if (!walletClient) throw new Error('Wallet not connected');
    if (!betId || !amount) throw new Error('Missing required fields');
    if (amount <= 0) throw new Error('Amount must be greater than 0');
    
    try {
      const { hash } = await walletClient.writeContract({
        address: UNIGAME_CONTRACT_ADDRESS,
        abi: UNIGAME_ABI,
        functionName: 'acceptBet',
        args: [betId],
        value: parseEther(amount.toString()),
      });

      const success = await waitForTransaction(hash, 'Accept Bet');
      if (success) {
        await fetchBets();
      }
    } catch (error) {
      console.error('Error accepting bet:', error);
      notify({
        title: 'Error',
        description: error.message || 'Failed to accept bet',
        type: 'error',
      });
      throw error;
    }
  };

  // Poll Participation
  const submitVote = async (pollId, optionIndex) => {
    if (!walletClient) throw new Error('Wallet not connected');
    if (pollId === undefined || optionIndex === undefined) throw new Error('Missing required fields');
    
    try {
      const { hash } = await walletClient.writeContract({
        address: UNIGAME_CONTRACT_ADDRESS,
        abi: UNIGAME_ABI,
        functionName: 'vote',
        args: [pollId, optionIndex],
      });

      const success = await waitForTransaction(hash, 'Submit Vote');
      if (success) {
        await fetchPolls();
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      notify({
        title: 'Error',
        description: error.message || 'Failed to submit vote',
        type: 'error',
      });
      throw error;
    }
  };

  // Raffle Participation
  const buyRaffleTickets = async (raffleId, ticketCount) => {
    if (!walletClient) throw new Error('Wallet not connected');
    if (!raffleId || !ticketCount) throw new Error('Missing required fields');
    if (ticketCount <= 0) throw new Error('Must buy at least one ticket');

    try {
      const raffle = await publicClient.readContract({
        address: UNIGAME_CONTRACT_ADDRESS,
        abi: UNIGAME_ABI,
        functionName: 'raffles',
        args: [raffleId],
      });

      const totalCost = raffle.ticketPrice * BigInt(ticketCount);

      const { hash } = await walletClient.writeContract({
        address: UNIGAME_CONTRACT_ADDRESS,
        abi: UNIGAME_ABI,
        functionName: 'buyTicket',
        args: [raffleId, ticketCount],
        value: totalCost,
      });

      const success = await waitForTransaction(hash, 'Buy Raffle Tickets');
      if (success) {
        await fetchRaffles();
      }
    } catch (error) {
      console.error('Error buying raffle tickets:', error);
      notify({
        title: 'Error',
        description: error.message || 'Failed to buy raffle tickets',
        type: 'error',
      });
      throw error;
    }
  };

  // Stake Participation
  const stakeInPool = async (poolId, amount) => {
    if (!walletClient) throw new Error('Wallet not connected');
    if (!poolId || !amount) throw new Error('Missing required fields');
    if (amount <= 0) throw new Error('Amount must be greater than 0');

    try {
      const { hash } = await walletClient.writeContract({
        address: UNIGAME_CONTRACT_ADDRESS,
        abi: UNIGAME_ABI,
        functionName: 'stake',
        args: [poolId],
        value: parseEther(amount.toString()),
      });

      const success = await waitForTransaction(hash, 'Stake');
      if (success) {
        await fetchStakes();
      }
    } catch (error) {
      console.error('Error staking:', error);
      notify({
        title: 'Error',
        description: error.message || 'Failed to stake',
        type: 'error',
      });
      throw error;
    }
  };

  const unstakeFromPool = async (poolId) => {
    if (!walletClient) throw new Error('Wallet not connected');
    if (!poolId) throw new Error('Missing pool ID');

    try {
      const { hash } = await walletClient.writeContract({
        address: UNIGAME_CONTRACT_ADDRESS,
        abi: UNIGAME_ABI,
        functionName: 'unstake',
        args: [poolId],
      });

      const success = await waitForTransaction(hash, 'Unstake');
      if (success) {
        await fetchStakes();
      }
    } catch (error) {
      console.error('Error unstaking:', error);
      notify({
        title: 'Error',
        description: error.message || 'Failed to unstake',
        type: 'error',
      });
      throw error;
    }
  };

  // Additional helper functions
  const checkUserVoted = async (pollId, address) => {
    try {
      return await publicClient.readContract({
        address: UNIGAME_CONTRACT_ADDRESS,
        abi: UNIGAME_ABI,
        functionName: 'hasVoted',
        args: [pollId, address],
      });
    } catch (error) {
      console.error('Error checking vote status:', error);
      return false;
    }
  };

  const getUserStakeInfo = async (poolId, address) => {
    try {
      return await publicClient.readContract({
        address: UNIGAME_CONTRACT_ADDRESS,
        abi: UNIGAME_ABI,
        functionName: 'userStakes',
        args: [poolId, address],
      });
    } catch (error) {
      console.error('Error fetching stake info:', error);
      return null;
    }
  };

  const getRaffleTickets = async (raffleId, address) => {
    try {
      return await publicClient.readContract({
        address: UNIGAME_CONTRACT_ADDRESS,
        abi: UNIGAME_ABI,
        functionName: 'ticketsBought',
        args: [raffleId, address],
      });
    } catch (error) {
      console.error('Error fetching raffle tickets:', error);
      return 0;
    }
  };

  useEffect(() => {
    if (publicClient) {
      fetchBets();
      fetchStakes();
      fetchPolls();
      fetchRaffles();
    }
  }, [fetchBets, fetchStakes, fetchPolls, fetchRaffles, publicClient]);

  return {
    bets,
    polls,
    raffles,
    stakes,
    error,
    loading,
    createBet,
    createPoll,
    createRaffle,
    createStake,
    vote,
    stake,
    unstake,
    fetchBets,
    fetchPolls,
    fetchRaffles,
    fetchStakes,
    acceptBet,
    submitVote,
    buyRaffleTickets,
    stakeInPool,
    unstakeFromPool,
    checkUserVoted,
    getUserStakeInfo,
    getRaffleTickets,
  };
}
