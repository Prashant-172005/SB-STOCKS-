import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("sbUser") || "null"));
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    const { data } = await loginUser({ email, password });
    setLoading(false);
    if (data.success) {
      localStorage.setItem("sbUser", JSON.stringify(data.data));
      setUser(data.data);
    }
    return data;
  };

  const register = async (formData) => {
    setLoading(true);
    const { data } = await registerUser(formData);
    setLoading(false);
    if (data.success) {
      localStorage.setItem("sbUser", JSON.stringify(data.data));
      setUser(data.data);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem("sbUser");
    setUser(null);
  };

  const updateBalance = (newBalance) => {
    const updated = { ...user, balance: newBalance };
    localStorage.setItem("sbUser", JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateBalance, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
