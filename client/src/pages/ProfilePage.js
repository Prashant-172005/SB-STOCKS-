import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getTransactions, depositFunds, withdrawFunds } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, updateBalance } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [modal, setModal] = useState(null);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("Net Banking");

  useEffect(() => {
    getTransactions()
      .then(({ data }) => { if (data.success) setTransactions(data.data); })
      .catch(() => {});
  }, []);

  const handleFund = async () => {
    if (!amount || parseFloat(amount) <= 0) return toast.error("Enter a valid amount");
    try {
      const fn = modal === "deposit" ? depositFunds : withdrawFunds;
      const { data } = await fn({ amount: parseFloat(amount), paymentMode: mode });
      if (data.success) {
        updateBalance(data.data.newBalance);
        setTransactions(prev => [data.data.transaction, ...prev]);
        toast.success(data.message);
        setModal(null);
        setAmount("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Transaction failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">👤 My Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-3xl font-bold text-black mb-4">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <h3 className="text-xl font-bold text-white">{user?.username}</h3>
            <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
            <div className="mt-4 w-full bg-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-1">Trading Balance</p>
              <p className="text-2xl font-bold text-green-400">${user?.balance?.toFixed(2)}</p>
            </div>
            <div className="flex gap-3 mt-4 w-full">
              <button
                onClick={() => setModal("deposit")}
                className="flex-1 py-2 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg transition text-sm">
                + Add Funds
              </button>
              <button
                onClick={() => setModal("withdraw")}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition text-sm">
                Withdraw
              </button>
            </div>
          </div>

          {/* Transactions */}
          <div className="md:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Transaction History</h3>
            {transactions.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <div className="text-4xl mb-2">📋</div>
                <p>No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {transactions.map((tx, i) => {
                  const isDeposit = tx.type === "Deposit";
                  return (
                    <div key={i} className="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg
                          ${isDeposit ? "bg-green-500/20" : "bg-red-500/20"}`}>
                          {isDeposit ? "⬇️" : "⬆️"}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{tx.type}</p>
                          <p className="text-gray-400 text-xs">{new Date(tx.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-sm ${isDeposit ? "text-green-400" : "text-red-400"}`}>
                          {isDeposit ? "+" : "-"}${tx.amount}
                        </p>
                        <p className="text-gray-500 text-xs">{tx.paymentMode}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold text-white mb-5">
              {modal === "deposit" ? "➕ Add Funds" : "➖ Withdraw Funds"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Amount ($)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Payment Mode</label>
                <select
                  value={mode}
                  onChange={e => setMode(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition">
                  {["Net Banking","IMPS","UPI","NEFT","Card"].map(m => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleFund}
                  className="flex-1 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg transition">
                  Confirm
                </button>
                <button onClick={() => setModal(null)}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
