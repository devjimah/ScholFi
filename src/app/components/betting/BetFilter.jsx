'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export default function BetFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    status: 'all',
    minAmount: '',
    maxAmount: '',
    type: 'all'
  })

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilter?.(newFilters)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-background/50 backdrop-blur-sm rounded-lg border border-muted">
      <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="bet">Bets</SelectItem>
          <SelectItem value="poll">Polls</SelectItem>
          <SelectItem value="raffle">Raffles</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Min ETH"
          value={filters.minAmount}
          onChange={(e) => handleFilterChange('minAmount', e.target.value)}
          className="w-full md:w-[120px]"
        />
        <Input
          type="number"
          placeholder="Max ETH"
          value={filters.maxAmount}
          onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
          className="w-full md:w-[120px]"
        />
      </div>

      <Button
        variant="outline"
        onClick={() => {
          setFilters({
            status: 'all',
            minAmount: '',
            maxAmount: '',
            type: 'all'
          })
          onFilter?.({
            status: 'all',
            minAmount: '',
            maxAmount: '',
            type: 'all'
          })
        }}
      >
        Reset Filters
      </Button>
    </div>
  )
}
