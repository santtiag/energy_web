'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

type AuthContextType = {
    isAuthenticated: boolean;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
};

const AuthContext = createContext < AuthContextType > ({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const savedToken = Cookies.get('token');
        if (savedToken) setToken(savedToken);
    }, []);

    const login = (newToken: string) => {
        Cookies.set('token', newToken, { expires: 7 });
        setToken(newToken);
        router.push('/dashboard');
    };

    const logout = () => {
        Cookies.remove('token');
        setToken(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!token, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
