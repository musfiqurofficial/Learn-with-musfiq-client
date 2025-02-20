"use client";
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export const ProtectedRoute = ({ children, roles }: { children: React.ReactNode; roles: string[] }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || !roles.includes(user.role)) {
      router.push('/auth/login');
    }
  }, [user, roles, router]);

  return <>{user && roles.includes(user.role) ? children : null}</>;
};