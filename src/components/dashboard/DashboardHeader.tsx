'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Search } from 'lucide-react';
import { findBreadcrumb } from '@/lib/navigation';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { useCommandPalette } from './CommandPaletteProvider';

export default function DashboardHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuth();
    const { setOpen } = useCommandPalette();
    const { section, page } = findBreadcrumb(pathname);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <header className="sticky top-0 z-40 border-b border-line bg-background/90 backdrop-blur-sm">
            <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6 md:px-10">
                <nav aria-label="Migas de pan" className="flex min-w-0 items-baseline gap-3">
                    <Link
                        href="/dashboard"
                        className="shrink-0 font-display text-lg tracking-tight text-ink transition-colors hover:text-accent"
                    >
                        Vatio Laboratory
                    </Link>
                    {section && (
                        <span className="hidden min-w-0 items-baseline gap-3 text-sm sm:flex">
                            <span aria-hidden className="text-ink-faint">/</span>
                            <Link
                                href={`/dashboard#${section.slug}`}
                                className="shrink-0 text-ink-muted transition-colors hover:text-ink"
                            >
                                {section.title}
                            </Link>
                            {page && (
                                <>
                                    <span aria-hidden className="text-ink-faint">/</span>
                                    <span className="truncate text-ink">{page.title}</span>
                                </>
                            )}
                        </span>
                    )}
                </nav>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="flex h-9 items-center gap-2 border border-line px-3 text-sm text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
                    >
                        <Search className="size-3.5" />
                        <span className="hidden md:inline">Buscar</span>
                        <kbd className="hidden border border-line px-1.5 py-0.5 text-[10px] text-ink-faint md:inline">
                            ⌘K
                        </kbd>
                    </button>
                    <ThemeToggle />
                    <button
                        type="button"
                        onClick={handleLogout}
                        aria-label="Cerrar sesión"
                        className="flex size-9 items-center justify-center border border-line text-ink-muted transition-colors hover:border-line-strong hover:text-negative"
                    >
                        <LogOut className="size-4" />
                    </button>
                </div>
            </div>
        </header>
    );
}
