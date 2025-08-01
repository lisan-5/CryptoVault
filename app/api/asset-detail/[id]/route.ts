import { NextResponse } from "next/server"

const COINGECKO_API_KEY = "CG-EDsa6fDe76fp1W7nhjmN6L8f"
const ALPHA_VANTAGE_API_KEY = "O8MRN79VYSTRS9K0"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  try {
    // Check if it's a crypto or stock
    const isCrypto = !["aapl", "googl", "msft", "tsla", "amzn", "nvda", "meta", "nflx", "amd", "intc"].includes(
      id.toLowerCase(),
    )

    if (isCrypto) {
      // Fetch detailed crypto data from CoinGecko
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true&x_cg_demo_api_key=${COINGECKO_API_KEY}`,
        {
          headers: {
            Accept: "application/json",
          },
          next: { revalidate: 60 }, // Cache for 1 minute
        },
      )

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`)
      }

      const data = await response.json()

      return NextResponse.json({
        id: data.id,
        symbol: data.symbol,
        name: data.name,
        description: data.description?.en || "",
        current_price: data.market_data?.current_price?.usd || 0,
        market_cap: data.market_data?.market_cap?.usd || 0,
        total_volume: data.market_data?.total_volume?.usd || 0,
        price_change_percentage_24h: data.market_data?.price_change_percentage_24h || 0,
        price_change_percentage_7d: data.market_data?.price_change_percentage_7d || 0,
        price_change_percentage_30d: data.market_data?.price_change_percentage_30d || 0,
        ath: data.market_data?.ath?.usd || 0,
        atl: data.market_data?.atl?.usd || 0,
        circulating_supply: data.market_data?.circulating_supply || 0,
        total_supply: data.market_data?.total_supply || 0,
        max_supply: data.market_data?.max_supply || 0,
        sparkline_in_7d: data.market_data?.sparkline_7d,
        image: data.image?.large || data.image?.small,
        categories: data.categories || [],
        type: "crypto",
      })
    } else {
      // Fetch detailed stock data from Alpha Vantage
      const symbol = id.toUpperCase()

      // Get company overview
      const overviewResponse = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`,
      )

      // Get quote data
      const quoteResponse = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`,
      )

      const [overviewData, quoteData] = await Promise.all([overviewResponse.json(), quoteResponse.json()])

      const quote = quoteData["Global Quote"]

      return NextResponse.json({
        id: symbol.toLowerCase(),
        symbol: symbol.toLowerCase(),
        name: overviewData.Name || symbol,
        description: overviewData.Description || "",
        current_price: Number.parseFloat(quote["05. price"]),
        market_cap: Number.parseFloat(overviewData.MarketCapitalization || "0"),
        total_volume: Number.parseInt(quote["06. volume"]),
        price_change_percentage_24h: Number.parseFloat(quote["10. change percent"].replace("%", "")),
        pe_ratio: Number.parseFloat(overviewData.PERatio || "0"),
        dividend_yield: Number.parseFloat(overviewData.DividendYield || "0"),
        week_52_high: Number.parseFloat(overviewData["52WeekHigh"] || "0"),
        week_52_low: Number.parseFloat(overviewData["52WeekLow"] || "0"),
        sector: overviewData.Sector || "",
        industry: overviewData.Industry || "",
        type: "stock",
      })
    }
  } catch (error) {
    console.error(`Error fetching asset detail for ${id}:`, error)
    return NextResponse.json({ error: "Failed to fetch asset details" }, { status: 500 })
  }
}
