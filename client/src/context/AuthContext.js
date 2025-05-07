import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  axios.defaults.headers.common["Authorization"] = token
    ? `Bearer ${token}`
    : "";

  // Check if user is authenticated
  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
    if (token) {
      try {
        // Check token expiration
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          // Token expired
          logout();
        } else {
          // Token valid, get user info
          const res = await axios.get(`${API_URL}/users/me`);
          setUser(res.data);
          setIsAuthenticated(true);
          // Add daily login credit
          await axios.post(`${API_URL}/credits/daily-login`);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  }, [token, API_URL]);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { token } = res.data;

      localStorage.setItem("token", token);
      setToken(token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await checkAuthStatus();
      toast.success("Logged in successfully!");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return false;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      await axios.post(`${API_URL}/auth/register`, userData);
      toast.success("Registration successful! Please login.");
      return true;
    } catch (error) {
      console.error("Register error:", error);
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common["Authorization"];
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
