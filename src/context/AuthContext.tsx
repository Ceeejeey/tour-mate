import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Guide, Role } from '../types';

interface AuthContextType {
  user: User | Guide | null;
  login: (email: string, role: Role, password?: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: any) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | Guide | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5066/api/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const userData = await response.json();
        const formattedUser = {
          ...userData,
          id: userData.id.toString(),
          role: userData.role.toLowerCase() as Role
        };
        setUser(formattedUser);
        localStorage.setItem('tourmate_user', JSON.stringify(formattedUser));
        return formattedUser;
      }
    } catch (e) {
      console.error("Failed to fetch profile", e);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('tourmate_token');
    if (token) {
      fetchProfile(token).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, role: Role, password?: string) => {
    setIsLoading(true);
    try {
      // Determine the endpoint based on the requested role
      const endpoint = role === 'admin' 
        ? 'http://localhost:5066/api/auth/admin-login' 
        : 'http://localhost:5066/api/auth/login';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password || 'defaultpassword' })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const data = await response.json();
      localStorage.setItem('tourmate_token', data.token);
      await fetchProfile(data.token);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: FormData) => {
    setIsLoading(true);
    try {
      const endpoint = data.get('role') === 'guide' 
        ? 'http://localhost:5066/api/auth/register/guide' 
        : 'http://localhost:5066/api/auth/register/tourist';

      const response = await fetch(endpoint, {
        method: 'POST',
        body: data
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tourmate_user');
    localStorage.removeItem('tourmate_token');
  };

  const updateUser = (userData: any) => {
    setUser(userData);
    localStorage.setItem('tourmate_user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
