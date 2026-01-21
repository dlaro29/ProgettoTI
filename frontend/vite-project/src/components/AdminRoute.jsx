import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";

//componente per proteggere le rotte admin
export default function AdminRoute() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = await apiFetch("/auth/me");
        setIsAdmin(user.role === "admin");
      } catch {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) return null;

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
