'use client';

import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { parseEther, keccak256, toBytes, stringToHex } from 'viem';
import { ethers } from 'ethers';

// TODO: Replace with your deployed contract address
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const CONTRACT_ABI = [
  "event BetCreated(uint256 indexed betId, address creator, string description, bytes32 eventId, uint256 amount, uint256 deadline)",
  "event BetAccepted(uint256 indexed betId, address challenger, uint256 amount)",
  "event BetResolved(uint256 indexed betId, address winner, uint256 payout)",
  "event BetCancelled(uint256 indexed betId, address creator)",
  "function createBet(string memory _description, bytes32 _eventId, uint256 _deadline) external payable",
  "function acceptBet(uint256 _betId) external payable",
  "function resolveBet(uint256 _betId, address _winner) external",
  "function bets(uint256) public view returns (address creator, string description, bytes32 eventId, uint256 amount, address challenger, uint256 challengerAmount, uint8 state, address winner, uint256 deadline)",
  "function betCounter() public view returns (uint256)"
];

export function useContract() {
  // Read all bets
  const { data: betCount } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'betCounter',
    watch: true,
  });

  // Create bet preparation
  const { config: createConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'createBet',
  });

  // Create bet execution
  const { 
    write: writeCreateBet,
    data: createData,
    isLoading: isWriteLoading,
    isSuccess: isWriteSuccess,
    error: writeError
  } = useContractWrite(createConfig);

  // Wait for create transaction
  const { 
    isLoading: isTransactionPending,
    isSuccess: isTransactionSuccess,
    error: transactionError
  } = useWaitForTransaction({
    hash: createData?.hash,
  });

  // Accept bet preparation
  const { config: acceptConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'acceptBet',
  });

  // Accept bet execution
  const { 
    write: writeAcceptBet,
    data: acceptData,
    isLoading: isAcceptWriteLoading,
    isSuccess: isAcceptWriteSuccess,
  } = useContractWrite(acceptConfig);

  // Wait for accept transaction
  const { 
    isLoading: isAcceptPending,
    isSuccess: isAcceptSuccess,
  } = useWaitForTransaction({
    hash: acceptData?.hash,
  });

  // Resolve bet preparation
  const { config: resolveConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'resolveBet',
  });

  // Resolve bet execution
  const { 
    write: writeResolveBet,
    data: resolveData,
    isLoading: isResolveWriteLoading,
    isSuccess: isResolveWriteSuccess,
  } = useContractWrite(resolveConfig);

  // Wait for resolve transaction
  const { 
    isLoading: isResolvePending,
    isSuccess: isResolveSuccess,
  } = useWaitForTransaction({
    hash: resolveData?.hash,
  });

  const handleCreateBet = async (description, amount) => {
    try {
      if (!writeCreateBet) {
        throw new Error('Failed to prepare transaction');
      }

      // Generate a unique event ID using keccak256 hash of description and timestamp
      const eventId = keccak256(
        toBytes(
          stringToHex(`${description}-${Date.now()}`, { size: 32 })
        )
      );
      
      // Set deadline to 24 hours from now (in seconds)
      const deadline = Math.floor(Date.now() / 1000) + 86400;

      await writeCreateBet({
        recklesslySetUnpreparedArgs: [description, eventId, deadline],
        recklesslySetUnpreparedOverrides: {
          value: parseEther(amount),
        },
      });
    } catch (error) {
      console.error('Error creating bet:', error);
      throw error;
    }
  };

  const handleAcceptBet = async (betId, amount) => {
    try {
      if (!writeAcceptBet) {
        throw new Error('Failed to prepare transaction');
      }

      await writeAcceptBet({
        recklesslySetUnpreparedArgs: [betId],
        recklesslySetUnpreparedOverrides: {
          value: parseEther(amount),
        },
      });
    } catch (error) {
      console.error('Error accepting bet:', error);
      throw error;
    }
  };

  const handleResolveBet = async (betId, winner) => {
    try {
      if (!writeResolveBet) {
        throw new Error('Failed to prepare transaction');
      }

      await writeResolveBet({
        recklesslySetUnpreparedArgs: [betId, winner],
      });
    } catch (error) {
      console.error('Error resolving bet:', error);
      throw error;
    }
  };

  return {
    betCount,
    createBet: handleCreateBet,
    acceptBet: handleAcceptBet,
    resolveBet: handleResolveBet,
    isCreating: isWriteLoading || isTransactionPending,
    createSuccess: isWriteSuccess && isTransactionSuccess,
    createError: writeError || transactionError,
    isAccepting: isAcceptWriteLoading || isAcceptPending,
    acceptSuccess: isAcceptWriteSuccess && isAcceptSuccess,
    isResolving: isResolveWriteLoading || isResolvePending,
    resolveSuccess: isResolveWriteSuccess && isResolveSuccess,
  };
}