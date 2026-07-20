import HubCard from '@/components/dashboard/HubCard';
import TodayLine from '@/components/dashboard/TodayLine';
import { NAV_SECTIONS } from '@/lib/navigation';

export default function DashboardHubPage() {
    return (
        <div className="pt-14 md:pt-20">
            {/* Masthead */}
            <p className="text-[11px] uppercase tracking-[0.3em] text-ink-faint">
                Vatio Laboratory — Monitoreo energético
            </p>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                <h1 className="font-display text-6xl font-medium tracking-tight text-ink md:text-7xl">
                    Panel de control
                </h1>
                <TodayLine />
            </div>
            <hr className="mt-8 border-line" />

            {/* Secciones */}
            <div className="mt-16 space-y-24">
                {NAV_SECTIONS.map(section => (
                    <section
                        key={section.slug}
                        id={section.slug}
                        className="grid scroll-mt-24 gap-8 md:grid-cols-12"
                    >
                        <div className="md:col-span-3">
                            <p className="font-display text-5xl text-ink-faint">{section.index}</p>
                            <h2 className="mt-3 font-display text-2xl tracking-tight text-ink">
                                {section.title}
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                                {section.description}
                            </p>
                        </div>
                        <div className="grid gap-4 md:col-span-9 md:grid-cols-2 md:[&>*:nth-child(even)]:translate-y-6">
                            {section.pages.map((page, i) => (
                                <HubCard
                                    key={page.href}
                                    page={page}
                                    index={`${section.index}.${i + 1}`}
                                />
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            <hr className="mt-24 border-line" />
            <p className="mt-6 text-center text-sm text-ink-muted">
                Pulsa{' '}
                <kbd className="border border-line px-1.5 py-0.5 text-[11px] text-ink-faint">
                    Ctrl
                </kbd>{' '}
                <kbd className="border border-line px-1.5 py-0.5 text-[11px] text-ink-faint">
                    K
                </kbd>{' '}
                para ir a cualquier página
            </p>
        </div>
    );
}
