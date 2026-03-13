import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getOrderHistory } from "../utils/api";

export default function HistoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrderHistory()
      .then(({ data }) => { if (data.success) setOrders(data.data); })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">📋 My Orders</h2>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          {orders.length === 0 ? (
            <div className="text-center py-14 text-gray-500">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-lg">No orders yet. Start trading!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-800 text-left">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Stock</th>
                    <th className="py-3 px-3">Symbol</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Product</th>
                    <th className="py-3 px-3">Shares</th>
                    <th className="py-3 px-3">Price</th>
                    <th className="py-3 px-3">Total</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => {
                    const isBuy = o.orderType?.toLowerCase() === "buy";
                    return (
                      <tr key={i} className="border-b border-gray-800 hover:bg-gray-800 transition">
                        <td className="py-3 px-3 text-gray-400 text-xs">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3 font-medium text-white">{o.stockName}</td>
                        <td className="py-3 px-3 font-mono text-green-400 font-bold">{o.stockSymbol}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold
                            ${isBuy ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                            {o.orderType?.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-400 text-xs">{o.productType}</td>
                        <td className="py-3 px-3 font-mono text-white">{o.quantity}</td>
                        <td className="py-3 px-3 font-mono text-white">${o.pricePerShare?.toFixed(2)}</td>
                        <td className="py-3 px-3 font-mono font-bold text-white">${o.totalAmount?.toFixed(2)}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-1 rounded text-xs font-bold bg-blue-500/20 text-blue-400">
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}