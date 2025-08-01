# CryptoVault - Professional Crypto & Stock Market Dashboard

A modern, real-time cryptocurrency and stock market tracking platform built with Next.js, React, and Tailwind CSS. Features advanced portfolio management, market analysis, and beautiful visualizations.


## ✨ Features

### 🚀 Core Features
- **Real-time Market Data** - Live cryptocurrency and stock prices from CoinGecko and Alpha Vantage APIs
- **Portfolio Management** - Track your investments with profit/loss calculations
- **Watchlist** - Monitor your favorite assets with advanced filtering
- **Market Analysis** - Comprehensive market overview with gainers/losers
- **Advanced Analytics** - Risk metrics, correlation analysis, and performance insights

### 🎨 Design & UX
- **Multiple Themes** - Light, Dark, and Neon themes with smooth transitions
- **Glass Morphism** - Modern glass-card design with backdrop blur effects
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Smooth Animations** - Fluid transitions and micro-interactions
- **Accessibility** - WCAG compliant with keyboard navigation support

### 📊 Data Visualization
- **Interactive Charts** - Price charts with sparklines and trend indicators
- **Market Statistics** - Real-time market cap, volume, and performance metrics
- **Portfolio Analytics** - Asset allocation, risk assessment, and performance tracking

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Charts**: Recharts
- **State Management**: React Context + useReducer
- **Data Sources**: CoinGecko API, Alpha Vantage API
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- API keys for CoinGecko and Alpha Vantage

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/lisan-5/cryptovault.git
   cd cryptovault
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   \`\`\`env
   # CoinGecko API Key (get from https://coingecko.com/en/api)
   COINGECKO_API_KEY=your_coingecko_api_key_here
   
   # Alpha Vantage API Key (get from https://www.alphavantage.co/support/#api-key)
   ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

\`\`\`
cryptovault/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── analytics/         # Analytics page
│   ├── asset/[id]/        # Individual asset pages
│   ├── markets/           # Markets page
│   ├── portfolio/         # Portfolio page
│   ├── settings/          # Settings page
│   ├── watchlist/         # Watchlist page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Dashboard page
├── components/            # React components
│   ├── ui/               # UI primitives
│   ├── asset-card.tsx    # Asset display component
│   ├── sidebar.tsx       # Navigation sidebar
│   └── ...               # Other components
├── lib/                  # Utility functions
└── public/              # Static assets
\`\`\`

## 🔧 Configuration

### API Keys Setup

1. **CoinGecko API**: 
   - Sign up at [CoinGecko](https://coingecko.com/en/api)
   - Get your free API key
   - Add to `.env.local` as `COINGECKO_API_KEY`

2. **Alpha Vantage API**:
   - Sign up at [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
   - Get your free API key
   - Add to `.env.local` as `ALPHA_VANTAGE_API_KEY`

### Theme Customization

The app supports three themes that can be customized in `app/globals.css`:

- **Light Theme**: Clean, professional appearance
- **Dark Theme**: Modern dark interface
- **Neon Theme**: Vibrant, futuristic design with glowing effects

## 📱 Features Overview

### Dashboard
- Portfolio summary with P&L calculations
- Market overview with top gainers/losers
- Quick stats and performance metrics
- Top assets by category

### Markets
- Real-time price data for 50+ cryptocurrencies and 10+ stocks
- Advanced filtering by category, type, and performance
- Search functionality with instant results
- Sortable by market cap, price, and 24h change

### Portfolio
- Add/remove assets with purchase price tracking
- Real-time profit/loss calculations
- Portfolio allocation visualization
- Performance analytics

### Watchlist
- Track favorite assets
- Performance comparison
- Quick add/remove functionality
- Category-based organization

### Analytics
- Market analysis with category distribution
- Risk metrics and volatility analysis
- Portfolio performance tracking
- Correlation analysis

## 🎨 Customization

### Adding New Themes

1. Define CSS variables in `app/globals.css`
2. Add theme option in `components/theme-provider.tsx`
3. Update theme toggle in `components/theme-toggle.tsx`

### Adding New Data Sources

1. Create API route in `app/api/`
2. Update data fetching in `components/dashboard-provider.tsx`
3. Add new asset types to the Asset interface

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms

The app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [CoinGecko](https://coingecko.com) for cryptocurrency data
- [Alpha Vantage](https://alphavantage.co) for stock market data
- [Radix UI](https://radix-ui.com) for accessible UI primitives
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Lucide](https://lucide.dev) for beautiful icons

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/lisan-5/cryptovault/issues) page
2. Create a new issue if your problem isn't already reported
3. Contact me on [GitHub](https://github.com/lisan-5)

---


⭐ Star this repo if you find it helpful!
