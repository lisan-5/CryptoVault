"use client"

import { useMemo } from "react"
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboard } from "@/components/dashboard-provider"
import { cn } from "@/lib/utils"

export function MarketOverview() {
  const { state } = useDashboard()

  const marketStats = useMemo(() => {
    if (state.assets.length === 0) {
      return {
        totalMarketCap: 0,
        totalVolume: 0,
        gainers: [],
        losers: [],
        avgChange: 0,
      }
    }

    const totalMarketCap = state.assets.reduce((sum, asset) => sum + (asset.market_cap || 0), 0)
    const totalVolume = state.assets.reduce((sum, asset) => sum + (asset.volume || 0), 0)
    const validAssets = state.assets.filter((asset) => typeof asset.price_change_percentage_24h === "number")
    const avgChange =
      validAssets.length > 0
        ? validAssets.reduce((sum, asset) => sum + asset.price_change_percentage_24h, 0) / validAssets.length
        : 0

    const sortedByChange = [...validAssets].sort(
      (a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0),
    )
    const gainers = sortedByChange.filter((asset) => asset.price_change_percentage_24h > 0).slice(0, 3)
    const losers = sortedByChange
      .filter((asset) => asset.price_change_percentage_24h < 0)
      .slice(-3)
      .reverse()

    return {
      totalMarketCap,
      totalVolume,
      gainers,
      losers,
      avgChange,
    }
  }, [state.assets])

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`
    return `$${marketCap.toFixed(0)}`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="glass-card card-hover border-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-chart-2/10 to-chart-3/10 opacity-50" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <CardTitle className="text-sm font-semibold">Total Market Cap</CardTitle>
          <div className="p-2 rounded-lg glass-card border-0 bg-primary/10">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold font-mono bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent mb-2">
            {formatMarketCap(marketStats.totalMarketCap)}
          </div>
          <div
            className={cn(
              "text-sm flex items-center font-semibold",
              marketStats.avgChange >= 0 ? "text-green-500" : "text-red-500",
            )}
          >
            {marketStats.avgChange >= 0 ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {Math.abs(marketStats.avgChange).toFixed(2)}% avg change
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card card-hover border-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-emerald-500/10 to-teal-500/10 opacity-50" />
        <CardHeader className="relative z-10">
          <CardTitle className="text-sm font-semibold flex items-center">
            <div className="p-1.5 rounded-lg bg-green-400/20 mr-3">
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            Top Gainers (24h)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 relative z-10">
          {marketStats.gainers.length > 0 ? (
            marketStats.gainers.map((asset, index) => (
              <div
                key={asset.id}
                className="flex items-center justify-between p-2 rounded-lg glass-card border-0 bg-green-400/5"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce-gentle" />
                  <span className="text-sm font-semibold truncate">{asset.symbol.toUpperCase()}</span>
                </div>
                <span className="text-sm font-mono font-bold text-green-500 flex-shrink-0">
                  +{asset.price_change_percentage_24h.toFixed(2)}%
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No gainers available</p>
          )}
        </CardContent>
      </Card>

      <Card className="glass-card card-hover border-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 via-rose-500/10 to-pink-500/10 opacity-50" />
        <CardHeader className="relative z-10">
          <CardTitle className="text-sm font-semibold flex items-center">
            <div className="p-1.5 rounded-lg bg-red-400/20 mr-3">
              <TrendingDown className="h-4 w-4 text-red-500" />
            </div>
            Top Losers (24h)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 relative z-10">
          {marketStats.losers.length > 0 ? (
            marketStats.losers.map((asset, index) => (
              <div
                key={asset.id}
                className="flex items-center justify-between p-2 rounded-lg glass-card border-0 bg-red-400/5"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-bounce-gentle" />
                  <span className="text-sm font-semibold truncate">{asset.symbol.toUpperCase()}</span>
                </div>
                <span className="text-sm font-mono font-bold text-red-500 flex-shrink-0">
                  {asset.price_change_percentage_24h.toFixed(2)}%
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No losers available</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
