'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const CommandPaletteContext = createContext<{
    open: boolean;
    setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => {} });

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <CommandPaletteContext.Provider value={{ open, setOpen }}>
            {children}
        </CommandPaletteContext.Provider>
    );
}

export const useCommandPalette = () => useContext(CommandPaletteContext);
