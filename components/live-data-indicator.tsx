"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Wifi, WifiOff, Activity } from "lucide-react"
import { useDashboard } from "@/components/dashboard-provider"
import { cn } from "@/lib/utils"

export function LiveDataIndicator() {
  const { state, refreshData } = useDashboard()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshData()
    setIsRefreshing(false)
  }

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return "Never"
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "Just now"
    if (minutes === 1) return "1 minute ago"
    return `${minutes} minutes ago`
  }

  return (
    <div className="flex items-center space-x-2 md:space-x-3 glass-card p-2 rounded-xl">
      <Badge
        variant={state.isLoading ? "secondary" : "default"}
        className={cn(
          "flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 transition-all duration-300",
          !state.isLoading &&
            "bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse shadow-lg shadow-green-500/25",
        )}
      >
        {state.isLoading ? (
          <>
            <WifiOff className="h-3 w-3 animate-pulse" />
            <span className="text-xs font-medium hidden md:inline">Loading...</span>
          </>
        ) : (
          <>
            <div className="relative">
              <Wifi className="h-3 w-3" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping" />
            </div>
            <span className="text-xs font-medium">Live</span>
            <Activity className="h-3 w-3 animate-pulse hidden md:inline" />
          </>
        )}
      </Badge>

      <div className="text-xs text-muted-foreground font-mono hidden md:block">
        Updated: {formatLastUpdated(state.lastUpdated)}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className={cn("h-8 w-8 glass-card hover:scale-110 transition-all duration-300", isRefreshing && "animate-spin")}
      >
        <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
      </Button>
    </div>
  )
}
