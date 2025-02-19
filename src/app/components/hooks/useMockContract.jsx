'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

const STORAGE_KEY = 'scholfi_bets';

export function useMockContract() {
  const { address, isConnected } = useAccount();
  const [isCreating, setIsCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [bets, setBets] = useState([]);

  // Load bets from localStorage on mount
  useEffect(() => {
    const storedBets = localStorage.getItem(STORAGE_KEY);
    if (storedBets) {
      setBets(JSON.parse(storedBets));
    }
  }, []);

  // Save bets to localStorage whenever they change
  useEffect(() => {
    if (bets.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bets));
    }
  }, [bets]);

  const handleCreateBet = async (description, amount) => {
    if (!isConnected || !address) {
      const error = new Error('Please connect your wallet first');
      setCreateError(error);
      throw error;
    }

    setIsCreating(true);
    setCreateSuccess(false);
    setCreateError(null);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate transaction
      const newBet = {
        id: Date.now(),
        description,
        amount,
        creator: address,
        challenger: null,
        resolved: false,
        winner: null,
        createdAt: new Date().toISOString(),
      };

      setBets(prevBets => [...prevBets, newBet]);
      
      // Set success state after bet is added
      setCreateSuccess(true);

      return {
        hash: `0x${Math.random().toString(16).slice(2)}`,
        wait: async () => ({
          status: 1,
          transactionHash: `0x${Math.random().toString(16).slice(2)}`,
        }),
      };
    } catch (error) {
      console.error('Error creating bet:', error);
      setCreateError(error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const handleAcceptBet = async (betId, amount) => {
    if (!isConnected || !address) {
      throw new Error('Please connect your wallet first');
    }

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setBets(prevBets => 
        prevBets.map(bet => 
          bet.id === betId 
            ? { ...bet, challenger: address, status: 'active' }
            : bet
        )
      );

      return {
        hash: `0x${Math.random().toString(16).slice(2)}`,
        wait: async () => ({
          status: 1,
          transactionHash: `0x${Math.random().toString(16).slice(2)}`,
        }),
      };
    } catch (error) {
      console.error('Error accepting bet:', error);
      throw error;
    }
  };

  const getBet = (betId) => {
    return bets.find(bet => bet.id === betId);
  };

  const getAllBets = () => {
    return bets;
  };

  const getMyBets = () => {
    return bets.filter(bet => 
      bet.creator === address || bet.challenger === address
    );
  };

  const getOpenBets = () => {
    return bets.filter(bet => 
      !bet.challenger && bet.creator !== address
    );
  };

  return {
    createBet: handleCreateBet,
    acceptBet: handleAcceptBet,
    getBet,
    getAllBets,
    getMyBets,
    getOpenBets,
    betCount: bets.length,
    isCreating,
    createSuccess,
    createError,
    isConnected,
  };
}
