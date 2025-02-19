import { useState, useCallback, useEffect } from 'react';
import { useAccount } from 'wagmi';

// Mock data for testing
const initialItems = [
  {
    id: '1',
    type: 'bet',
    description: 'Will ETH reach $5000 by March 2025?',
    amount: '0.1',
    creator: '0x1234...5678',
    status: 'open',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'poll',
    description: 'Which blockchain has the best DeFi ecosystem?',
    options: ['Ethereum', 'Solana', 'Binance Smart Chain', 'Polygon'],
    creator: '0x1234...5678',
    votes: {},
    status: 'open',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    type: 'raffle',
    description: 'Win 1 ETH - Community Raffle',
    ticketPrice: '0.01',
    maxTickets: 100,
    creator: '0x1234...5678',
    tickets: {},
    status: 'open',
    createdAt: new Date().toISOString(),
  },
];

// Create a singleton store to persist items across hook instances
let store = {
  items: [...initialItems],
  listeners: new Set(),
};

const notifyListeners = () => {
  console.log('Notifying listeners with items:', store.items);
  store.listeners.forEach(listener => listener(store.items));
};

export function useMockContract() {
  const { address } = useAccount();
  const [localItems, setLocalItems] = useState(store.items);

  // Subscribe to store updates
  useEffect(() => {
    console.log('Setting up listener');
    const handleUpdate = (items) => {
      console.log('Listener received update:', items);
      setLocalItems(items);
    };

    store.listeners.add(handleUpdate);
    handleUpdate(store.items); // Initial update
    
    return () => {
      console.log('Cleaning up listener');
      store.listeners.delete(handleUpdate);
    };
  }, []);

  const getAllItems = useCallback(async () => {
    console.log('Getting all items:', store.items);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return store.items;
  }, []);

  const createItem = useCallback(async (itemData) => {
    console.log('Creating new item:', itemData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newItem = {
      id: String(store.items.length + 1),
      creator: address,
      status: 'open',
      createdAt: new Date().toISOString(),
      ...itemData,
    };

    // Update the store
    store.items = [...store.items, newItem];
    console.log('Store updated with new item:', store.items);
    notifyListeners();
    
    return newItem;
  }, [address]);

  const acceptBet = useCallback(async (betId, amount) => {
    console.log('Accepting bet:', betId, amount);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    store.items = store.items.map(item =>
      item.id === betId
        ? { ...item, status: 'accepted', acceptedBy: address }
        : item
    );
    notifyListeners();
  }, [address]);

  const votePoll = useCallback(async (pollId, optionIndex) => {
    console.log('Voting in poll:', pollId, optionIndex);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    store.items = store.items.map(item => {
      if (item.id === pollId && item.type === 'poll') {
        const updatedVotes = { ...item.votes };
        if (!updatedVotes[optionIndex]) {
          updatedVotes[optionIndex] = [];
        }
        if (!updatedVotes[optionIndex].includes(address)) {
          updatedVotes[optionIndex].push(address);
        }
        return { ...item, votes: updatedVotes };
      }
      return item;
    });
    notifyListeners();
  }, [address]);

  const buyRaffleTickets = useCallback(async (raffleId, amount) => {
    console.log('Buying raffle tickets:', raffleId, amount);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    store.items = store.items.map(item => {
      if (item.id === raffleId && item.type === 'raffle') {
        const updatedTickets = { ...item.tickets };
        updatedTickets[address] = (updatedTickets[address] || 0) + amount;
        return { ...item, tickets: updatedTickets };
      }
      return item;
    });
    notifyListeners();
  }, [address]);

  return {
    getAllItems,
    createItem,
    acceptBet,
    votePoll,
    buyRaffleTickets,
    items: localItems, // Use local items state
  };
}
