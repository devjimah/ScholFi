import { NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import { UNIGAME_ABI } from '@/config/abi';
import { UNIGAME_CONTRACT_ADDRESS } from '@/config/contracts';

const client = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY),
});

export async function GET(request, { params }) {
  try {
    const id = params.id;
    const stake = await client.readContract({
      address: UNIGAME_CONTRACT_ADDRESS,
      abi: UNIGAME_ABI,
      functionName: 'stakes',
      args: [id],
    });

    return NextResponse.json(stake);
  } catch (error) {
    console.error('Error fetching stake:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stake' },
      { status: 500 }
    );
  }
}
