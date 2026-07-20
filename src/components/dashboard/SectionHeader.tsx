import { NAV_SECTIONS } from '@/lib/navigation';
import SectionNav from './SectionNav';

export default function SectionHeader({ slug }: { slug: string }) {
    const section = NAV_SECTIONS.find(s => s.slug === slug);
    if (!section) return null;
    return (
        <div className="pt-10 md:pt-14">
            <p className="text-[11px] uppercase tracking-[0.3em] text-ink-faint">
                {section.index} — {section.title}
            </p>
            <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink">
                {section.title}
            </h1>
            <div className="mt-6 border-b border-line pb-3">
                <SectionNav
                    label={section.title}
                    pages={section.pages.map(({ title, href }) => ({ title, href }))}
                />
            </div>
        </div>
    );
}
