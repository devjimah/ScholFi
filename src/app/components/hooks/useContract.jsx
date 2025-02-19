'use client';

import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { parseEther } from 'viem';

// TODO: Replace with your deployed contract address
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const CONTRACT_ABI = [
  "event BetCreated(uint256 indexed betId, address creator, string description, uint256 amount)",
  "event BetAccepted(uint256 indexed betId, address challenger)",
  "event BetResolved(uint256 indexed betId, address winner)",
  "function createBet(string memory _description) external payable",
  "function acceptBet(uint256 _betId) external payable",
  "function resolveBet(uint256 _betId, address _winner) external",
  "function bets(uint256) public view returns (address creator, string memory description, uint256 amount, address challenger, bool resolved, address winner)",
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

  const handleCreateBet = async (description, amount) => {
    try {
      if (!writeCreateBet) {
        throw new Error('Failed to prepare transaction');
      }

      await writeCreateBet({
        recklesslySetUnpreparedArgs: [description],
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

  return {
    betCount,
    createBet: handleCreateBet,
    acceptBet: handleAcceptBet,
    isCreating: isWriteLoading || isTransactionPending,
    createSuccess: isWriteSuccess && isTransactionSuccess,
    createError: writeError || transactionError,
    isAccepting: isAcceptWriteLoading || isAcceptPending,
    acceptSuccess: isAcceptWriteSuccess && isAcceptSuccess,
  };
}