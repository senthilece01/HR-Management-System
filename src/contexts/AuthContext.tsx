import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  register: async () => false,
});

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for stored user data on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Convert date strings back to Date objects
        if (userData.joiningDate) {
          userData.joiningDate = new Date(userData.joiningDate);
        }
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse stored user data', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Mock login function - would connect to MongoDB in production
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, we'd validate credentials against MongoDB
      // For now, we'll use mock data
      const mockUsers: { [key: string]: { user: User; password: string } } = {
        'employee@gmail.com': {
          user: {
            id: '1',
            name: 'John Employee',
            email: 'employee@gmail.com',
            role: 'employee' as UserRole,
            department: 'Engineering',
            managerId: '2',
            joiningDate: new Date(2023, 0, 15),
            employeeType: 'full-time',
          },
          password: 'password123',
        },
        'manager@gmail.com': {
          user: {
            id: '2',
            name: 'Sarah Manager',
            email: 'manager@gmail.com',
            role: 'manager' as UserRole,
            department: 'Engineering',
            joiningDate: new Date(2022, 5, 10),
            employeeType: 'full-time',
          },
          password: 'password123',
        },
        'admin@gmail.com': {
          user: {
            id: '3',
            name: 'Admin User',
            email: 'admin@gmail.com',
            role: 'admin' as UserRole,
            department: 'Administration',
            joiningDate: new Date(2021, 2, 5),
            employeeType: 'full-time',
          },
          password: 'password123',
        },
        'intern@gmail.com': {
          user: {
            id: '4',
            name: 'Intern User',
            email: 'intern@gmail.com',
            role: 'employee' as UserRole,
            department: 'Engineering',
            managerId: '2',
            joiningDate: new Date(2023, 9, 1),
            employeeType: 'intern',
          },
          password: 'password123',
        },
      };

      // Check if user exists and password matches
      if (mockUsers[email] && mockUsers[email].password === password) {
        const userData = mockUsers[email].user;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    // In a real app, we would send this data to MongoDB
    // For now, we'll just simulate a successful registration
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}