"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { TrendingUp, TrendingDown, Star, Plus, BarChart3, Activity, Bell, User } from "lucide-react"
import { useDashboard } from "@/components/dashboard-provider"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default function AssetDetail() {
  const params = useParams()
  const { state, dispatch } = useDashboard()
  const [timeframe, setTimeframe] = useState("7d")

  const asset = useMemo(() => {
    return state.assets.find((a) => a.id === params.id)
  }, [state.assets, params.id])

  const isFavorite = asset ? state.favorites.includes(asset.id) : false
  const isPositive = asset ? asset.price_change_percentage_24h > 0 : false

  const chartData = useMemo(() => {
    if (!asset?.sparkline_in_7d) return []

    return asset.sparkline_in_7d.price.map((price, index) => ({
      time: index,
      price: price,
      date: new Date(Date.now() - (asset.sparkline_in_7d!.price.length - index) * 3600000).toLocaleDateString(),
    }))
  }, [asset])

  const handleToggleFavorite = () => {
    if (asset) {
      dispatch({ type: "TOGGLE_FAVORITE", payload: asset.id })
    }
  }

  const handleAddToPortfolio = () => {
    if (asset) {
      const portfolioItem = {
        assetId: asset.id,
        symbol: asset.symbol,
        name: asset.name,
        amount: 1,
        purchasePrice: asset.current_price,
        currentPrice: asset.current_price,
      }
      dispatch({ type: "ADD_TO_PORTFOLIO", payload: portfolioItem })
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 4 : 2,
    }).format(price)
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`
    return `$${marketCap.toFixed(0)}`
  }

  if (!asset) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 md:ml-56 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Asset not found</p>
            </div>
          </div>
        </main>
      </div>
    )
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
                <Image
                  src={asset.image || "/placeholder.svg"}
                  alt={asset.name}
                  width={48}
                  height={48}
                  className="rounded-full shadow-lg"
                />
                <div>
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold neon-text">{asset.name}</h1>
                  <p className="text-sm md:text-base lg:text-lg text-muted-foreground uppercase">{asset.symbol}</p>
                </div>
                {asset.category && (
                  <Badge variant="secondary" className="glass-card">
                    {asset.category}
                  </Badge>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-3 lg:space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleToggleFavorite}
                  className={cn("glass-card", isFavorite && "text-yellow-400")}
                >
                  <Star className={cn("h-4 w-4", isFavorite && "fill-current")} />
                </Button>
                <Button onClick={handleAddToPortfolio} className="neon-glow px-4 md:px-6">
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Portfolio
                </Button>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" className="glass-card">
                    <Bell className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="glass-card">
                    <User className="h-5 w-5" />
                  </Button>
                  <ThemeToggle />
                </div>
              </div>
            </div>

            {/* Asset Quick Stats */}
            <div className="mt-4 lg:mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card p-3 md:p-4 rounded-lg neon-glow">
                <div className="text-xs md:text-sm text-muted-foreground">Current Price</div>
                <div className="text-lg md:text-xl font-bold font-mono animate-counter animate-pulse-soft">
                  {formatPrice(asset.current_price)}
                </div>
                <div
                  className={cn(
                    "text-xs font-medium flex items-center space-x-1",
                    isPositive ? "text-green-500" : "text-red-500",
                  )}
                >
                  {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{Math.abs(asset.price_change_percentage_24h).toFixed(2)}%</span>
                </div>
              </div>
              <div className="glass-card p-3 md:p-4 rounded-lg">
                <div className="text-xs md:text-sm text-muted-foreground">Market Cap</div>
                <div className="text-lg md:text-xl font-bold font-mono">{formatMarketCap(asset.market_cap)}</div>
                <div className="text-xs text-muted-foreground">Total market value</div>
              </div>
              <div className="glass-card p-3 md:p-4 rounded-lg">
                <div className="text-xs md:text-sm text-muted-foreground">Volume (24h)</div>
                <div className="text-lg md:text-xl font-bold font-mono">{formatMarketCap(asset.volume)}</div>
                <div className="text-xs text-muted-foreground">Trading volume</div>
              </div>
              <div className="glass-card p-3 md:p-4 rounded-lg">
                <div className="text-xs md:text-sm text-muted-foreground">24h Change</div>
                <div
                  className={cn(
                    "text-lg md:text-xl font-bold font-mono",
                    isPositive ? "text-green-500" : "text-red-500",
                  )}
                >
                  {asset.price_change_percentage_24h >= 0 ? "+" : ""}
                  {asset.price_change_percentage_24h.toFixed(2)}%
                </div>
                <div className="text-xs text-muted-foreground">Price change</div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Price Chart
                  </CardTitle>
                  <div className="flex space-x-2">
                    {["1h", "24h", "7d", "1M", "1Y"].map((period) => (
                      <Button
                        key={period}
                        variant={timeframe === period ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeframe(period)}
                        className="glass-card"
                      >
                        {period}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `$${value.toFixed(2)}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [formatPrice(value), "Price"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={isPositive ? "#10b981" : "#ef4444"}
                        strokeWidth={2}
                        fill="url(#colorPrice)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="glass-card">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="statistics">Statistics</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>About {asset.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {asset.name} ({asset.symbol.toUpperCase()}) is a cryptocurrency in the {asset.category} category.
                      Track its real-time price, market cap, and trading volume to make informed investment decisions.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="statistics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Market Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Market Cap Rank</span>
                        <span className="font-mono">#{Math.floor(Math.random() * 100) + 1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">All-Time High</span>
                        <span className="font-mono">{formatPrice(asset.current_price * (1 + Math.random()))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">All-Time Low</span>
                        <span className="font-mono">{formatPrice(asset.current_price * Math.random())}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Supply Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Circulating Supply</span>
                        <span className="font-mono">{(Math.random() * 1000000000).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Supply</span>
                        <span className="font-mono">{(Math.random() * 1000000000).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Supply</span>
                        <span className="font-mono">∞</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="news" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="h-5 w-5 mr-2" />
                      Latest News
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { title: `${asset.name} Reaches New Milestone in Adoption`, time: "2 hours ago" },
                        {
                          title: `Market Analysis: ${asset.symbol.toUpperCase()} Shows Strong Support`,
                          time: "5 hours ago",
                        },
                        { title: `Technical Update Released for ${asset.name} Network`, time: "1 day ago" },
                      ].map((news, index) => (
                        <div key={index} className="border-b border-border pb-3 last:border-b-0">
                          <h4 className="font-medium hover:text-primary cursor-pointer transition-colors">
                            {news.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">{news.time}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
