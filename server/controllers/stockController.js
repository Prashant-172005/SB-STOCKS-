const fetch = require("node-fetch");

const POLYGON_BASE = "https://api.polygon.io";
const API_KEY = process.env.POLYGON_API_KEY;

// Helper: fetch with error handling
const polygonFetch = async (url) => {
  const res = await fetch(`${url}&apiKey=${API_KEY}`);
  if (!res.ok) throw new Error(`Polygon API error: ${res.status}`);
  return res.json();
};

// @desc    Search stocks by keyword
// @route   GET /api/stocks/search?query=AAPL
// @access  Private
const searchStocks = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ success: false, message: "Query required" });

    const data = await polygonFetch(
      `${POLYGON_BASE}/v3/reference/tickers?search=${query}&active=true&market=stocks&limit=20`
    );

    res.json({
      success: true,
      data: data.results || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get stock quote (latest price)
// @route   GET /api/stocks/quote/:symbol
// @access  Private
const getStockQuote = async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await polygonFetch(
      `${POLYGON_BASE}/v2/last/trade/${symbol.toUpperCase()}?`
    );

    res.json({ success: true, data: data.results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get stock OHLC chart data
// @route   GET /api/stocks/chart/:symbol?from=2024-01-01&to=2024-12-31&timespan=day
// @access  Private
const getStockChart = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { from, to, timespan = "day", multiplier = 1 } = req.query;

    // Default: last 30 days
    const toDate = to || new Date().toISOString().split("T")[0];
    const fromDate = from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const data = await polygonFetch(
      `${POLYGON_BASE}/v2/aggs/ticker/${symbol.toUpperCase()}/range/${multiplier}/${timespan}/${fromDate}/${toDate}?adjusted=true&sort=asc`
    );

    res.json({ success: true, data: data.results || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get trending / top gainers (snapshot)
// @route   GET /api/stocks/trending
// @access  Private
const getTrending = async (req, res) => {
  try {
    const symbols = ["AAPL", "TSLA", "NVDA", "MSFT", "AMZN", "GOOGL", "META"];
    const data = await polygonFetch(
      `${POLYGON_BASE}/v2/snapshot/locale/us/markets/stocks/tickers?tickers=${symbols.join(",")}`
    );

    res.json({ success: true, data: data.tickers || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get stock details
// @route   GET /api/stocks/details/:symbol
// @access  Private
const getStockDetails = async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await polygonFetch(
      `${POLYGON_BASE}/v3/reference/tickers/${symbol.toUpperCase()}?`
    );
    res.json({ success: true, data: data.results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { searchStocks, getStockQuote, getStockChart, getTrending, getStockDetails };
