"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    const checkTokenAndRedirect = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      if (!token) {
        router.replace("/auth");
        return;
      }
      try {
        const response = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          router.replace("/dashboard");
        } else {
          router.replace("/auth");
        }
      } catch {
        router.replace("/auth");
      }
    };
    checkTokenAndRedirect();
  }, [router]);

  // Always show loading spinner while redirecting
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400 mb-6"></div>
      <div className="text-white text-lg font-semibold">Chargement...</div>
    </div>
  );
}