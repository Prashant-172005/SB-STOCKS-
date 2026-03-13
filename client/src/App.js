import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, AdminRoute, PublicRoute } from "./components/ProtectedRoute";

// Pages
import LandingPage    from "./pages/LandingPage";
import LoginPage      from "./pages/LoginPage";
import RegisterPage   from "./pages/RegisterPage";
import HomePage       from "./pages/HomePage";
import ChartPage      from "./pages/ChartPage";
import PortfolioPage  from "./pages/PortfolioPage";
import HistoryPage    from "./pages/HistoryPage";
import ProfilePage    from "./pages/ProfilePage";
import AdminUsers     from "./pages/admin/AdminUsers";
import AdminOrders    from "./pages/admin/AdminOrders";
import AdminTx        from "./pages/admin/AdminTx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="bottom-right" toastOptions={{ style: { background: "#111827", color: "#F0F4FF", border: "1px solid rgba(255,255,255,0.07)" } }} />
        <Routes>
          {/* Public */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login"   element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register"element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* User Protected */}
          <Route path="/"         element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/chart/:symbol" element={<ProtectedRoute><ChartPage /></ProtectedRoute>} />
          <Route path="/portfolio"element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
          <Route path="/history"  element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="/profile"  element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Admin Protected */}
          <Route path="/admin/users"        element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/orders"       element={<AdminRoute><AdminOrders /></AdminRoute>} />
          <Route path="/admin/transactions" element={<AdminRoute><AdminTx /></AdminRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
