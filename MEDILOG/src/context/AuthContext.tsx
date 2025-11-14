// File: context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

// ✅ 1. Ginamit na natin ang 'import type'
//    gaya ng suggestion ng TypeScript linter mo.
import type { User, AuthResponse } from "../services/api";

// ✅ 2. I-update ang ContextType para gamitin ang imported types
export interface AuthContextType {
  user: User | null;
  login: (authData: AuthResponse) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  // ✅ 3. I-update ang useEffect
  //    Titingnan nito pareho ang user at token on load
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    const storedToken = localStorage.getItem("authToken");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ 4. I-update ang login function
  //    Ise-save na nito pareho ang user at token
  const login = (authData: AuthResponse) => {
    const { user, token } = authData;
    setUser(user);
    localStorage.setItem("authUser", JSON.stringify(user));
    localStorage.setItem("authToken", token);
  };

  // ✅ 5. I-update ang logout function
  //    Buburahin na nito pareho
  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ 6. (Walang binago dito)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
