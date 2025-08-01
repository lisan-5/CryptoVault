"use client"

import { useMemo } from "react"
import { Sidebar } from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { LiveDataIndicator } from "@/components/live-data-indicator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import { BarChart3, TrendingUp, PieChartIcon, Activity, DollarSign, Target, Bell, User } from "lucide-react"
import { useDashboard } from "@/components/dashboard-provider"
import { cn } from "@/lib/utils"

export default function Analytics() {
  const { state } = useDashboard()

  const analyticsData = useMemo(() => {
    if (state.assets.length === 0) {
      return {
        marketOverview: [],
        categoryDistribution: [],
        performanceData: [],
        volumeData: [],
        correlationData: [],
        portfolioAllocation: [],
        riskMetrics: {
          volatility: 0,
          sharpeRatio: 0,
          maxDrawdown: 0,
          beta: 0,
        },
      }
    }

    // Market Overview Data
    const marketOverview = [
      {
        name: "Total Market Cap",
        value: state.assets.reduce((sum, asset) => sum + asset.market_cap, 0),
        change: state.assets.reduce((sum, asset) => sum + asset.price_change_percentage_24h, 0) / state.assets.length,
      },
      {
        name: "Total Volume",
        value: state.assets.reduce((sum, asset) => sum + asset.volume, 0),
        change: Math.random() * 20 - 10, // Mock volume change
      },
    ]

    // Category Distribution
    const categoryMap = new Map<string, { value: number; count: number }>()
    state.assets.forEach((asset) => {
      const category = asset.category || "other"
      const existing = categoryMap.get(category) || { value: 0, count: 0 }
      categoryMap.set(category, {
        value: existing.value + asset.market_cap,
        count: existing.count + 1,
      })
    })

    const categoryDistribution = Array.from(categoryMap.entries()).map(([name, data]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: data.value,
      count: data.count,
      percentage: (data.value / state.assets.reduce((sum, asset) => sum + asset.market_cap, 0)) * 100,
    }))

    // Performance Data (24h changes)
    const performanceData = state.assets
      .map((asset) => ({
        name: asset.symbol.toUpperCase(),
        change: asset.price_change_percentage_24h,
        volume: asset.volume,
        marketCap: asset.market_cap,
      }))
      .sort((a, b) => b.change - a.change)
      .slice(0, 10)

    // Volume Analysis
    const volumeData = state.assets
      .map((asset) => ({
        name: asset.symbol.toUpperCase(),
        volume: asset.volume,
        price: asset.current_price,
        change: asset.price_change_percentage_24h,
      }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 10)

    // Portfolio Allocation (if user has portfolio)
    const portfolioAllocation = state.portfolio.map((item) => {
      const currentValue = item.amount * item.currentPrice
      return {
        name: item.symbol.toUpperCase(),
        value: currentValue,
        percentage: 0, // Will be calculated below
      }
    })

    const totalPortfolioValue = portfolioAllocation.reduce((sum, item) => sum + item.value, 0)
    portfolioAllocation.forEach((item) => {
      item.percentage = totalPortfolioValue > 0 ? (item.value / totalPortfolioValue) * 100 : 0
    })

    // Mock Risk Metrics
    const riskMetrics = {
      volatility: Math.random() * 50 + 10, // 10-60%
      sharpeRatio: Math.random() * 2 + 0.5, // 0.5-2.5
      maxDrawdown: Math.random() * 30 + 5, // 5-35%
      beta: Math.random() * 1.5 + 0.5, // 0.5-2.0
    }

    return {
      marketOverview,
      categoryDistribution,
      performanceData,
      volumeData,
      portfolioAllocation,
      riskMetrics,
    }
  }, [state.assets, state.portfolio])

  const formatCurrency = (amount: number) => {
    if (amount >= 1e12) return `$${(amount / 1e12).toFixed(2)}T`
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(2)}M`
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(2)}K`
    return `$${amount.toFixed(2)}`
  }

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00", "#ff00ff", "#00ffff", "#ff0000"]

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
                  <BarChart3 className="w-5 h-5 md:w-7 md:h-7 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold neon-text">Analytics</h1>
                  <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
                    Advanced market analysis and portfolio insights
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

            {/* Analytics Quick Stats */}
            <div className="mt-4 lg:mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card p-3 md:p-4 rounded-lg">
                <div className="text-xs md:text-sm text-muted-foreground">Market Dominance</div>
                <div className="text-lg md:text-xl font-bold font-mono">
                  {state.assets.length > 0
                    ? ((state.assets[0]?.market_cap || 0) /
                        state.assets.reduce((sum, asset) => sum + asset.market_cap, 0)) *
                      100
                    : 0}
                  %
                </div>
                <div className="text-xs text-muted-foreground">Top asset</div>
              </div>
              <div className="glass-card p-3 md:p-4 rounded-lg">
                <div className="text-xs md:text-sm text-muted-foreground">Portfolio Diversity</div>
                <div className="text-lg md:text-xl font-bold font-mono">
                  {analyticsData.categoryDistribution.length}
                </div>
                <div className="text-xs text-muted-foreground">Categories</div>
              </div>
              <div className="glass-card p-3 md:p-4 rounded-lg">
                <div className="text-xs md:text-sm text-muted-foreground">Risk Score</div>
                <div className="text-lg md:text-xl font-bold font-mono text-orange-500">
                  {analyticsData.riskMetrics.volatility.toFixed(0)}
                </div>
                <div className="text-xs text-muted-foreground">Volatility %</div>
              </div>
              <div className="glass-card p-3 md:p-4 rounded-lg">
                <div className="text-xs md:text-sm text-muted-foreground">Sharpe Ratio</div>
                <div
                  className={cn(
                    "text-lg md:text-xl font-bold font-mono",
                    analyticsData.riskMetrics.sharpeRatio > 1 ? "text-green-500" : "text-yellow-500",
                  )}
                >
                  {analyticsData.riskMetrics.sharpeRatio.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">Risk-adjusted</div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Market Dominance</CardTitle>
                  <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {state.assets.length > 0
                      ? ((state.assets[0]?.market_cap || 0) /
                          state.assets.reduce((sum, asset) => sum + asset.market_cap, 0)) *
                        100
                      : 0}
                    %
                  </div>
                  <p className="text-xs text-muted-foreground">Top asset dominance</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Portfolio Diversity</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.categoryDistribution.length}</div>
                  <p className="text-xs text-muted-foreground">Categories tracked</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-500">
                    {analyticsData.riskMetrics.volatility.toFixed(0)}
                  </div>
                  <p className="text-xs text-muted-foreground">Volatility %</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div
                    className={cn(
                      "text-2xl font-bold",
                      analyticsData.riskMetrics.sharpeRatio > 1 ? "text-green-500" : "text-yellow-500",
                    )}
                  >
                    {analyticsData.riskMetrics.sharpeRatio.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">Risk-adjusted return</p>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Tabs */}
            <Tabs defaultValue="market" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4 glass-card">
                <TabsTrigger value="market">Market Analysis</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="market" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Category Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Market Cap by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analyticsData.categoryDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {analyticsData.categoryDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Volume Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Top 10 by Volume</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analyticsData.volumeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={formatCurrency} />
                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            <Bar dataKey="volume" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Category Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Category Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.categoryDistribution.map((category, index) => (
                        <div key={category.name} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-medium">{category.name}</span>
                            <Badge variant="secondary">{category.count} assets</Badge>
                          </div>
                          <div className="text-right">
                            <div className="font-mono">{formatCurrency(category.value)}</div>
                            <div className="text-sm text-muted-foreground">{category.percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Performance Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>24h Performance Leaders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analyticsData.performanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                            <Bar
                              dataKey="change"
                              fill={(entry) => (entry > 0 ? "#10b981" : "#ef4444")}
                              name="24h Change %"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Performance Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analyticsData.performanceData.slice(0, 8).map((asset) => (
                          <div key={asset.name} className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">{asset.name}</span>
                              <div className="text-sm text-muted-foreground">
                                {formatCurrency(asset.marketCap)} market cap
                              </div>
                            </div>
                            <div className="text-right">
                              <div
                                className={cn(
                                  "font-mono font-bold",
                                  asset.change >= 0 ? "text-green-500" : "text-red-500",
                                )}
                              >
                                {asset.change >= 0 ? "+" : ""}
                                {asset.change.toFixed(2)}%
                              </div>
                              <div className="text-sm text-muted-foreground">{formatCurrency(asset.volume)} vol</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-4">
                {state.portfolio.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Portfolio Data</h3>
                      <p className="text-muted-foreground">Add assets to your portfolio to see detailed analytics</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Portfolio Allocation */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Portfolio Allocation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={analyticsData.portfolioAllocation}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {analyticsData.portfolioAllocation.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Portfolio Breakdown */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Holdings Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {analyticsData.portfolioAllocation.map((holding, index) => (
                            <div key={holding.name} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{holding.name}</span>
                                <span className="font-mono">{formatCurrency(holding.value)}</span>
                              </div>
                              <Progress value={holding.percentage} className="h-2" />
                              <div className="text-sm text-muted-foreground text-right">
                                {holding.percentage.toFixed(1)}% of portfolio
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="risk" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Risk Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Volatility</span>
                          <span className="font-mono">{analyticsData.riskMetrics.volatility.toFixed(1)}%</span>
                        </div>
                        <Progress value={analyticsData.riskMetrics.volatility} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Max Drawdown</span>
                          <span className="font-mono text-red-500">
                            -{analyticsData.riskMetrics.maxDrawdown.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={analyticsData.riskMetrics.maxDrawdown} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Beta</span>
                          <span className="font-mono">{analyticsData.riskMetrics.beta.toFixed(2)}</span>
                        </div>
                        <Progress value={(analyticsData.riskMetrics.beta / 2) * 100} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Sharpe Ratio</span>
                          <span
                            className={cn(
                              "font-mono",
                              analyticsData.riskMetrics.sharpeRatio > 1 ? "text-green-500" : "text-yellow-500",
                            )}
                          >
                            {analyticsData.riskMetrics.sharpeRatio.toFixed(2)}
                          </span>
                        </div>
                        <Progress value={(analyticsData.riskMetrics.sharpeRatio / 3) * 100} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Risk Assessment */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Assessment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <h4 className="font-semibold text-yellow-600 mb-2">Moderate Risk</h4>
                        <p className="text-sm text-muted-foreground">
                          Your portfolio shows moderate volatility with decent risk-adjusted returns.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Diversification</span>
                          <Badge variant="secondary">Good</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Correlation Risk</span>
                          <Badge variant="outline">Medium</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Liquidity Risk</span>
                          <Badge variant="secondary">Low</Badge>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <h5 className="font-medium mb-2">Recommendations</h5>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Consider adding more defensive assets</li>
                          <li>• Monitor correlation between holdings</li>
                          <li>• Regular rebalancing recommended</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
