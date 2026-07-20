import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { NavPage } from '@/lib/navigation';

export default function HubCard({
    page,
    index,
}: {
    page: NavPage;
    index: string;
}) {
    const Icon = page.icon;
    return (
        <Link
            href={page.href}
            className="group relative flex min-h-44 flex-col border border-line bg-surface p-6 transition-colors hover:border-line-strong"
        >
            <div className="flex items-center justify-between">
                <span className="text-[11px] tracking-[0.18em] text-ink-faint">{index}</span>
                <Icon className="size-4 text-ink-faint" />
            </div>
            <h3 className="mt-4 font-display text-xl tracking-tight text-ink">
                {page.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                {page.description}
            </p>
            <ArrowUpRight className="mt-auto ml-auto size-4 text-ink-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
        </Link>
    );
}
