'use client';
import { createContext, useCallback, useContext, useState } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
    theme: 'light',
    toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof document === 'undefined') return 'light';
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    });

    const toggle = useCallback(() => {
        setTheme(prev => {
            const next = prev === 'dark' ? 'light' : 'dark';
            document.documentElement.classList.toggle('dark', next === 'dark');
            try {
                localStorage.setItem('theme', next);
            } catch {}
            return next;
        });
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
