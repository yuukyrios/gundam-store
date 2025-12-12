import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // --------------------------------------------------
  // LOAD TOKEN + USER FROM LOCALSTORAGE SAFELY
  // --------------------------------------------------
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Invalid user JSON, clearing storage...");
        localStorage.removeItem("user");
      }
    }
  }, []);

  // --------------------------------------------------
  // LOGIN FUNCTION
  // --------------------------------------------------
  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);

      const newToken = response.token;
      const userData: User = response.user;  // MUST exist from backend

      // Save token + user
      setToken(newToken);
      setUser(userData);

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      toast({
        title: "Login successful!",
        description: `Welcome back, ${userData.username}!`,
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    }
  };

  // --------------------------------------------------
  // REGISTER FUNCTION
  // --------------------------------------------------
  const register = async (username: string, email: string, password: string) => {
    try {
      await authAPI.register(username, email, password);
      toast({
        title: "Registration successful!",
        description: "Please login to continue",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "Unable to register",
        variant: "destructive",
      });
      throw error;
    }
  };

  // --------------------------------------------------
  // LOGOUT FUNCTION
  // --------------------------------------------------
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// --------------------------------------------------
// HOOK
// --------------------------------------------------
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
