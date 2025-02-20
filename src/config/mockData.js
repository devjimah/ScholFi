import { parseEther } from 'viem'

export const MOCK_BETS = [
  {
    id: 0,
    creator: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    description: "Will ETH reach $5000 by end of March?",
    amount: parseEther("0.1").toString(),
    challenger: null,
    resolved: false,
    winner: null,
    createdAt: new Date().getTime()
  },
  {
    id: 1,
    creator: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    description: "Will Bitcoin dominance exceed 50% in Q2?",
    amount: parseEther("0.5").toString(),
    challenger: "0x123456789012345678901234567890123456789a",
    resolved: true,
    winner: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    createdAt: new Date().getTime() - 86400000 // 1 day ago
  }
];

export const MOCK_RAFFLES = [
  {
    id: 0,
    creator: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    ticketPrice: parseEther("0.01").toString(),
    participants: [],
    endTime: new Date().getTime() + 604800000, // 1 week from now
    active: true,
    winner: null
  },
  {
    id: 1,
    creator: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    ticketPrice: parseEther("0.05").toString(),
    participants: [
      "0x123456789012345678901234567890123456789a",
      "0x987654321098765432109876543210987654321b"
    ],
    endTime: new Date().getTime() + 172800000, // 2 days from now
    active: true,
    winner: null
  }
];
