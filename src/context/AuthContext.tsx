import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Guide, Role } from '../types';
import { MOCK_TOURISTS, MOCK_GUIDES } from '../data/mockData';

interface AuthContextType {
  user: User | Guide | null;
  login: (email: string, role: Role) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | Guide | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking local storage
    const storedUser = localStorage.getItem('tourmate_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, role: Role) => {
    setIsLoading(true);
    // Mock login logic
    setTimeout(() => {
      let foundUser: User | Guide | undefined;
      
      if (role === 'admin') {
        foundUser = {
          id: 'admin1',
          name: 'Admin User',
          email: 'admin@tourmate.com',
          role: 'admin',
          avatar: 'https://ui-avatars.com/api/?name=Admin+User'
        };
      } else if (role === 'guide') {
        foundUser = MOCK_GUIDES.find(g => g.email === email) || MOCK_GUIDES[0]; // Fallback for demo
      } else {
        foundUser = MOCK_TOURISTS.find(t => t.email === email) || MOCK_TOURISTS[0]; // Fallback for demo
      }

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('tourmate_user', JSON.stringify(foundUser));
      }
      setIsLoading(false);
    }, 800);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tourmate_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
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
