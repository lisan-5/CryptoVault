"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface Asset {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  volume: number
  image: string
  sparkline_in_7d?: { price: number[] }
  category?: string
  type: "crypto" | "stock"
}

export interface PortfolioItem {
  assetId: string
  symbol: string
  name: string
  amount: number
  purchasePrice: number
  currentPrice: number
}

interface DashboardState {
  assets: Asset[]
  portfolio: PortfolioItem[]
  favorites: string[]
  searchQuery: string
  selectedCategory: string
  sortBy: string
  currency: string
  isLoading: boolean
  lastUpdated: Date | null
}

type DashboardAction =
  | { type: "SET_ASSETS"; payload: Asset[] }
  | { type: "ADD_TO_PORTFOLIO"; payload: PortfolioItem }
  | { type: "REMOVE_FROM_PORTFOLIO"; payload: string }
  | { type: "TOGGLE_FAVORITE"; payload: string }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_SORT_BY"; payload: string }
  | { type: "SET_CURRENCY"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "UPDATE_PRICES"; payload: Asset[] }
  | { type: "SET_LAST_UPDATED"; payload: Date }

const initialState: DashboardState = {
  assets: [],
  portfolio: [],
  favorites: [],
  searchQuery: "",
  selectedCategory: "all",
  sortBy: "market_cap",
  currency: "usd",
  isLoading: true,
  lastUpdated: null,
}

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case "SET_ASSETS":
      return { ...state, assets: action.payload, isLoading: false }
    case "ADD_TO_PORTFOLIO":
      return { ...state, portfolio: [...state.portfolio, action.payload] }
    case "REMOVE_FROM_PORTFOLIO":
      return { ...state, portfolio: state.portfolio.filter((item) => item.assetId !== action.payload) }
    case "TOGGLE_FAVORITE":
      const isFavorite = state.favorites.includes(action.payload)
      return {
        ...state,
        favorites: isFavorite
          ? state.favorites.filter((id) => id !== action.payload)
          : [...state.favorites, action.payload],
      }
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload }
    case "SET_CATEGORY":
      return { ...state, selectedCategory: action.payload }
    case "SET_SORT_BY":
      return { ...state, sortBy: action.payload }
    case "SET_CURRENCY":
      return { ...state, currency: action.payload }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "UPDATE_PRICES":
      return {
        ...state,
        assets: action.payload,
        portfolio: state.portfolio.map((item) => {
          const updatedAsset = action.payload.find((asset) => asset.id === item.assetId)
          return updatedAsset ? { ...item, currentPrice: updatedAsset.current_price } : item
        }),
      }
    case "SET_LAST_UPDATED":
      return { ...state, lastUpdated: action.payload }
    default:
      return state
  }
}

const DashboardContext = createContext<{
  state: DashboardState
  dispatch: React.Dispatch<DashboardAction>
  refreshData: () => Promise<void>
} | null>(null)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState)

  // Fetch crypto data from CoinGecko
  const fetchCryptoData = async (): Promise<Asset[]> => {
    try {
      const response = await fetch("/api/crypto-data")
      if (!response.ok) throw new Error("Failed to fetch crypto data")
      const data = await response.json()
      return data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        current_price: coin.current_price,
        price_change_percentage_24h: coin.price_change_percentage_24h || 0,
        market_cap: coin.market_cap || 0,
        volume: coin.total_volume || 0,
        image: coin.image,
        sparkline_in_7d: coin.sparkline_in_7d,
        category: coin.category || "cryptocurrency",
        type: "crypto" as const,
      }))
    } catch (error) {
      console.error("Error fetching crypto data:", error)
      return []
    }
  }

  // Fetch stock data from Alpha Vantage
  const fetchStockData = async (): Promise<Asset[]> => {
    try {
      const response = await fetch("/api/stock-data")
      if (!response.ok) throw new Error("Failed to fetch stock data")
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching stock data:", error)
      return []
    }
  }

  // Combined data fetching
  const fetchAllData = async (): Promise<Asset[]> => {
    const [cryptoData, stockData] = await Promise.all([fetchCryptoData(), fetchStockData()])
    return [...cryptoData, ...stockData]
  }

  const refreshData = async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const allAssets = await fetchAllData()
      dispatch({ type: "SET_ASSETS", payload: allAssets })
      dispatch({ type: "SET_LAST_UPDATED", payload: new Date() })
    } catch (error) {
      console.error("Error refreshing data:", error)
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  // Initialize data
  useEffect(() => {
    refreshData()

    // Load saved data from localStorage
    const savedPortfolio = localStorage.getItem("crypto-portfolio")
    const savedFavorites = localStorage.getItem("crypto-favorites")

    if (savedPortfolio) {
      const portfolio = JSON.parse(savedPortfolio)
      portfolio.forEach((item: PortfolioItem) => {
        dispatch({ type: "ADD_TO_PORTFOLIO", payload: item })
      })
    }

    if (savedFavorites) {
      const favorites = JSON.parse(savedFavorites)
      favorites.forEach((id: string) => {
        dispatch({ type: "TOGGLE_FAVORITE", payload: id })
      })
    }
  }, [])

  // Save to localStorage when portfolio or favorites change
  useEffect(() => {
    localStorage.setItem("crypto-portfolio", JSON.stringify(state.portfolio))
  }, [state.portfolio])

  useEffect(() => {
    localStorage.setItem("crypto-favorites", JSON.stringify(state.favorites))
  }, [state.favorites])

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [])

  return <DashboardContext.Provider value={{ state, dispatch, refreshData }}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}
