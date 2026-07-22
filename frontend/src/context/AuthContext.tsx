import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface JwtPayload {
  id: string;
  role: 'user' | 'admin';
  exp: number;
  iat: number;
}

interface AuthContextType {
  token: string | null;
  user: JwtPayload | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Decode JWT payload without verification (verification happens on backend)
function decodeJwt(token: string): JwtPayload | null {
  try {
    const base64Payload = token.split('.')[1];
    const jsonPayload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(jsonPayload) as JwtPayload;
    // Check expiry
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<JwtPayload | null>(() => {
    const t = localStorage.getItem('token');
    return t ? decodeJwt(t) : null;
  });

  const login = useCallback((newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(decodeJwt(newToken));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  // Auto-logout when token expires
  useEffect(() => {
    if (!token) return;
    const payload = decodeJwt(token);
    if (!payload) {
      logout();
      return;
    }
    const msUntilExpiry = payload.exp * 1000 - Date.now();
    if (msUntilExpiry <= 0) {
      logout();
      return;
    }
    const timer = setTimeout(logout, msUntilExpiry);
    return () => clearTimeout(timer);
  }, [token, logout]);

  const value: AuthContextType = {
    token,
    user,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
