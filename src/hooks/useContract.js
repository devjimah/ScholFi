'use client';

import { useCallback, useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { MOCK_BETS, MOCK_RAFFLES } from '@/config/mockData'

// Custom JSON serializer that handles BigInt
const safeJSONStringify = (obj) => {
  return JSON.stringify(obj, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
};

// Custom JSON parser that converts string numbers back to BigInt if needed
const safeJSONParse = (str) => {
  return JSON.parse(str, (_, value) => {
    if (typeof value === 'string' && /^\d+$/.test(value)) {
      try {
        return BigInt(value);
      } catch {
        return value;
      }
    }
    return value;
  });
};

export function useContract() {
  const { address } = useAccount()
  const [bets, setBets] = useState([])
  const [polls, setPolls] = useState([])
  const [raffles, setRaffles] = useState([])
  const [stakes, setStakes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize localStorage with mock data if empty
  const initializeLocalStorage = useCallback(() => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') return;
    
    try {
      if (!localStorage.getItem('bets')) {
        localStorage.setItem('bets', safeJSONStringify(MOCK_BETS))
      }
      if (!localStorage.getItem('polls')) {
        localStorage.setItem('polls', safeJSONStringify([]))
      }
      if (!localStorage.getItem('raffles')) {
        localStorage.setItem('raffles', safeJSONStringify(MOCK_RAFFLES))
      }
      if (!localStorage.getItem('stakes')) {
        localStorage.setItem('stakes', safeJSONStringify([]))
      }
    } catch (error) {
      console.error('Failed to initialize localStorage:', error);
    }
  }, []);

  // Fetch all bets from localStorage
  const fetchBets = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const storedBets = safeJSONParse(localStorage.getItem('bets') || '[]')
      setBets(storedBets)
    } catch (err) {
      console.error('Error fetching bets:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch all polls from localStorage
  const fetchPolls = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const storedPolls = safeJSONParse(localStorage.getItem('polls') || '[]')
      setPolls(storedPolls)
    } catch (err) {
      console.error('Error fetching polls:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch all raffles from localStorage
  const fetchRaffles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const storedRaffles = safeJSONParse(localStorage.getItem('raffles') || '[]')
      setRaffles(storedRaffles)
    } catch (err) {
      console.error('Error fetching raffles:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch all stakes from localStorage
  const fetchStakes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const storedStakes = safeJSONParse(localStorage.getItem('stakes') || '[]')
      setStakes(storedStakes)
    } catch (err) {
      console.error('Error fetching stakes:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Create a new bet
  const createBet = useCallback(async ({ description, amount }) => {
    if (!address) throw new Error('Wallet not connected')

    try {
      setLoading(true)
      setError(null)

      const storedBets = safeJSONParse(localStorage.getItem('bets') || '[]')
      const newBet = {
        id: storedBets.length,
        creator: address,
        description,
        amount,
        challenger: null,
        resolved: false,
        winner: null,
        createdAt: new Date().getTime()
      }

      const updatedBets = [...storedBets, newBet]
      localStorage.setItem('bets', safeJSONStringify(updatedBets))
      await fetchBets()
    } catch (err) {
      console.error('Error creating bet:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [address, fetchBets])

  // Create a new poll
  const createPoll = useCallback(async ({ description, options }) => {
    if (!address) throw new Error('Wallet not connected')

    try {
      setLoading(true)
      setError(null)

      const storedPolls = safeJSONParse(localStorage.getItem('polls') || '[]')
      const newPoll = {
        id: storedPolls.length,
        creator: address,
        description,
        options: options.map(option => ({
          text: option,
          votes: 0
        })),
        voters: [],
        resolved: false,
        createdAt: new Date().getTime()
      }

      const updatedPolls = [...storedPolls, newPoll]
      localStorage.setItem('polls', safeJSONStringify(updatedPolls))
      await fetchPolls()
    } catch (err) {
      console.error('Error creating poll:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [address, fetchPolls])

  // Vote in a poll
  const vote = useCallback(async (pollId, optionIndex) => {
    if (!address) throw new Error('Wallet not connected')

    try {
      setLoading(true)
      setError(null)

      const storedPolls = safeJSONParse(localStorage.getItem('polls') || '[]')
      const pollIndex = storedPolls.findIndex(p => p.id === pollId)
      
      if (pollIndex === -1) throw new Error('Poll not found')
      if (storedPolls[pollIndex].voters.includes(address)) throw new Error('Already voted')
      if (storedPolls[pollIndex].resolved) throw new Error('Poll is closed')

      const updatedPolls = [...storedPolls]
      updatedPolls[pollIndex].options[optionIndex].votes++
      updatedPolls[pollIndex].voters.push(address)

      localStorage.setItem('polls', safeJSONStringify(updatedPolls))
      await fetchPolls()
    } catch (err) {
      console.error('Error voting in poll:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [address, fetchPolls])

  // Accept a bet
  const acceptBet = useCallback(async (betId, amount) => {
    if (!address) throw new Error('Wallet not connected')

    try {
      setLoading(true)
      setError(null)

      const storedBets = safeJSONParse(localStorage.getItem('bets') || '[]')
      const betIndex = storedBets.findIndex(bet => bet.id === betId)
      
      if (betIndex === -1) throw new Error('Bet not found')
      if (storedBets[betIndex].challenger) throw new Error('Bet already accepted')
      if (storedBets[betIndex].creator === address) throw new Error('Cannot accept your own bet')

      storedBets[betIndex] = {
        ...storedBets[betIndex],
        challenger: address
      }

      localStorage.setItem('bets', safeJSONStringify(storedBets))
      await fetchBets()
    } catch (err) {
      console.error('Error accepting bet:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [address, fetchBets])

  // Create a new raffle
  const createRaffle = useCallback(async ({ ticketPrice, duration }) => {
    if (!address) throw new Error('Wallet not connected')

    try {
      setLoading(true)
      setError(null)

      const storedRaffles = safeJSONParse(localStorage.getItem('raffles') || '[]')
      const newRaffle = {
        id: storedRaffles.length,
        creator: address,
        ticketPrice,
        participants: [],
        endTime: new Date().getTime() + duration * 1000,
        active: true,
        winner: null
      }

      const updatedRaffles = [...storedRaffles, newRaffle]
      localStorage.setItem('raffles', safeJSONStringify(updatedRaffles))
      await fetchRaffles()
    } catch (err) {
      console.error('Error creating raffle:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [address, fetchRaffles])

  // Buy a raffle ticket
  const buyTicket = useCallback(async (raffleId) => {
    if (!address) throw new Error('Wallet not connected')

    try {
      setLoading(true)
      setError(null)

      const storedRaffles = safeJSONParse(localStorage.getItem('raffles') || '[]')
      const raffleIndex = storedRaffles.findIndex(raffle => raffle.id === raffleId)
      
      if (raffleIndex === -1) throw new Error('Raffle not found')
      if (!storedRaffles[raffleIndex].active) throw new Error('Raffle is not active')
      if (storedRaffles[raffleIndex].participants.includes(address)) {
        throw new Error('Already bought a ticket')
      }

      storedRaffles[raffleIndex] = {
        ...storedRaffles[raffleIndex],
        participants: [...storedRaffles[raffleIndex].participants, address]
      }

      localStorage.setItem('raffles', safeJSONStringify(storedRaffles))
      await fetchRaffles()
    } catch (err) {
      console.error('Error buying ticket:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [address, fetchRaffles])

  // Create a new stake
  const createStake = useCallback(async ({ name, maxStake, apy, duration }) => {
    if (!address) throw new Error('Wallet not connected')

    try {
      setLoading(true)
      setError(null)

      const storedStakes = safeJSONParse(localStorage.getItem('stakes') || '[]')
      const newStake = {
        id: storedStakes.length,
        creator: address,
        name,
        maxStake,
        apy,
        stakes: [],
        locked: false,
        createdAt: new Date().getTime(),
        endTime: new Date().getTime() + (duration * 24 * 60 * 60 * 1000)
      }

      const updatedStakes = [...storedStakes, newStake]
      localStorage.setItem('stakes', safeJSONStringify(updatedStakes))
      await fetchStakes()
    } catch (err) {
      console.error('Error creating stake:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [address, fetchStakes])

  // Stake in a pool
  const stake = useCallback(async (stakeId, amount) => {
    if (!address) throw new Error('Wallet not connected')

    try {
      setLoading(true)
      setError(null)

      const storedStakes = safeJSONParse(localStorage.getItem('stakes') || '[]')
      const stakeIndex = storedStakes.findIndex(s => s.id === stakeId)
      
      if (stakeIndex === -1) throw new Error('Stake not found')
      if (storedStakes[stakeIndex].locked) throw new Error('Staking pool is locked')
      
      const totalStaked = storedStakes[stakeIndex].stakes.reduce((sum, s) => sum + s.amount, 0n)
      if (totalStaked + amount > storedStakes[stakeIndex].maxStake) {
        throw new Error('Exceeds maximum stake')
      }

      const userStakeIndex = storedStakes[stakeIndex].stakes.findIndex(s => s.staker === address)
      if (userStakeIndex === -1) {
        storedStakes[stakeIndex].stakes.push({
          staker: address,
          amount,
          timestamp: new Date().getTime()
        })
      } else {
        storedStakes[stakeIndex].stakes[userStakeIndex].amount += amount
      }

      localStorage.setItem('stakes', safeJSONStringify(storedStakes))
      await fetchStakes()
    } catch (err) {
      console.error('Error staking:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [address, fetchStakes])

  useEffect(() => {
    initializeLocalStorage()
    Promise.all([fetchBets(), fetchPolls(), fetchRaffles(), fetchStakes()])
  }, [fetchBets, fetchPolls, fetchRaffles, fetchStakes])

  return {
    bets,
    polls,
    raffles,
    stakes,
    loading,
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
  }
}
