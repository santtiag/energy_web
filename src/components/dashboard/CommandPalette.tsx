'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, SunMoon, type LucideIcon } from 'lucide-react';
import { ALL_PAGES } from '@/lib/navigation';
import { fuzzyScore } from '@/lib/fuzzy';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useAuth } from '@/context/AuthContext';
import { useCommandPalette } from './CommandPaletteProvider';

interface PaletteItem {
    id: string;
    title: string;
    group: string;
    groupIndex: string;
    icon: LucideIcon;
    keywords: string[];
    run: () => void;
}

export default function CommandPalette() {
    const { open, setOpen } = useCommandPalette();
    const router = useRouter();
    const { toggle } = useTheme();
    const { logout } = useAuth();
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const previousFocus = useRef<HTMLElement | null>(null);

    const items = useMemo<PaletteItem[]>(
        () => [
            ...ALL_PAGES.map(page => ({
                id: page.href,
                title: page.title,
                group: page.section.title,
                groupIndex: page.section.index,
                icon: page.icon,
                keywords: page.keywords,
                run: () => router.push(page.href),
            })),
            {
                id: 'cmd-theme',
                title: 'Cambiar tema',
                group: 'Comandos',
                groupIndex: '—',
                icon: SunMoon,
                keywords: ['tema', 'theme', 'dark', 'light', 'oscuro', 'claro'],
                run: toggle,
            },
            {
                id: 'cmd-logout',
                title: 'Cerrar sesión',
                group: 'Comandos',
                groupIndex: '—',
                icon: LogOut,
                keywords: ['logout', 'salir', 'sesion'],
                run: () => {
                    logout();
                    router.push('/login');
                },
            },
        ],
        [router, toggle, logout]
    );

    const results = useMemo(() => {
        if (!query.trim()) return items;
        return items
            .map(item => {
                const haystacks = [item.title, item.group, ...item.keywords];
                const score = haystacks.reduce<number | null>((best, h) => {
                    const s = fuzzyScore(query, h);
                    if (s === null) return best;
                    return best === null ? s : Math.max(best, s);
                }, null);
                return { item, score };
            })
            .filter((r): r is { item: PaletteItem; score: number } => r.score !== null)
            .sort((a, b) => b.score - a.score)
            .map(r => r.item);
    }, [query, items]);

    const groups = useMemo(() => {
        const seen = new Map<string, PaletteItem[]>();
        for (const item of results) {
            const list = seen.get(item.group) ?? [];
            list.push(item);
            seen.set(item.group, list);
        }
        return [...seen.entries()];
    }, [results]);

    useEffect(() => {
        if (open) {
            previousFocus.current = document.activeElement as HTMLElement | null;
            setQuery('');
            setActiveIndex(0);
            document.documentElement.style.overflow = 'hidden';
            requestAnimationFrame(() => inputRef.current?.focus());
        } else {
            document.documentElement.style.overflow = '';
            previousFocus.current?.focus?.();
        }
        return () => {
            document.documentElement.style.overflow = '';
        };
    }, [open]);

    useEffect(() => setActiveIndex(0), [query]);

    if (!open) return null;

    const select = (item: PaletteItem) => {
        setOpen(false);
        item.run();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            setOpen(false);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => (prev + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => (prev - 1 + results.length) % results.length);
        } else if (e.key === 'Enter' && results[activeIndex]) {
            e.preventDefault();
            select(results[activeIndex]);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-ink/20 backdrop-blur-[2px] dark:bg-black/50"
            onClick={() => setOpen(false)}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Paleta de comandos"
                className="mx-auto mt-[15vh] w-full max-w-xl border border-line bg-surface shadow-none"
                onClick={e => e.stopPropagation()}
                onKeyDown={handleKeyDown}
            >
                <input
                    ref={inputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Buscar página o comando…"
                    aria-label="Buscar página o comando"
                    className="h-12 w-full border-b border-line bg-transparent px-4 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none"
                />
                <div role="listbox" aria-label="Resultados" className="max-h-[50vh] overflow-y-auto py-2">
                    {results.length === 0 && (
                        <p className="px-4 py-6 text-center text-sm text-ink-muted">
                            Sin resultados para «{query}»
                        </p>
                    )}
                    {groups.map(([group, groupItems]) => (
                        <div key={group}>
                            <p className="px-4 pb-1 pt-3 font-display text-[11px] uppercase tracking-[0.18em] text-ink-faint">
                                {groupItems[0].groupIndex} · {group}
                            </p>
                            {groupItems.map(item => {
                                const index = results.indexOf(item);
                                const active = index === activeIndex;
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        role="option"
                                        aria-selected={active}
                                        onClick={() => select(item)}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                                            active
                                                ? 'border-l-2 border-accent bg-accent-soft text-ink'
                                                : 'border-l-2 border-transparent text-ink-muted'
                                        }`}
                                    >
                                        <Icon className="size-4 shrink-0 text-ink-faint" />
                                        {item.title}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between border-t border-line px-4 py-2 text-[11px] text-ink-faint">
                    <span>↑↓ navegar · ⏎ abrir · esc cerrar</span>
                    <span className="font-display italic">Vatio Laboratory</span>
                </div>
            </div>
        </div>
    );
}
