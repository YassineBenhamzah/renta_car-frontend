import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api/axios";

const AuthContext = createContext({
    user: null,
    token: null,
    login: (token, user) => { },
    register: (data) => { },
    logout: () => { },
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));

    // 1. Login Function
    const login = (newToken, newUser) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
    };

    // 1.5 Register Function
    const register = async (data) => {
        try {
            const response = await axiosClient.post("/register", data);
            const { user, token } = response.data;
            login(token, user); // Auto-login after register
            return true;
        } catch (e) {
            console.error(e);
            throw e; // Let component handle error
        }
    };

    // 2. Logout Function
    const logout = async () => {
        try {
            await axiosClient.post("/logout"); // Tell backend to destroy token
        } catch (e) {
            console.error(e);
        }
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    // 3. Check if user is already logged in (on refresh)
    useEffect(() => {
        // If we have a token but no user data (e.g. after refresh), try to fetch user
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Optional: Verify token with backend
        if (token) {
            axiosClient.get('/user').then(({ data }) => {
                setUser(data);
                localStorage.setItem("user", JSON.stringify(data));
            }).catch(() => {
                // effective logout if token is invalid
                logout();
            })
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);