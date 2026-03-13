import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { adminGetTransactions } from "../../utils/api";

export default function AdminTx() {
  const [txs, setTxs] = useState([]);
  useEffect(() => {
    adminGetTransactions().then(({ data }) => { if (data.success) setTxs(data.data); }).catch(() => {});
  }, []);

  return (
    <div>
      <Navbar />
      <div className="page">
        <div className="dash-main">
          <div className="section-header"><h2 className="section-title">All Transactions</h2></div>
          <div className="transactions-panel">
            <div className="panel-title">Platform Transactions</div>
            {txs.length === 0
              ? <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>No transactions yet</div>
              : txs.map((tx, i) => (
                <div className="tx-item" key={i}>
                  <div className="tx-left">
                    <div className={`tx-icon ${tx.type === "Deposit" ? "deposit" : "withdraw"}`}>
                      {tx.type === "Deposit" ? "⬇️" : "⬆️"}
                    </div>
                    <div>
                      <div className="tx-type">{tx.userId?.username || "User"}</div>
                      <div className="tx-date">{new Date(tx.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className={`tx-amount ${tx.type === "Deposit" ? "deposit" : "withdraw"}`}>
                      {tx.type === "Deposit" ? "+" : "-"}${tx.amount}
                    </div>
                    <div className="tx-mode">{tx.type} · {tx.paymentMode}</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
