"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Briefcase, Settings, TrendingUp, Menu, X, Star, BarChart3, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Markets", href: "/markets", icon: TrendingUp },
  { name: "Portfolio", href: "/portfolio", icon: Briefcase },
  { name: "Watchlist", href: "/watchlist", icon: Star },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden glass-card hover:scale-110 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-56 glass-card border-r border-border/30 transform transition-all duration-500 ease-out md:translate-x-0 md:static md:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full relative">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-chart-2/5 pointer-events-none" />

          {/* Logo */}
          <div className="flex items-center justify-center h-20 px-6 border-b border-border/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-chart-2/10 to-primary/10 animate-gradient-shift" />
            <div className="relative flex items-center space-x-3 animate-scale-in">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-chart-2 to-chart-3 flex items-center justify-center shadow-lg border border-primary/20 animate-float">
                <Activity className="w-6 h-6 text-white drop-shadow-sm" />
              </div>
              <h1 className="text-2xl font-bold sidebar-title">CryptoVault</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 relative">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group relative overflow-hidden animate-slide-up",
                    isActive
                      ? "bg-gradient-to-r from-primary to-chart-2 text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:scale-[1.02]",
                  )}
                  onClick={() => setIsOpen(false)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-chart-2/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

                  {/* Icon with enhanced styling */}
                  <div
                    className={cn(
                      "relative z-10 p-2 rounded-lg transition-all duration-300",
                      isActive ? "bg-white/20 shadow-inner" : "group-hover:bg-primary/10 group-hover:scale-110",
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>

                  <span className="relative z-10 ml-3 font-semibold">{item.name}</span>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute right-3 w-2 h-2 bg-primary-foreground rounded-full animate-bounce-gentle shadow-lg" />
                  )}

                  {/* Shimmer effect for active item */}
                  {isActive && <div className="absolute inset-0 shimmer-effect rounded-xl" />}
                </Link>
              )
            })}
          </nav>

          {/* Enhanced Footer */}
          <div className="p-6 border-t border-border/30 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
            <div className="relative text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-chart-2/20 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">CryptoVault</p>
                  <p className="text-xs text-muted-foreground">v2.0.0</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">© 2025 CryptoVault</p>
              <p className="text-xs text-muted-foreground">
                Crafted by{" "}
                <a
                  href="https://github.com/lisan-5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors underline decoration-primary/50 hover:decoration-primary font-medium"
                >
                  Lisanegbriel Abay
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
