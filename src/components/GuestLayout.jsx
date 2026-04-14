import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GuestLayout() {
  const { token } = useAuth();
  if (token) return <Navigate to="/" />;

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(ellipse at 20% 50%, rgba(37,99,235,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.10) 0%, transparent 60%), #f1f5f9",
      }}
    >
      <Outlet />
    </div>
  );
}