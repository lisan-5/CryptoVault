"use client"

import { useState, useMemo } from "react"
import { Sidebar } from "@/components/sidebar"
import { AssetCard } from "@/components/asset-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { LiveDataIndicator } from "@/components/live-data-indicator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, SortAsc, TrendingUp, Bell, User } from "lucide-react"
import { useDashboard } from "@/components/dashboard-provider"

export default function Markets() {
  const { state, dispatch } = useDashboard()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("market_cap")
  const [assetType, setAssetType] = useState("all")

  const categories = useMemo(() => {
    const cats = new Set(state.assets.map((asset) => asset.category).filter(Boolean))
    return ["all", ...Array.from(cats)]
  }, [state.assets])

  const filteredAndSortedAssets = useMemo(() => {
    let filtered = state.assets

    // Filter by asset type
    if (assetType !== "all") {
      filtered = filtered.filter((asset) => asset.type === assetType)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (asset) =>
          asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((asset) => asset.category === selectedCategory)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "price":
          return b.current_price - a.current_price
        case "change":
          return b.price_change_percentage_24h - a.price_change_percentage_24h
        case "market_cap":
        default:
          return b.market_cap - a.market_cap
      }
    })

    return filtered
  }, [state.assets, searchQuery, selectedCategory, sortBy, assetType])

  const cryptoAssets = useMemo(() => state.assets.filter((asset) => asset.type === "crypto"), [state.assets])

  const stockAssets = useMemo(() => state.assets.filter((asset) => asset.type === "stock"), [state.assets])

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
                  <TrendingUp className="w-5 h-5 md:w-7 md:h-7 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold neon-text">Markets</h1>
                  <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
                    Real-time crypto & stock market data
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-3 lg:space-x-4">
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

            {/* Filters and Search Bar */}
            <div className="mt-4 lg:mt-6 flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass-card bg-background/50"
                />
              </div>

              <div className="flex flex-wrap gap-2 lg:gap-3">
                <Select value={assetType} onValueChange={setAssetType}>
                  <SelectTrigger className="w-32 glass-card">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="crypto">Crypto</SelectItem>
                    <SelectItem value="stock">Stocks</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 glass-card">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 glass-card">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market_cap">Market Cap</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="change">24h Change</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Market Tabs */}
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList className="glass-card">
                <TabsTrigger value="all">All Markets ({state.assets.length})</TabsTrigger>
                <TabsTrigger value="crypto">Crypto ({cryptoAssets.length})</TabsTrigger>
                <TabsTrigger value="stocks">Stocks ({stockAssets.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {/* Results count */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{filteredAndSortedAssets.length} assets</Badge>
                    {selectedCategory !== "all" && <Badge variant="outline">{selectedCategory}</Badge>}
                    {assetType !== "all" && <Badge variant="outline">{assetType}</Badge>}
                  </div>
                </div>

                {/* Asset Grid */}
                {state.isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredAndSortedAssets.map((asset) => (
                      <AssetCard key={asset.id} asset={asset} showAddToPortfolio={true} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="crypto" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {cryptoAssets.map((asset) => (
                    <AssetCard key={asset.id} asset={asset} showAddToPortfolio={true} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="stocks" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {stockAssets.map((asset) => (
                    <AssetCard key={asset.id} asset={asset} showAddToPortfolio={true} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {filteredAndSortedAssets.length === 0 && !state.isLoading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No assets found matching your criteria.</p>
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                    setAssetType("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
