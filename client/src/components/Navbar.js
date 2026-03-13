import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isActive = (path) =>
    pathname === path
      ? "text-green-400 font-semibold"
      : "text-gray-400 hover:text-white transition";

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <Link
        to={user ? (isAdmin ? "/admin/users" : "/") : "/landing"}
        className="flex items-center gap-2 text-xl font-bold text-white hover:text-green-400 transition">
        📈 <span>SB</span>
        <span className="text-green-400">Stocks</span>
        {isAdmin && (
          <span className="ml-2 text-xs bg-green-500 text-black px-2 py-0.5 rounded-full font-bold">
            Admin
          </span>
        )}
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-6 text-sm">
        {user ? (
          isAdmin ? (
            <>
              <Link className={isActive("/admin/users")}     to="/admin/users">Users</Link>
              <Link className={isActive("/admin/orders")}    to="/admin/orders">Orders</Link>
              <Link className={isActive("/admin/transactions")} to="/admin/transactions">Transactions</Link>
            </>
          ) : (
            <>
              <Link className={isActive("/")}          to="/">Home</Link>
              <Link className={isActive("/portfolio")} to="/portfolio">Portfolio</Link>
              <Link className={isActive("/history")}   to="/history">History</Link>
              <Link className={isActive("/profile")}   to="/profile">Profile</Link>
            </>
          )
        ) : (
          <>
            <Link className={isActive("/landing")} to="/landing">Home</Link>
            <Link className={isActive("/landing#about")} to="/landing">About</Link>
          </>
        )}
      </div>

      {/* Right Buttons */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-gray-400 text-sm hidden md:block">
              💰 <span className="text-green-400 font-semibold">${user?.balance?.toFixed(2)}</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition">
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-gray-300 hover:text-white text-sm transition">
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black text-sm font-bold rounded-lg transition">
              Join now
            </button>
          </>
        )}
      </div>
    </nav>
  );
}