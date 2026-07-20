'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
    const { theme, toggle } = useTheme();
    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="flex size-9 items-center justify-center border border-line text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
        >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
    );
}
