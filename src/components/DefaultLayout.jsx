import { Link, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

export default function DefaultLayout() {
    const { user, token, logout } = useAuth();

    if (!token) return <Navigate to="/login" />;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <nav className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="text-2xl font-bold text-blue-600">RentACar</Link>

                        {/* ROLE BASED LINKS */}
                        <div className="hidden md:flex space-x-4">
                            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link>

                            {/* ADMIN LINKS */}
                            {user?.role === 'admin' && (
                                <>
                                    <Link to="/cars" className="text-gray-700 hover:text-blue-600">Cars</Link>
                                    <Link to="/users" className="text-gray-700 hover:text-blue-600">Users</Link>
                                    <Link to="/rentals" className="text-gray-700 hover:text-blue-600">Rentals</Link>
                                    <Link to="/admin/calendar" className="text-gray-700 hover:text-blue-600">Calendar</Link>
                                </>
                            )}

                            {/* AGENT LINKS */}
                            {user?.role === 'agent' && (
                                <>
                                    <Link to="/cars" className="text-gray-700 hover:text-blue-600">Cars</Link>
                                    <Link to="/rentals" className="text-gray-700 hover:text-blue-600">Requests</Link>
                                </>
                            )}

                            {/* USER LINKS */}
                            {user?.role === 'user' && (
                                <Link to="/my-rentals" className="text-gray-700 hover:text-blue-600">My Requests</Link>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <NotificationBell />
                        <span className="text-sm text-gray-500">{user?.name} ({user?.role})</span>
                        <button onClick={logout} className="text-red-500 hover:text-red-700 p-2">Logout</button>
                    </div>
                </div>
            </nav>

            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
}