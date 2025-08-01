"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { SettingsIcon, Palette, Globe, Bell, Zap, User } from "lucide-react"
import { useDashboard } from "@/components/dashboard-provider"
import { useTheme } from "@/components/theme-provider"

export default function Settings() {
  const { state, dispatch } = useDashboard()
  const { theme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState([10])

  const currencies = ["USD", "EUR", "GBP", "JPY", "BTC", "ETH"]

  const handleCurrencyChange = (currency: string) => {
    dispatch({ type: "SET_CURRENCY", payload: currency.toLowerCase() })
  }

  const clearPortfolio = () => {
    if (confirm("Are you sure you want to clear your entire portfolio? This action cannot be undone.")) {
      state.portfolio.forEach((item) => {
        dispatch({ type: "REMOVE_FROM_PORTFOLIO", payload: item.assetId })
      })
    }
  }

  const clearFavorites = () => {
    if (confirm("Are you sure you want to clear all favorites?")) {
      state.favorites.forEach((id) => {
        dispatch({ type: "TOGGLE_FAVORITE", payload: id })
      })
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 md:ml-56">
        {/* Enhanced Header Bar */}
        <header className="header-scroll bg-background/95 backdrop-blur-lg border-b border-border/50 px-4 md:px-6 py-4 md:py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
              {/* Title Section */}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center shadow-lg">
                  <SettingsIcon className="w-5 h-5 md:w-7 md:h-7 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold neon-text">Settings</h1>
                  <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
                    Customize your dashboard experience
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
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-4 md:p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Theme</Label>
                    <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={theme === "light" ? "default" : "secondary"}>☀️ Light</Badge>
                    <Badge variant={theme === "dark" ? "default" : "secondary"}>🌙 Dark</Badge>
                    <Badge variant={theme === "neon" ? "default" : "secondary"}>🔥 Neon</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Currency Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Currency & Region
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Default Currency</Label>
                    <p className="text-sm text-muted-foreground">Choose your preferred currency for price display</p>
                  </div>
                  <Select value={state.currency.toUpperCase()} onValueChange={handleCurrencyChange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Price Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when prices hit your targets</p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Auto Refresh</Label>
                    <p className="text-sm text-muted-foreground">Automatically update prices in real-time</p>
                  </div>
                  <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                </div>

                {autoRefresh && (
                  <div className="space-y-2">
                    <Label className="text-sm">Refresh Interval: {refreshInterval[0]} seconds</Label>
                    <Slider
                      value={refreshInterval}
                      onValueChange={setRefreshInterval}
                      max={60}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base">Portfolio</Label>
                    <p className="text-sm text-muted-foreground">{state.portfolio.length} assets in portfolio</p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={clearPortfolio}
                      disabled={state.portfolio.length === 0}
                    >
                      Clear Portfolio
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base">Favorites</Label>
                    <p className="text-sm text-muted-foreground">{state.favorites.length} favorite assets</p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={clearFavorites}
                      disabled={state.favorites.length === 0}
                    >
                      Clear Favorites
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About CryptoVault</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Version 1.0.0</p>
                  <p>Built with Next.js, React, and Tailwind CSS</p>
                  <p>Professional cryptocurrency and stock market tracking platform</p>
                  <p className="pt-2">
                    <strong>Features:</strong> Portfolio management, real-time price tracking, multiple themes,
                    favorites, market analysis, and advanced analytics.
                  </p>
                  <p className="pt-2 border-t">
                    <strong>Created by:</strong>{" "}
                    <a
                      href="https://github.com/lisan-5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors underline"
                    >
                      Lisanegbriel Abay
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
