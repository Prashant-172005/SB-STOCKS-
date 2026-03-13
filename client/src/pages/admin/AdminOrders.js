// AdminOrders.js
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { adminGetOrders } from "../../utils/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    adminGetOrders().then(({ data }) => { if (data.success) setOrders(data.data); }).catch(() => {});
  }, []);

  return (
    <div>
      <Navbar />
      <div className="page">
        <div className="dash-main">
          <div className="section-header"><h2 className="section-title">All Orders</h2></div>
          <div className="portfolio-table-container">
            <table className="stock-table">
              <thead>
                <tr><th>User</th><th>Product</th><th>Stock</th><th>Symbol</th><th>Type</th><th>Shares</th><th>Price</th><th>Total</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={i}>
                    <td style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{o.userId?.username || "—"}</td>
                    <td style={{ fontSize: "0.78rem" }}>{o.productType}</td>
                    <td style={{ fontWeight: 500 }}>{o.stockName}</td>
                    <td style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{o.stockSymbol}</td>
                    <td><span className={`hi-type ${o.orderType}`}>{o.orderType.toUpperCase()}</span></td>
                    <td style={{ fontFamily: "var(--font-mono)" }}>{o.quantity}</td>
                    <td style={{ fontFamily: "var(--font-mono)" }}>${o.pricePerShare.toFixed(2)}</td>
                    <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>${o.totalAmount.toFixed(2)}</td>
                    <td><span className="status-badge status-completed">{o.status}</span></td>
                    <td style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
