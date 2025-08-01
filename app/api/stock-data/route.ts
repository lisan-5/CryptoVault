import { NextResponse } from "next/server"

const ALPHA_VANTAGE_API_KEY = "O8MRN79VYSTRS9K0"

export async function GET() {
  try {
    // Popular stocks to track
    const symbols = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "NVDA", "META", "NFLX", "AMD", "INTC"]

    const stockPromises = symbols.map(async (symbol) => {
      try {
        // Fetch quote data
        const quoteResponse = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`,
        )

        if (!quoteResponse.ok) {
          throw new Error(`Alpha Vantage API error for ${symbol}: ${quoteResponse.status}`)
        }

        const quoteData = await quoteResponse.json()
        const quote = quoteData["Global Quote"]

        if (!quote) {
          console.warn(`No quote data for ${symbol}`)
          return null
        }

        // Fetch daily data for sparkline
        const dailyResponse = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`,
        )

        let sparklineData: number[] = []
        if (dailyResponse.ok) {
          const dailyData = await dailyResponse.json()
          const timeSeries = dailyData["Time Series (Daily)"]
          if (timeSeries) {
            const dates = Object.keys(timeSeries).slice(0, 7).reverse()
            sparklineData = dates.map((date) => Number.parseFloat(timeSeries[date]["4. close"]))
          }
        }

        return {
          id: symbol.toLowerCase(),
          symbol: symbol.toLowerCase(),
          name: getCompanyName(symbol),
          current_price: Number.parseFloat(quote["05. price"]),
          price_change_percentage_24h: Number.parseFloat(quote["10. change percent"].replace("%", "")),
          market_cap: Number.parseFloat(quote["05. price"]) * 1000000000, // Approximate market cap
          volume: Number.parseInt(quote["06. volume"]),
          image: `/placeholder.svg?height=32&width=32&text=${symbol}`,
          sparkline_in_7d: { price: sparklineData },
          category: getStockCategory(symbol),
          type: "stock" as const,
        }
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error)
        return null
      }
    })

    const results = await Promise.all(stockPromises)
    const validStocks = results.filter((stock) => stock !== null)

    return NextResponse.json(validStocks)
  } catch (error) {
    console.error("Error fetching stock data:", error)
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 })
  }
}

// Helper functions
function getCompanyName(symbol: string): string {
  const names: { [key: string]: string } = {
    AAPL: "Apple Inc.",
    GOOGL: "Alphabet Inc.",
    MSFT: "Microsoft Corporation",
    TSLA: "Tesla, Inc.",
    AMZN: "Amazon.com, Inc.",
    NVDA: "NVIDIA Corporation",
    META: "Meta Platforms, Inc.",
    NFLX: "Netflix, Inc.",
    AMD: "Advanced Micro Devices",
    INTC: "Intel Corporation",
  }
  return names[symbol] || symbol
}

function getStockCategory(symbol: string): string {
  const categories: { [key: string]: string } = {
    AAPL: "technology",
    GOOGL: "technology",
    MSFT: "technology",
    TSLA: "automotive",
    AMZN: "e-commerce",
    NVDA: "semiconductors",
    META: "social-media",
    NFLX: "entertainment",
    AMD: "semiconductors",
    INTC: "semiconductors",
  }
  return categories[symbol] || "stock"
}
