"use client"

import { Sidebar } from "@/components/sidebar"
import { PortfolioSummary } from "@/components/portfolio-summary"
import { MarketOverview } from "@/components/market-overview"
import { ThemeToggle } from "@/components/theme-toggle"
import { LiveDataIndicator } from "@/components/live-data-indicator"
import { TopAssets } from "@/components/top-assets"
import { Button } from "@/components/ui/button"
import { TrendingUp, Target, Activity, Search, Bell, User, Sparkles, Zap } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced animated background particles */}
      <div className="particles hidden md:block">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 12}s`,
              animationDuration: `${8 + Math.random() * 8}s`,
            }}
          />
        ))}
      </div>

      <Sidebar />

      <main className="flex-1 md:ml-56 relative z-10">
        {/* Enhanced Header Bar */}
        <header className="header-scroll bg-background/95 backdrop-blur-xl border-b border-border/30 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Enhanced Title Section */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-chart-2 to-chart-3 flex items-center justify-center animate-float shadow-2xl shadow-primary/25">
                    <Activity className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center animate-bounce-gentle">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl lg:text-6xl font-bold neon-text mb-2">Dashboard</h1>
                  <p className="text-lg text-muted-foreground font-medium">
                    Welcome to your professional crypto & stock market command center
                  </p>
                </div>
              </div>

              {/* Enhanced Search and Controls */}
              <div className="flex items-center space-x-4">
                {/* Enhanced Search Bar */}
                <div className="relative hidden md:block">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="Search assets..."
                    className="pl-12 w-80 h-12 glass-card bg-background/50 border-0 text-base font-medium placeholder:text-muted-foreground/70"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <kbd className="px-2 py-1 text-xs bg-muted/50 rounded border">⌘K</kbd>
                  </div>
                </div>

                {/* Enhanced Quick Actions */}
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="glass-card hover:scale-110 transition-all duration-300 border-0 h-12 w-12"
                  >
                    <Bell className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="glass-card hover:scale-110 transition-all duration-300 border-0 h-12 w-12"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                  <LiveDataIndicator />
                  <ThemeToggle />
                </div>
              </div>
            </div>

            {/* Enhanced Quick Stats Bar */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="glass-card p-6 rounded-2xl border-0 card-hover">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-muted-foreground font-semibold">Total Portfolio</div>
                  <div className="p-2 rounded-lg bg-green-400/20">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-mono text-green-500 mb-1">$12,345.67</div>
                <div className="text-sm text-green-500 font-semibold">+2.34%</div>
              </div>
              <div className="glass-card p-6 rounded-2xl border-0 card-hover">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-muted-foreground font-semibold">Market Cap</div>
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-mono mb-1">$2.1T</div>
                <div className="text-sm text-red-500 font-semibold">-0.45%</div>
              </div>
              <div className="glass-card p-6 rounded-2xl border-0 card-hover">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-muted-foreground font-semibold">24h Volume</div>
                  <div className="p-2 rounded-lg bg-chart-2/20">
                    <Zap className="h-4 w-4 text-chart-2" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-mono mb-1">$89.2B</div>
                <div className="text-sm text-green-500 font-semibold">+5.67%</div>
              </div>
              <div className="glass-card p-6 rounded-2xl border-0 card-hover">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-muted-foreground font-semibold">Active Assets</div>
                  <div className="p-2 rounded-lg bg-chart-3/20">
                    <Target className="h-4 w-4 text-chart-3" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-mono mb-1">156</div>
                <div className="text-sm text-muted-foreground font-semibold">Tracking</div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Portfolio Summary */}
            <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <PortfolioSummary />
            </div>

            {/* Market Overview */}
            <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <MarketOverview />
            </div>

            {/* Top Assets */}
            <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <TopAssets />
            </div>

            {/* Enhanced Quick Actions */}
            <div
              className="flex flex-col sm:flex-row flex-wrap gap-4 animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Button className="btn-primary px-8 py-4 text-base font-semibold rounded-xl">
                <Target className="w-5 h-5 mr-3" />
                Add to Portfolio
              </Button>
              <Button
                variant="outline"
                className="glass-card px-8 py-4 text-base font-semibold hover:scale-105 transition-transform bg-transparent border-primary/20 hover:border-primary/50 rounded-xl"
              >
                <TrendingUp className="w-5 h-5 mr-3" />
                View All Markets
              </Button>
              <Button
                variant="outline"
                className="glass-card px-8 py-4 text-base font-semibold hover:scale-105 transition-transform bg-transparent border-primary/20 hover:border-primary/50 rounded-xl"
              >
                <Activity className="w-5 h-5 mr-3" />
                Manage Watchlist
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
