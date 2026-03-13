import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getPortfolio } from "../utils/api";

export function PortfolioPage() {
  const [holdings, setHoldings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getPortfolio()
      .then(({ data }) => { if (data.success) setHoldings(data.data); })
      .catch(() => {});
  }, []);

  const totalInvested = holdings.reduce((s, h) => s + h.totalInvested, 0);
  const totalValue    = holdings.reduce((s, h) => s + h.quantity * h.averageBuyPrice, 0);
  const pnl           = totalValue - totalInvested;
  const pnlUp         = pnl >= 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">

        <h2 className="text-2xl font-bold text-white mb-6">💼 My Portfolio</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm mb-1">Total Value</p>
            <p className="text-2xl font-bold text-white">${totalValue.toFixed(2)}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm mb-1">Total Invested</p>
            <p className="text-2xl font-bold text-white">${totalInvested.toFixed(2)}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm mb-1">Unrealized P&L</p>
            <p className={`text-2xl font-bold ${pnlUp ? "text-green-400" : "text-red-400"}`}>
              {pnlUp ? "+" : ""}${pnl.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Holdings</h3>

          {holdings.length === 0 ? (
            <div className="text-center py-14 text-gray-500">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-lg">No holdings yet. Buy some stocks!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-800 text-left">
                    <th className="py-3 px-3">Exchange</th>
                    <th className="py-3 px-3">Stock Name</th>
                    <th className="py-3 px-3">Symbol</th>
                    <th className="py-3 px-3">Shares</th>
                    <th className="py-3 px-3">Avg. Price</th>
                    <th className="py-3 px-3">Total Invested</th>
                    <th className="py-3 px-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((h, i) => (
                    <tr key={i} className="border-b border-gray-800 hover:bg-gray-800 transition">
                      <td className="py-3 px-3">
                        <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                          {h.exchange}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-white">{h.stockName}</td>
                      <td className="py-3 px-3 font-mono text-green-400 font-bold">{h.stockSymbol}</td>
                      <td className="py-3 px-3 font-mono text-white">{h.quantity}</td>
                      <td className="py-3 px-3 font-mono text-white">${h.averageBuyPrice.toFixed(2)}</td>
                      <td className="py-3 px-3 font-mono text-green-400 font-semibold">
                        ${h.totalInvested.toFixed(2)}
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => navigate(`/chart/${h.stockSymbol}`)}
                          className="px-3 py-1 bg-green-500 hover:bg-green-400 text-black text-xs font-bold rounded transition">
                          View Chart
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PortfolioPage;
