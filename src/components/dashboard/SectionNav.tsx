'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SectionNav({
    label,
    pages,
}: {
    label: string;
    pages: { title: string; href: string }[];
}) {
    const pathname = usePathname();
    return (
        <nav aria-label={`Páginas de ${label}`} className="flex flex-wrap gap-x-6 gap-y-2">
            {pages.map(page => {
                const active = pathname.startsWith(page.href);
                return (
                    <Link
                        key={page.href}
                        href={page.href}
                        aria-current={active ? 'page' : undefined}
                        className={`pb-1 text-sm transition-colors ${
                            active
                                ? 'border-b border-accent text-ink'
                                : 'border-b border-transparent text-ink-muted hover:text-ink'
                        }`}
                    >
                        {page.title}
                    </Link>
                );
            })}
        </nav>
    );
}
