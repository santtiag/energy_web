export default function ChartSkeleton({ height = 480 }: { height?: number }) {
    return (
        <div
            className="relative flex flex-col justify-between border border-line px-6 py-8"
            style={{ height: height + 28 }}
            aria-hidden
        >
            {[...Array(6)].map((_, i) => (
                <div key={i} className="h-px w-full bg-line" />
            ))}
            <svg
                className="absolute inset-x-6 top-1/2 -translate-y-1/2 animate-pulse text-line-strong"
                height="80"
                width="100%"
                preserveAspectRatio="none"
                viewBox="0 0 100 40"
            >
                <polyline
                    points="0,30 12,22 25,26 38,12 50,18 62,8 75,16 88,6 100,12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.8"
                />
            </svg>
            <p className="absolute bottom-3 left-6 font-display text-[11px] uppercase tracking-[0.18em] text-ink-faint">
                Preparando gráfica —
            </p>
        </div>
    );
}
