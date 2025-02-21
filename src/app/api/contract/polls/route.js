import { NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import { UNIGAME_ABI } from '@/config/abi';
import { UNIGAME_CONTRACT_ADDRESS } from '@/config/contracts';

const client = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY),
});

export async function GET() {
  try {
    // Get the length of the polls array
    const pollsLength = await client.readContract({
      address: UNIGAME_CONTRACT_ADDRESS,
      abi: UNIGAME_ABI,
      functionName: 'getPollsLength',
    });

    // Fetch each poll
    const polls = [];
    for (let i = 0; i < Number(pollsLength); i++) {
      const [poll, votes] = await Promise.all([
        client.readContract({
          address: UNIGAME_CONTRACT_ADDRESS,
          abi: UNIGAME_ABI,
          functionName: 'polls',
          args: [i],
        }),
        client.readContract({
          address: UNIGAME_CONTRACT_ADDRESS,
          abi: UNIGAME_ABI,
          functionName: 'getPollVotes',
          args: [i],
        }),
      ]);

      // Only include active polls
      if (poll && poll.active) {
        polls.push({
          id: i,
          ...poll,
          votes,
        });
      }
    }

    return NextResponse.json(polls);
  } catch (error) {
    console.error('Error fetching polls:', error);
    return NextResponse.json(
      { error: 'Failed to fetch polls' },
      { status: 500 }
    );
  }
}
