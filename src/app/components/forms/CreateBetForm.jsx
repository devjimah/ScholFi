'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useContract } from '../hooks/useContract'
import { notify } from '../ui/NotificationSystem'
import { Loader2 } from 'lucide-react'

export default function CreateBetForm() {
  const { isConnected } = useAccount()
  const router = useRouter()
  const { createBet, isCreating, createSuccess, createError } = useContract()
  const [formData, setFormData] = useState({
    type: 'bet',
    description: '',
    amount: '',
    options: ['', ''], // For polls
    ticketPrice: '', // For raffles
    maxTickets: '', // For raffles
  })

  useEffect(() => {
    if (!isConnected) {
      router.push('/')
    }
  }, [isConnected, router])

  useEffect(() => {
    if (createSuccess) {
      notify('success', `${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} created successfully!`)
      router.push('/bets')
    }
  }, [createSuccess, router, formData.type])

  useEffect(() => {
    if (createError) {
      notify('error', `Failed to create ${formData.type}: ` + createError.message)
    }
  }, [createError, formData.type])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.description) {
      notify('error', 'Please provide a description')
      return
    }

    if (formData.type === 'bet' && !formData.amount) {
      notify('error', 'Please specify bet amount')
      return
    }

    if (formData.type === 'poll' && formData.options.some(opt => !opt)) {
      notify('error', 'Please fill in all poll options')
      return
    }

    if (formData.type === 'raffle' && (!formData.ticketPrice || !formData.maxTickets)) {
      notify('error', 'Please specify ticket price and maximum tickets')
      return
    }

    try {
      await createBet(formData.description, formData.amount, formData.type, {
        options: formData.options,
        ticketPrice: formData.ticketPrice,
        maxTickets: formData.maxTickets,
      })
    } catch (error) {
      console.error(`Error creating ${formData.type}:`, error)
    }
  }

  const addPollOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }))
  }

  const removePollOption = (index) => {
    if (formData.options.length <= 2) return
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }))
  }

  const updatePollOption = (index, value) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }))
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-20">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto bg-background/50 backdrop-blur-sm border-muted">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                Create New {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
              </h1>
              <Button
                variant="outline"
                onClick={() => router.push('/bets')}
                className="relative group"
              >
                View All Items
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bet">Bet</SelectItem>
                    <SelectItem value="poll">Poll</SelectItem>
                    <SelectItem value="raffle">Raffle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder={`What's your ${formData.type} about?`}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  disabled={isCreating}
                  className="bg-background/50"
                />
              </div>

              {formData.type === 'bet' && (
                <div className="space-y-2">
                  <Label htmlFor="amount">Bet Amount (ETH)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.001"
                    placeholder="0.1"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    required
                    disabled={isCreating}
                    className="bg-background/50"
                  />
                </div>
              )}

              {formData.type === 'poll' && (
                <div className="space-y-4">
                  <Label>Poll Options</Label>
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => updatePollOption(index, e.target.value)}
                        required
                        disabled={isCreating}
                        className="bg-background/50"
                      />
                      {index >= 2 && (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removePollOption(index)}
                          disabled={isCreating}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addPollOption}
                    disabled={isCreating}
                  >
                    Add Option
                  </Button>
                </div>
              )}

              {formData.type === 'raffle' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="ticketPrice">Ticket Price (ETH)</Label>
                    <Input
                      id="ticketPrice"
                      type="number"
                      step="0.001"
                      placeholder="0.01"
                      value={formData.ticketPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, ticketPrice: e.target.value }))}
                      required
                      disabled={isCreating}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxTickets">Maximum Tickets</Label>
                    <Input
                      id="maxTickets"
                      type="number"
                      placeholder="100"
                      value={formData.maxTickets}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxTickets: e.target.value }))}
                      required
                      disabled={isCreating}
                      className="bg-background/50"
                    />
                  </div>
                </>
              )}

              <Button 
                type="submit"
                className="w-full relative group"
                disabled={isCreating}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-lg blur-lg opacity-25 group-hover:opacity-50 animate-gradient bg-300% transition-all duration-500" />
                <span className="relative flex items-center justify-center gap-2">
                  {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isCreating ? `Creating ${formData.type}...` : `Create ${formData.type}`}
                </span>
              </Button>

              {!isCreating && (
                <p className="text-sm text-muted-foreground text-center mt-4">
                  This is a simulated environment. No real transactions will be made.
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
