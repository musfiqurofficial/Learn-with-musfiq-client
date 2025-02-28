"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  name: string;
  email: string;
  role: string;
  enrolledCourses: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          try {
            const response = await fetch("/api/auth/me", {
              headers: { Authorization: `Bearer ${storedToken}` },
            });

            if (response.ok) {
              const userData = await response.json();
              setUser(userData);
              setToken(storedToken);
            } else {
              localStorage.removeItem("token");
            }
          } catch (error) {
            console.error("Failed to fetch user:", error);
          }
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = (user: User, token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
    setUser(user);
    setToken(token);
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    window.location.href = "/auth/login";
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
