import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getStockChart, getStockQuote, buyStock, sellStock } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const INTERVALS = [
  { label: "1D", timespan: "minute", multiplier: 5, days: 1 },
  { label: "1W", timespan: "day",    multiplier: 1, days: 7 },
  { label: "1M", timespan: "day",    multiplier: 1, days: 30 },
  { label: "3M", timespan: "week",   multiplier: 1, days: 90 },
  { label: "1Y", timespan: "month",  multiplier: 1, days: 365 },
];

function SVGChart({ data, color = "#00D4AA" }) {
  if (!data.length) return null;
  const w = 600, h = 200;
  const prices = data.map(d => d.c);
  const max = Math.max(...prices), min = Math.min(...prices);
  const range = max - min || 1;
  const pts = prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * w;
    const y = h - ((p - min) / range) * (h - 20) - 10;
    return `${x},${y}`;
  });
  const path = `M ${pts.join(" L ")}`;
  const area = `M ${pts[0]} L ${pts.join(" L ")} L ${w},${h} L 0,${h} Z`;
  return (
    <svg style={{ width: "100%", height: "220px" }} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#cg)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}

export default function ChartPage() {
  const { symbol } = useParams();
  const { user, updateBalance } = useAuth();
  const navigate = useNavigate();

  const [chartData, setChartData] = useState([]);
  const [interval, setInterval] = useState(INTERVALS[0]);
  const [tab, setTab] = useState("buy");
  const [qty, setQty] = useState(1);
  const [productType, setProductType] = useState("Intraday");
  const [currentPrice, setCurrentPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadChart(); }, [symbol, interval]);

  const loadChart = async () => {
    try {
      const to = new Date().toISOString().split("T")[0];
      const from = new Date(Date.now() - interval.days * 86400000).toISOString().split("T")[0];
      const { data } = await getStockChart(symbol, { from, to, timespan: interval.timespan, multiplier: interval.multiplier });
      if (data.data?.length) {
        setChartData(data.data);
        setCurrentPrice(data.data[data.data.length - 1].c);
      }
    } catch {
      // Use mock data if API key not set
      const mock = Array.from({ length: 30 }, (_, i) => ({ c: 200 + Math.sin(i * 0.3) * 20 + Math.random() * 10 }));
      setChartData(mock);
      setCurrentPrice(mock[mock.length - 1].c);
    }
  };

  const handleOrder = async () => {
    if (!currentPrice) return toast.error("Price not loaded yet");
    setLoading(true);
    try {
      const payload = {
        stockSymbol: symbol,
        stockName: symbol,
        productType,
        quantity: parseInt(qty),
        pricePerShare: currentPrice,
      };
      const fn = tab === "buy" ? buyStock : sellStock;
      const { data } = await fn(payload);
      if (data.success) {
        updateBalance(data.data.newBalance);
        toast.success(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
    }
    setLoading(false);
  };

  const total = currentPrice ? (qty * currentPrice).toFixed(2) : "0.00";
  const lastClose = chartData.length > 1 ? chartData[chartData.length - 2].c : null;
  const change = currentPrice && lastClose ? (((currentPrice - lastClose) / lastClose) * 100).toFixed(2) : null;
  const isUp = change >= 0;

  return (
    <div>
      <Navbar />
      <div className="page">
        <div className="dash-main">
          <div className="chart-page-grid">
            <div>
              <div className="chart-header">
                <div className="chart-stock-info">
                  <h2>{symbol} <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>NASDAQ</span></h2>
                  <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Common Stock</p>
                </div>
                <div className="chart-price-info">
                  <div className="chart-price">${currentPrice?.toFixed(2) || "—"}</div>
                  {change && <div className={isUp ? "chart-change-up" : "chart-change-down"}>
                    {isUp ? "▲" : "▼"} {Math.abs(change)}%
                  </div>}
                </div>
              </div>
              <div className="chart-container">
                <div className="chart-intervals">
                  {INTERVALS.map(iv => (
                    <button key={iv.label} className={`interval-btn ${interval.label === iv.label ? "active" : ""}`}
                      onClick={() => setInterval(iv)}>{iv.label}</button>
                  ))}
                </div>
                <SVGChart data={chartData} color={isUp ? "#00D4AA" : "#FF4D6A"} />
              </div>
            </div>

            <div className="order-panel">
              <div className="order-tabs">
                <button className={`order-tab buy ${tab === "buy" ? "active" : ""}`} onClick={() => setTab("buy")}>BUY</button>
                <button className={`order-tab sell ${tab === "sell" ? "active" : ""}`} onClick={() => setTab("sell")}>SELL</button>
              </div>
              <div className="order-price-info">
                <div className="opi"><div className="opi-label">Buy @</div><div className="opi-val" style={{ color: "var(--green)" }}>${currentPrice?.toFixed(2) || "—"}</div></div>
                <div className="opi"><div className="opi-label">Sell @</div><div className="opi-val" style={{ color: "var(--red)" }}>${currentPrice ? (currentPrice - 0.20).toFixed(2) : "—"}</div></div>
              </div>
              <div className="form-group">
                <label className="form-label">Product Type</label>
                <select className="form-select" value={productType} onChange={e => setProductType(e.target.value)}>
                  <option>Intraday</option><option>Delivery</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input className="form-input" type="number" min="1" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} />
              </div>
              <div className="form-group">
                <label className="form-label">Available Balance</label>
                <input className="form-input" value={`$${user?.balance?.toFixed(2) || "0.00"}`} readOnly style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }} />
              </div>
              <div className="total-row">
                <span className="total-label">Total Price</span>
                <span className="total-val">${total}</span>
              </div>
              {tab === "buy"
                ? <button className="buy-btn-large" onClick={handleOrder} disabled={loading}>{loading ? "Processing..." : "Buy Now"}</button>
                : <button className="sell-btn-large" onClick={handleOrder} disabled={loading}>{loading ? "Processing..." : "Sell Now"}</button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
