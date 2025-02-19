'use client'

import { useAccount } from 'wagmi'

export default function BetStats({ stats = defaultStats }) {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard
        title="Total Bets"
        value={stats.totalBets}
        description="All-time bets placed"
        trend={stats.totalBetsTrend}
      />
      <StatCard
        title="Win Rate"
        value={`${stats.winRate}%`}
        description="Success rate"
        trend={stats.winRateTrend}
      />
      <StatCard
        title="Total Volume"
        value={`${stats.totalVolume} ETH`}
        description="Total value locked"
        trend={stats.volumeTrend}
      />
      <StatCard
        title="Net Profit"
        value={`${stats.netProfit} ETH`}
        description="Total earnings"
        trend={stats.profitTrend}
      />
    </div>
  )
}

const defaultStats = {
  totalBets: 0,
  winRate: 0,
  totalVolume: '0',
  netProfit: '0',
  totalBetsTrend: 0,
  winRateTrend: 0,
  volumeTrend: 0,
  profitTrend: 0,
}

function StatCard({ title, value, description, trend }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${
          trend > 0
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : trend < 0
            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }`}>
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      </div>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  )
}