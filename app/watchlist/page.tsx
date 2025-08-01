"use client"

import { useState, useMemo } from "react"
import { Sidebar } from "@/components/sidebar"
import { AssetCard } from "@/components/asset-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { LiveDataIndicator } from "@/components/live-data-indicator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Search, TrendingUp, TrendingDown, Plus, Trash2, Eye, BarChart3, Bell, User } from "lucide-react"
import { useDashboard } from "@/components/dashboard-provider"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function Watchlist() {
  const { state, dispatch } = useDashboard()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")

  const favoriteAssets = useMemo(() => {
    return state.assets.filter((asset) => state.favorites.includes(asset.id))
  }, [state.assets, state.favorites])

  const filteredFavorites = useMemo(() => {
    if (!searchQuery) return favoriteAssets

    return favoriteAssets.filter(
      (asset) =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [favoriteAssets, searchQuery])

  const watchlistStats = useMemo(() => {
    if (favoriteAssets.length === 0) {
      return {
        totalValue: 0,
        avgChange: 0,
        gainers: 0,
        losers: 0,
        topGainer: null,
        topLoser: null,
      }
    }

    const totalValue = favoriteAssets.reduce((sum, asset) => sum + asset.market_cap, 0)
    const avgChange =
      favoriteAssets.reduce((sum, asset) => sum + asset.price_change_percentage_24h, 0) / favoriteAssets.length
    const gainers = favoriteAssets.filter((asset) => asset.price_change_percentage_24h > 0).length
    const losers = favoriteAssets.filter((asset) => asset.price_change_percentage_24h < 0).length

    const sortedByGain = [...favoriteAssets].sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h,
    )
    const topGainer = sortedByGain[0]
    const topLoser = sortedByGain[sortedByGain.length - 1]

    return {
      totalValue,
      avgChange,
      gainers,
      losers,
      topGainer,
      topLoser,
    }
  }, [favoriteAssets])

  const handleRemoveFromWatchlist = (assetId: string) => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: assetId })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`
    return `$${marketCap.toFixed(0)}`
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 md:ml-56">
        {/* Enhanced Header Bar */}
        <header className="header-scroll bg-background/95 backdrop-blur-lg border-b border-border/50 px-4 md:px-6 py-4 md:py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
              {/* Title Section */}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center shadow-lg">
                  <Star className="w-5 h-5 md:w-7 md:h-7 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold neon-text">Watchlist</h1>
                  <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
                    Track your favorite assets and monitor their performance
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="glass-card"
                  >
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className="glass-card"
                  >
                    Table
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" className="glass-card">
                    <Bell className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="glass-card">
                    <User className="h-5 w-5" />
                  </Button>
                  <LiveDataIndicator />
                  <ThemeToggle />
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mt-4 lg:mt-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search watchlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass-card bg-background/50"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Watchlist Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{favoriteAssets.length}</div>
                  <p className="text-xs text-muted-foreground">In your watchlist</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Combined Market Cap</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-mono">{formatMarketCap(watchlistStats.totalValue)}</div>
                  <p className="text-xs text-muted-foreground">Total market value</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Change</CardTitle>
                  {watchlistStats.avgChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </CardHeader>
                <CardContent>
                  <div
                    className={cn(
                      "text-2xl font-bold font-mono",
                      watchlistStats.avgChange >= 0 ? "text-green-500" : "text-red-500",
                    )}
                  >
                    {watchlistStats.avgChange >= 0 ? "+" : ""}
                    {watchlistStats.avgChange.toFixed(2)}%
                  </div>
                  <p className="text-xs text-muted-foreground">24h average</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Performance</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-500">↑ {watchlistStats.gainers}</span>
                    <span className="text-red-500">↓ {watchlistStats.losers}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Gainers vs Losers</p>
                </CardContent>
              </Card>
            </div>

            {/* Top Performer Cards */}
            {watchlistStats.topGainer && watchlistStats.topLoser && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-green-500/20 bg-green-500/5">
                  <CardHeader>
                    <CardTitle className="text-sm text-green-500 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Top Performer (24h)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{watchlistStats.topGainer.name}</p>
                        <p className="text-sm text-muted-foreground">{watchlistStats.topGainer.symbol.toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono">{formatCurrency(watchlistStats.topGainer.current_price)}</p>
                        <p className="text-sm text-green-500 font-medium">
                          +{watchlistStats.topGainer.price_change_percentage_24h.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-500/20 bg-red-500/5">
                  <CardHeader>
                    <CardTitle className="text-sm text-red-500 flex items-center">
                      <TrendingDown className="h-4 w-4 mr-2" />
                      Biggest Decline (24h)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{watchlistStats.topLoser.name}</p>
                        <p className="text-sm text-muted-foreground">{watchlistStats.topLoser.symbol.toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono">{formatCurrency(watchlistStats.topLoser.current_price)}</p>
                        <p className="text-sm text-red-500 font-medium">
                          {watchlistStats.topLoser.price_change_percentage_24h.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Watchlist Content */}
            {favoriteAssets.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Your watchlist is empty</h3>
                  <p className="text-muted-foreground mb-4">
                    Start adding assets to your watchlist to track their performance
                  </p>
                  <Button asChild>
                    <Link href="/markets">
                      <Plus className="h-4 w-4 mr-2" />
                      Browse Markets
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList className="glass-card">
                  <TabsTrigger value="all">All ({filteredFavorites.length})</TabsTrigger>
                  <TabsTrigger value="crypto">
                    Crypto ({filteredFavorites.filter((a) => a.type === "crypto").length})
                  </TabsTrigger>
                  <TabsTrigger value="stocks">
                    Stocks ({filteredFavorites.filter((a) => a.type === "stock").length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredFavorites.map((asset) => (
                        <AssetCard key={asset.id} asset={asset} showAddToPortfolio={true} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Asset</TableHead>
                              <TableHead className="text-right">Price</TableHead>
                              <TableHead className="text-right">24h Change</TableHead>
                              <TableHead className="text-right">Market Cap</TableHead>
                              <TableHead className="text-right">Volume</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredFavorites.map((asset) => {
                              const isPositive = asset.price_change_percentage_24h > 0
                              return (
                                <TableRow key={asset.id}>
                                  <TableCell>
                                    <div className="flex items-center space-x-3">
                                      <img
                                        src={asset.image || "/placeholder.svg"}
                                        alt={asset.name}
                                        className="w-8 h-8 rounded-full"
                                      />
                                      <div>
                                        <div className="font-medium">{asset.name}</div>
                                        <div className="text-sm text-muted-foreground flex items-center">
                                          {asset.symbol.toUpperCase()}
                                          <Badge variant="outline" className="ml-2 text-xs">
                                            {asset.type}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right font-mono">
                                    {formatCurrency(asset.current_price)}
                                  </TableCell>
                                  <TableCell
                                    className={cn(
                                      "text-right font-mono font-medium",
                                      isPositive ? "text-green-500" : "text-red-500",
                                    )}
                                  >
                                    <div className="flex items-center justify-end space-x-1">
                                      {isPositive ? (
                                        <TrendingUp className="h-4 w-4" />
                                      ) : (
                                        <TrendingDown className="h-4 w-4" />
                                      )}
                                      <span>
                                        {isPositive ? "+" : ""}
                                        {asset.price_change_percentage_24h.toFixed(2)}%
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right font-mono">
                                    {formatMarketCap(asset.market_cap)}
                                  </TableCell>
                                  <TableCell className="text-right font-mono">
                                    {formatMarketCap(asset.volume)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleRemoveFromWatchlist(asset.id)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="crypto">
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredFavorites
                        .filter((asset) => asset.type === "crypto")
                        .map((asset) => (
                          <AssetCard key={asset.id} asset={asset} showAddToPortfolio={true} />
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">Table view for crypto assets</div>
                  )}
                </TabsContent>

                <TabsContent value="stocks">
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredFavorites
                        .filter((asset) => asset.type === "stock")
                        .map((asset) => (
                          <AssetCard key={asset.id} asset={asset} showAddToPortfolio={true} />
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">Table view for stock assets</div>
                  )}
                </TabsContent>
              </Tabs>
            )}

            {filteredFavorites.length === 0 && favoriteAssets.length > 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No assets found matching your search.</p>
                <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
