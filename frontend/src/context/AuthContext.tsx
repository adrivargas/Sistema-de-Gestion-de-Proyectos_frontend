import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => setUser(res.data))
        .catch(() => logout());
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await axios.post("/auth/login", { email, password });
    const token = res.data.access_token;
    localStorage.setItem("token", token);
    setToken(token);

    // Cargar el usuario inmediatamente después del login
    const userRes = await axios.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(userRes.data);

    navigate("/dashboard");
  };

  const register = async (data: any) => {
    const res = await axios.post("/auth/register", data);
    const token = res.data.access_token;
    localStorage.setItem("token", token);
    setToken(token);
    const userRes = await axios.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(userRes.data);

    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};
