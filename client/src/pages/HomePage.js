import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { searchStocks, getTrending } from "../utils/api";
import toast from "react-hot-toast";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [stocks, setStocks] = useState([]);
  const [trending, setTrending] = useState([]);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { loadTrending(); }, []);

  const loadTrending = async () => {
    try {
      const { data } = await getTrending();
      if (data.success) setTrending(data.data.slice(0, 6));
    } catch {
      setTrending([
        { ticker: "AAPL", day: { c: 192.45, p: 190.20 } },
        { ticker: "TSLA", day: { c: 225.80, p: 228.10 } },
        { ticker: "NVDA", day: { c: 174.98, p: 169.30 } },
        { ticker: "MSFT", day: { c: 378.20, p: 376.90 } },
        { ticker: "AMZN", day: { c: 185.60, p: 181.90 } },
        { ticker: "GOOGL", day: { c: 165.40, p: 163.20 } },
      ]);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const { data } = await searchStocks(query);
      setStocks(data.data || []);
      if (!data.data?.length) toast("No stocks found for that query.");
    } catch {
      toast.error("Search failed. Check your API key.");
    } finally { setSearching(false); }
  };

  const pctChange = (curr, prev) =>
    prev ? (((curr - prev) / prev) * 100).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Trending Stocks */}
        <h2 className="text-xl font-bold text-white mb-4">🔥 Trending Stocks</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {trending.map((t, i) => {
            const change = pctChange(t.day?.c, t.day?.p);
            const up = !change.startsWith("-");
            return (
              <div key={i}
                onClick={() => navigate(`/chart/${t.ticker}`)}
                className="bg-gray-900 border border-gray-800 hover:border-green-500 rounded-xl p-4 cursor-pointer transition group">
                <div className="font-bold text-white text-lg group-hover:text-green-400 transition">{t.ticker}</div>
                <div className="text-gray-400 text-xs mb-2 truncate">{t.name?.slice(0, 20) || "—"}</div>
                <div className="text-white font-semibold">${t.day?.c?.toFixed(2) || "—"}</div>
                <div className={`text-sm font-medium ${up ? "text-green-400" : "text-red-400"}`}>
                  {up ? "▲" : "▼"} {change}%
                </div>
              </div>
            );
          })}
        </div>

        {/* Search / Watchlist */}
        <h2 className="text-xl font-bold text-white mb-4">🔍 Search Stocks</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-3 mb-6">
            <input
              className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition"
              placeholder="Enter stock symbol or name (e.g. AAPL)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit"
              className="px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg transition">
              {searching ? "..." : "Search"}
            </button>
          </form>

          {stocks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-800">
                    <th className="text-left py-3 px-2">Exchange</th>
                    <th className="text-left py-3 px-2">Stock Name</th>
                    <th className="text-left py-3 px-2">Symbol</th>
                    <th className="text-left py-3 px-2">Type</th>
                    <th className="text-left py-3 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((s, i) => (
                    <tr key={i} className="border-b border-gray-800 hover:bg-gray-800 transition">
                      <td className="py-3 px-2">
                        <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                          {s.primary_exchange?.replace("XNAS","NASDAQ").replace("XNYS","NYSE") || "—"}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-medium text-white">{s.name}</td>
                      <td className="py-3 px-2 font-mono text-green-400">{s.ticker}</td>
                      <td className="py-3 px-2 text-gray-400 text-xs uppercase">{s.type}</td>
                      <td className="py-3 px-2">
                        <button
                          onClick={() => navigate(`/chart/${s.ticker}`)}
                          className="px-3 py-1 bg-green-500 hover:bg-green-400 text-black text-xs font-bold rounded transition">
                          View Chart
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <div className="text-4xl mb-2">🔍</div>
              <p>Search for stocks to add to your watchlist</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
