"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { TrendingUp, TrendingDown, Star, Plus, DollarSign, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDashboard, type Asset } from "@/components/dashboard-provider"
import { cn } from "@/lib/utils"

interface AssetCardProps {
  asset: Asset
  showAddToPortfolio?: boolean
}

export function AssetCard({ asset, showAddToPortfolio = false }: AssetCardProps) {
  const { state, dispatch } = useDashboard()
  const [isHovered, setIsHovered] = useState(false)

  const isFavorite = state.favorites.includes(asset.id)
  const isPositive = asset.price_change_percentage_24h > 0

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch({ type: "TOGGLE_FAVORITE", payload: asset.id })
  }

  const handleAddToPortfolio = (e: React.MouseEvent) => {
    e.preventDefault()
    const portfolioItem = {
      assetId: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      amount: asset.type === "stock" ? 1 : 0.1,
      purchasePrice: asset.current_price,
      currentPrice: asset.current_price,
    }
    dispatch({ type: "ADD_TO_PORTFOLIO", payload: portfolioItem })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: asset.type === "stock" ? 2 : price < 1 ? 4 : 2,
      maximumFractionDigits: asset.type === "stock" ? 2 : price < 1 ? 4 : 2,
    }).format(price)
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`
    return `$${marketCap.toFixed(0)}`
  }

  return (
    <Link href={`/asset/${asset.id}`}>
      <Card
        className={cn(
          "card-hover glass-card relative overflow-hidden group animate-slide-up h-full border-0",
          isHovered && "neon-glow",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Enhanced holographic background effect */}
        <div className="absolute inset-0 holographic opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

        {/* Animated border gradient */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-chart-2/20 to-chart-3/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Enhanced shimmer effect */}
        <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardContent className="p-6 relative z-10 h-full flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 via-chart-2/20 to-chart-3/20 flex items-center justify-center backdrop-blur-sm border border-primary/20 shadow-lg">
                  <Image
                    src={asset.image || "/placeholder.svg"}
                    alt={asset.name}
                    width={28}
                    height={28}
                    className="rounded-lg"
                  />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full glass-card hover:scale-110 transition-all duration-300 border-0"
                    onClick={handleToggleFavorite}
                  >
                    <Star
                      className={cn(
                        "h-3.5 w-3.5 transition-all duration-300",
                        isFavorite ? "fill-yellow-400 text-yellow-400 animate-bounce-gentle" : "text-muted-foreground",
                      )}
                    />
                  </Button>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm group-hover:text-primary transition-colors truncate">{asset.name}</h3>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">{asset.symbol}</p>
                  {asset.type === "stock" && <DollarSign className="h-3 w-3 text-muted-foreground" />}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2 flex-shrink-0">
              {asset.category && (
                <Badge
                  variant="secondary"
                  className="text-xs glass-card border-0 bg-primary/10 text-primary font-medium"
                >
                  {asset.category}
                </Badge>
              )}
              <Badge
                variant={asset.type === "crypto" ? "default" : "outline"}
                className={cn(
                  "text-xs transition-all duration-300 border-0 font-semibold",
                  asset.type === "crypto"
                    ? "bg-gradient-to-r from-primary to-chart-2 text-primary-foreground shadow-lg"
                    : "bg-secondary/50 text-secondary-foreground",
                )}
              >
                {asset.type === "crypto" ? (
                  <div className="flex items-center space-x-1">
                    <Zap className="h-3 w-3" />
                    <span>CRYPTO</span>
                  </div>
                ) : (
                  "STOCK"
                )}
              </Badge>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold font-mono bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                {formatPrice(asset.current_price)}
              </span>
              <div
                className={cn(
                  "flex items-center space-x-1 text-sm font-bold px-3 py-1.5 rounded-full glass-card border-0",
                  isPositive
                    ? "text-green-400 bg-green-400/10 shadow-green-400/20"
                    : "text-red-400 bg-red-400/10 shadow-red-400/20",
                )}
              >
                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{Math.abs(asset.price_change_percentage_24h).toFixed(2)}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="glass-card p-3 rounded-lg border-0 bg-gradient-to-br from-primary/5 to-chart-2/5">
                <span className="text-muted-foreground block font-medium">Market Cap</span>
                <span className="font-mono font-bold text-sm text-foreground">{formatMarketCap(asset.market_cap)}</span>
              </div>
              <div className="glass-card p-3 rounded-lg border-0 bg-gradient-to-br from-chart-2/5 to-chart-3/5">
                <span className="text-muted-foreground block font-medium">Volume</span>
                <span className="font-mono font-bold text-sm text-foreground">{formatMarketCap(asset.volume)}</span>
              </div>
            </div>

            {/* Enhanced sparkline */}
            {asset.sparkline_in_7d && asset.sparkline_in_7d.price.length > 0 && (
              <div className="h-16 mt-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent rounded-lg" />
                <svg width="100%" height="100%" className="overflow-visible">
                  <defs>
                    <linearGradient id={`gradient-${asset.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.4" />
                      <stop offset="100%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0" />
                    </linearGradient>
                    <filter id={`glow-${asset.id}`}>
                      <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <polyline
                    fill={`url(#gradient-${asset.id})`}
                    stroke={isPositive ? "#10b981" : "#ef4444"}
                    strokeWidth="2.5"
                    filter={`url(#glow-${asset.id})`}
                    points={asset.sparkline_in_7d.price
                      .slice(-20)
                      .map((price, index) => {
                        const prices = asset.sparkline_in_7d!.price.slice(-20)
                        const minPrice = Math.min(...prices)
                        const maxPrice = Math.max(...prices)
                        const range = maxPrice - minPrice
                        const normalizedPrice = range > 0 ? (price - minPrice) / range : 0.5
                        return `${(index / 19) * 100},${60 - normalizedPrice * 40}`
                      })
                      .join(" ")}
                    className="drop-shadow-lg"
                  />
                </svg>
              </div>
            )}

            {showAddToPortfolio && (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 glass-card opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/20 hover:to-chart-2/20 hover:border-primary/50 bg-transparent text-sm font-semibold border-primary/20 hover:scale-[1.02]"
                onClick={handleAddToPortfolio}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Portfolio
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
