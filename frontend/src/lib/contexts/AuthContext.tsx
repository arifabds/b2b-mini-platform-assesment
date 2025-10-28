import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../../types';

interface AuthContextType {
    user: User | null;        
    token: string | null;  
    isAuthenticated: boolean; 
    login: (user: User, token: string) => void; 
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

//Wrapper-Provider
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const login = (userData: User, userToken: string) => {
        setUser(userData);
        setToken(userToken);
        // TODO: Save token to localstorage
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        // TODO: Delete token from localstorage
    };

    const value = {
        user,
        token,
        isAuthenticated: !!user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

//Custom useAuth hook
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}