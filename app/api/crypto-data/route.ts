import { NextResponse } from "next/server"

const COINGECKO_API_KEY = "CG-EDsa6fDe76fp1W7nhjmN6L8f"

export async function GET() {
  try {
    // Fetch top 50 cryptocurrencies with market data
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h&x_cg_demo_api_key=${COINGECKO_API_KEY}`,
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 30 }, // Cache for 30 seconds
      },
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()

    // Add category information for better filtering
    const enhancedData = data.map((coin: any) => ({
      ...coin,
      category: getCoinCategory(coin.id, coin.symbol),
    }))

    return NextResponse.json(enhancedData)
  } catch (error) {
    console.error("Error fetching crypto data:", error)
    return NextResponse.json({ error: "Failed to fetch cryptocurrency data" }, { status: 500 })
  }
}

// Helper function to categorize coins
function getCoinCategory(id: string, symbol: string): string {
  const categories: { [key: string]: string } = {
    bitcoin: "store-of-value",
    ethereum: "smart-contracts",
    cardano: "smart-contracts",
    solana: "smart-contracts",
    polkadot: "interoperability",
    chainlink: "oracle",
    uniswap: "defi",
    aave: "defi",
    compound: "defi",
    maker: "defi",
    polygon: "scaling",
    "avalanche-2": "smart-contracts",
    cosmos: "interoperability",
    algorand: "smart-contracts",
    tezos: "smart-contracts",
    filecoin: "storage",
    "the-graph": "indexing",
    "basic-attention-token": "utility",
    "enjin-coin": "gaming",
    decentraland: "metaverse",
    sandbox: "metaverse",
  }

  return categories[id] || "cryptocurrency"
}
