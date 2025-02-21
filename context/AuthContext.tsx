"use client";

import { redirect } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "react-toastify";

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

  useEffect(() => {
    const fetchUser = async () => {
      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          try {
            const response = await fetch("/api/auth/me", {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
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
        } else {
          console.log(false);
        }
      }
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
    setUser(null);
    setToken(null);
    toast.error("Logout");
    redirect("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
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
