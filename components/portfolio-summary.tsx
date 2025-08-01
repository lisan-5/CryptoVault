"use client"

import { useMemo } from "react"
import { TrendingUp, TrendingDown, DollarSign, Percent, Target, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboard } from "@/components/dashboard-provider"
import { cn } from "@/lib/utils"

export function PortfolioSummary() {
  const { state } = useDashboard()

  const portfolioStats = useMemo(() => {
    if (state.portfolio.length === 0) {
      return {
        totalValue: 0,
        totalInvested: 0,
        totalPnL: 0,
        totalPnLPercentage: 0,
        isPositive: true,
      }
    }

    const totalValue = state.portfolio.reduce((sum, item) => sum + item.amount * item.currentPrice, 0)
    const totalInvested = state.portfolio.reduce((sum, item) => sum + item.amount * item.purchasePrice, 0)
    const totalPnL = totalValue - totalInvested
    const totalPnLPercentage = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0

    return {
      totalValue,
      totalInvested,
      totalPnL,
      totalPnLPercentage,
      isPositive: totalPnL >= 0,
    }
  }, [state.portfolio])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const cards = [
    {
      title: "Total Portfolio Value",
      value: formatCurrency(portfolioStats.totalValue),
      subtitle: "Current market value",
      icon: DollarSign,
      gradient: "from-primary via-chart-2 to-chart-3",
      special: true,
    },
    {
      title: "Total Invested",
      value: formatCurrency(portfolioStats.totalInvested),
      subtitle: "Initial investment",
      icon: Target,
      gradient: "from-chart-3 via-chart-4 to-chart-5",
    },
    {
      title: "Total P&L",
      value: `${portfolioStats.totalPnL >= 0 ? "+" : ""}${formatCurrency(portfolioStats.totalPnL)}`,
      subtitle: "Profit & Loss",
      icon: portfolioStats.isPositive ? TrendingUp : TrendingDown,
      gradient: portfolioStats.isPositive
        ? "from-green-400 via-green-500 to-emerald-600"
        : "from-red-400 via-red-500 to-rose-600",
      color: portfolioStats.isPositive ? "text-green-400" : "text-red-400",
    },
    {
      title: "P&L Percentage",
      value: `${portfolioStats.totalPnLPercentage >= 0 ? "+" : ""}${portfolioStats.totalPnLPercentage.toFixed(2)}%`,
      subtitle: "Return on investment",
      icon: Percent,
      gradient: portfolioStats.isPositive
        ? "from-green-400 via-emerald-500 to-teal-500"
        : "from-red-400 via-rose-500 to-pink-500",
      color: portfolioStats.isPositive ? "text-green-400" : "text-red-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          className={cn(
            "card-hover glass-card relative overflow-hidden group animate-slide-up border-0",
            card.special && "gradient-border",
          )}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Enhanced background gradient effect */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity duration-500",
              card.gradient,
            )}
          />

          {/* Floating particles effect for special card */}
          {card.special && (
            <div className="absolute inset-0 hidden md:block">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-primary rounded-full animate-float opacity-40"
                  style={{
                    left: `${15 + i * 10}%`,
                    top: `${20 + (i % 3) * 20}%`,
                    animationDelay: `${i * 0.7}s`,
                    animationDuration: `${4 + i * 0.5}s`,
                  }}
                />
              ))}
            </div>
          )}

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
              {card.title}
            </CardTitle>
            <div
              className={cn(
                "p-2.5 rounded-xl glass-card group-hover:scale-110 transition-all duration-300 border-0",
                card.special && "bg-gradient-to-br from-primary/20 to-chart-2/20 shadow-lg",
              )}
            >
              <card.icon
                className={cn(
                  "h-5 w-5 transition-colors duration-300",
                  card.color || "text-muted-foreground group-hover:text-primary",
                )}
              />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 pb-6">
            <div
              className={cn(
                "text-2xl font-bold font-mono mb-2 transition-all duration-300",
                card.color || "group-hover:text-primary",
                card.special && "bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent",
              )}
            >
              {card.value}
            </div>
            <p className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors font-medium">
              {card.subtitle}
            </p>

            {/* Enhanced progress indicator for special card */}
            {card.special && portfolioStats.totalValue > 0 && (
              <div className="mt-4 hidden md:block">
                <div className="h-2 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    className="h-full bg-gradient-to-r from-primary via-chart-2 to-chart-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{ width: `${Math.min((portfolioStats.totalValue / 100000) * 100, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground font-medium">Portfolio growth</p>
                  <Sparkles className="h-3 w-3 text-primary animate-bounce-gentle" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
