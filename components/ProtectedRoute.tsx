"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user && pathname !== "/") {
      router.push("/login");
    }
  }, [user, router, pathname]);

  if (!user && pathname !== "/") return null;

  if (user && !roles.includes(user.role)) {
    return <p className="text-center text-red-500">Access Denied</p>;
  }

  return <>{children}</>;
};
