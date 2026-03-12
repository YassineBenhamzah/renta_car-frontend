import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GuestLayout() {
  const { token } = useAuth();
  // If user is already logged in, go to Dashboard
  if (token) {
    return <Navigate to="/" />;
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 bg-white p-6 shadow-md rounded-md">
        <Outlet />
      </div>
    </div>
  );
}