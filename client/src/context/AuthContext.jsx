import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true); // true while we check a saved token

  // On page load: if a token is saved, ask the server who we are
  useEffect(() => {
    const restore = async () => {
      if (!token) return setLoading(false);
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch {
        localStorage.removeItem("token");
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSession = ({ user, token }) => {
    localStorage.setItem("token", token);
    setToken(token);
    setUser(user);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    saveSession(data);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    saveSession(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
