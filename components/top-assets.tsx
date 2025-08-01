"use client"

import { useMemo } from "react"
import { AssetCard } from "@/components/asset-card"
import { TrendingUp, Star, Activity } from "lucide-react"
import { useDashboard } from "@/components/dashboard-provider"

export function TopAssets() {
  const { state } = useDashboard()

  const { topGainers, favorites, trending } = useMemo(() => {
    const sortedByGain = [...state.assets]
      .filter((asset) => asset.price_change_percentage_24h > 0)
      .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
      .slice(0, 4)

    const favoriteAssets = state.assets.filter((asset) => state.favorites.includes(asset.id)).slice(0, 4)

    const trendingAssets = [...state.assets].sort((a, b) => b.volume - a.volume).slice(0, 4)

    return {
      topGainers: sortedByGain,
      favorites: favoriteAssets,
      trending: trendingAssets,
    }
  }, [state.assets, state.favorites])

  if (state.isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Gainers */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <h2 className="text-xl font-semibold">Top Gainers (24h)</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topGainers.map((asset) => (
            <AssetCard key={asset.id} asset={asset} showAddToPortfolio={true} />
          ))}
        </div>
      </div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Star className="h-5 w-5 text-yellow-500" />
            <h2 className="text-xl font-semibold">Your Favorites</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {favorites.map((asset) => (
              <AssetCard key={asset.id} asset={asset} showAddToPortfolio={true} />
            ))}
          </div>
        </div>
      )}

      {/* Trending by Volume */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold">Trending by Volume</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {trending.map((asset) => (
            <AssetCard key={asset.id} asset={asset} showAddToPortfolio={true} />
          ))}
        </div>
      </div>
    </div>
  )
}
