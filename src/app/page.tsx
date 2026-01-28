"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import LandingPage from "./landing/page";

export default function RootPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTokenAndRedirect = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
          router.replace("/dashboard");
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkTokenAndRedirect();
  }, [router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400 mb-6"></div>
        <div className="text-white text-lg font-semibold">Chargement...</div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  if (isAuthenticated === false) {
    return <LandingPage />;
  }

  // This component will unmount when authenticated users are redirected
  return null;
}