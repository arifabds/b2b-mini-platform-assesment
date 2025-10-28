import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';


type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem('theme');
        return (storedTheme === 'light' || storedTheme === 'dark') ? storedTheme : 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;

        const oldTheme = theme === 'light' ? 'dark' : 'light';
        root.classList.remove(oldTheme);

        root.classList.add(theme);

        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const value = { theme, toggleTheme };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}