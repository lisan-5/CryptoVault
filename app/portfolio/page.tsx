"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { PortfolioSummary } from "@/components/portfolio-summary"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, TrendingUp, TrendingDown, Briefcase, Bell, User } from "lucide-react"
import { useDashboard } from "@/components/dashboard-provider"
import { cn } from "@/lib/utils"

export default function Portfolio() {
  const { state, dispatch } = useDashboard()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState("")
  const [amount, setAmount] = useState("")
  const [purchasePrice, setPurchasePrice] = useState("")

  const handleAddToPortfolio = () => {
    const asset = state.assets.find((a) => a.id === selectedAsset)
    if (!asset || !amount || !purchasePrice) return

    const portfolioItem = {
      assetId: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      amount: Number.parseFloat(amount),
      purchasePrice: Number.parseFloat(purchasePrice),
      currentPrice: asset.current_price,
    }

    dispatch({ type: "ADD_TO_PORTFOLIO", payload: portfolioItem })
    setIsAddDialogOpen(false)
    setSelectedAsset("")
    setAmount("")
    setPurchasePrice("")
  }

  const handleRemoveFromPortfolio = (assetId: string) => {
    dispatch({ type: "REMOVE_FROM_PORTFOLIO", payload: assetId })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
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
                  <Briefcase className="w-5 h-5 md:w-7 md:h-7 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold neon-text">Portfolio</h1>
                  <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
                    Manage your crypto investments
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-3 lg:space-x-4">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="neon-glow px-4 md:px-6">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Asset
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Asset to Portfolio</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="asset">Asset</Label>
                        <select
                          id="asset"
                          value={selectedAsset}
                          onChange={(e) => setSelectedAsset(e.target.value)}
                          className="w-full p-2 border rounded-md bg-background"
                        >
                          <option value="">Select an asset</option>
                          {state.assets.map((asset) => (
                            <option key={asset.id} value={asset.id}>
                              {asset.name} ({asset.symbol.toUpperCase()})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.00000001"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="purchasePrice">Purchase Price (USD)</Label>
                        <Input
                          id="purchasePrice"
                          type="number"
                          step="0.01"
                          value={purchasePrice}
                          onChange={(e) => setPurchasePrice(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <Button onClick={handleAddToPortfolio} className="w-full">
                        Add to Portfolio
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

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

            {/* Portfolio Quick Stats */}
            <div className="mt-4 lg:mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card p-3 md:p-4 rounded-lg">
                <div className="text-xs md:text-sm text-muted-foreground">Total Value</div>
                <div className="text-lg md:text-xl font-bold font-mono text-green-500">
                  {formatCurrency(state.portfolio.reduce((sum, item) => sum + item.amount * item.currentPrice, 0))}
                </div>
                <div className="text-xs text-green-500">+2.34%</div>
              </div>
              <div className="glass-card p-3 md:p-4 rounded-lg">
                <div className="text-xs md:text-sm text-muted-foreground">Total P&L</div>
                <div className="text-lg md:text-xl font-bold font-mono text-green-500">+$1,234.56</div>
                <div className="text-xs text-green-500">+12.5%</div>
              </div>
              <div className="glass-card p-3 md:p-4 rounded-lg">
                <div className="text-xs md:text-sm text-muted-foreground">Assets</div>
                <div className="text-lg md:text-xl font-bold font-mono">{state.portfolio.length}</div>
                <div className="text-xs text-muted-foreground">Holdings</div>
              </div>
              <div className="glass-card p-3 md:p-4 rounded-lg">
                <div className="text-xs md:text-sm text-muted-foreground">Best Performer</div>
                <div className="text-lg md:text-xl font-bold font-mono">BTC</div>
                <div className="text-xs text-green-500">+15.2%</div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Portfolio Summary */}
            <PortfolioSummary />

            {/* Portfolio Holdings */}
            <Card>
              <CardHeader>
                <CardTitle>Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                {state.portfolio.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">Your portfolio is empty</p>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Asset
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Purchase Price</TableHead>
                        <TableHead className="text-right">Current Price</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                        <TableHead className="text-right">P&L</TableHead>
                        <TableHead className="text-right">P&L %</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {state.portfolio.map((item) => {
                        const currentValue = item.amount * item.currentPrice
                        const investedValue = item.amount * item.purchasePrice
                        const pnl = currentValue - investedValue
                        const pnlPercentage = (pnl / investedValue) * 100
                        const isPositive = pnl >= 0

                        return (
                          <TableRow key={item.assetId}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-muted-foreground">{item.symbol.toUpperCase()}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono">{item.amount.toFixed(8)}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency(item.purchasePrice)}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency(item.currentPrice)}</TableCell>
                            <TableCell className="text-right font-mono font-bold">
                              {formatCurrency(currentValue)}
                            </TableCell>
                            <TableCell
                              className={cn(
                                "text-right font-mono font-bold",
                                isPositive ? "text-green-500" : "text-red-500",
                              )}
                            >
                              <div className="flex items-center justify-end space-x-1">
                                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                <span>
                                  {pnl >= 0 ? "+" : ""}
                                  {formatCurrency(pnl)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell
                              className={cn(
                                "text-right font-mono font-bold",
                                isPositive ? "text-green-500" : "text-red-500",
                              )}
                            >
                              {pnlPercentage >= 0 ? "+" : ""}
                              {pnlPercentage.toFixed(2)}%
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveFromPortfolio(item.assetId)}
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
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
