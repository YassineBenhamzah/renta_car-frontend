import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./views/Login";
import Signup from "./views/Signup";
import Dashboard from "./views/Dashboard";
import Home from "./views/Home";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import PublicLayout from "./components/PublicLayout";
import Cars from "./views/Cars";
import Rentals from "./views/Rentals";
import Users from "./views/Users";
import AgentRentalForm from "./views/agent/AgentRentalForm";
import RentalCalendar from "./views/admin/RentalCalendar";

const router = createBrowserRouter([
    // 1. PUBLIC ROUTES (Home, etc.) - Priority
    {
        path: "/",
        element: <PublicLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            // Add other public routes like /cars later
        ]
    },

    // 2. PROTECTED ROUTES (Dashboard)
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/dashboard",
                element: <Dashboard />,
            },
            {
                path: "/cars",
                element: <Cars />,
            },
            {
                path: "/rentals",
                element: <Rentals />,
            },
            {
                path: "/users",
                element: <Users />,
            },
            {
                path: "/agent/booking",
                element: <AgentRentalForm />,
            },
            {
                path: "/admin/calendar",
                element: <RentalCalendar />,
            },
            // Add other protected routes here
        ],
    },

    // 3. GUEST ROUTES (Login/Signup)
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <Signup />,
            },
        ],
    },
]);

export default router;