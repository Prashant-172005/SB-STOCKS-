// AdminUsers.js
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { adminGetUsers, adminGetStats, adminDeleteUser } from "../../utils/api";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    adminGetUsers().then(({ data }) => { if (data.success) setUsers(data.data); }).catch(() => {});
    adminGetStats().then(({ data }) => { if (data.success) setStats(data.data); }).catch(() => {});
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user ${name}? This cannot be undone.`)) return;
    try {
      await adminDeleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success("User deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page">
        <div className="dash-main">
          <div className="section-header"><h2 className="section-title">Platform Overview</h2></div>
          <div className="admin-grid">
            <div className="admin-stat"><div style={{ color: "var(--muted)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Users</div><div className="as-val as-blue">{stats.totalUsers || 0}</div></div>
            <div className="admin-stat"><div style={{ color: "var(--muted)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Orders</div><div className="as-val as-green">{stats.totalOrders || 0}</div></div>
            <div className="admin-stat"><div style={{ color: "var(--muted)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Platform Volume</div><div className="as-val as-gold">${(stats.totalVolume || 0).toFixed(0)}</div></div>
            <div className="admin-stat"><div style={{ color: "var(--muted)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Transactions</div><div className="as-val" style={{ color: "var(--accent)" }}>{stats.totalTransactions || 0}</div></div>
          </div>

          <div className="users-table-container">
            <div className="panel-title">All Users</div>
            {users.map((u, i) => (
              <div className="user-row" key={i}>
                <div className="user-info">
                  <div className="user-av">{u.username[0].toUpperCase()}</div>
                  <div>
                    <div className="user-name">{u.username}</div>
                    <div className="user-id">{u._id}</div>
                  </div>
                </div>
                <div className="user-email">{u.email}</div>
                <div className="user-bal">${u.balance?.toFixed(2)}</div>
                <button onClick={() => handleDelete(u._id, u.username)}
                  style={{ padding: "0.3rem 0.75rem", borderRadius: "6px", background: "rgba(255,77,106,0.1)", border: "1px solid rgba(255,77,106,0.3)", color: "var(--red)", cursor: "pointer", fontSize: "0.78rem" }}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
