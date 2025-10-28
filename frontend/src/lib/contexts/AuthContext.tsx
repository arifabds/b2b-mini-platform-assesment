import { createContext, useContext, useState } from 'react';
import type {ReactNode } from 'react';

import type { User } from '../../types';

interface AuthContextType {
    user: User | null;        
    token: string | null;  
    isAuthenticated: boolean; 
    login: (user: User, token: string) => void; 
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('authUser');
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            return null;
        }
    });

    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('authToken');
    });

    const login = (userData: User, userToken: string) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('authUser', JSON.stringify(userData));
        localStorage.setItem('authToken', userToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('authUser');
        localStorage.removeItem('authToken');
    };

    const value = {
        user,
        token,
        isAuthenticated: !!user && !!token,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}