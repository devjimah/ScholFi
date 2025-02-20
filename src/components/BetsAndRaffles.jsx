import { useContract } from '@/hooks/useContract'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatEther } from 'viem'
import { Loader2 } from 'lucide-react'

export function BetsAndRaffles() {
  const { bets, raffles, loading, error, acceptBet, buyTicket } = useContract()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          <p>Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Active Bets */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Active Bets</h2>
        {bets.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground text-center">No active bets found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bets.map((bet, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>Bet #{index + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">{bet.description}</p>
                  <p className="font-semibold mb-2">Amount: {formatEther(bet.amount)} ETH</p>
                  <p className="mb-4">
                    Created by: {bet.creator.slice(0, 6)}...{bet.creator.slice(-4)}
                  </p>
                  {!bet.challenger && !bet.resolved && (
                    <Button 
                      onClick={() => acceptBet(index, formatEther(bet.amount))}
                      className="w-full"
                    >
                      Accept Bet
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Active Raffles */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Active Raffles</h2>
        {raffles.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground text-center">No active raffles found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {raffles.map((raffle, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>Raffle #{index + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold mb-2">
                    Ticket Price: {formatEther(raffle.ticketPrice)} ETH
                  </p>
                  <p className="mb-2">
                    Created by: {raffle.creator.slice(0, 6)}...{raffle.creator.slice(-4)}
                  </p>
                  <p className="mb-4">
                    Ends: {new Date(Number(raffle.endTime) * 1000).toLocaleString()}
                  </p>
                  {raffle.active && (
                    <Button 
                      onClick={() => buyTicket(index, formatEther(raffle.ticketPrice))}
                      className="w-full"
                    >
                      Buy Ticket
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
