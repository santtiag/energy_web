interface RailGroup {
    index: string;
    title: string;
    children: React.ReactNode;
}

export default function ControlRail({
    groups,
    children,
}: {
    groups: RailGroup[];
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-10 xl:flex-row">
            <aside className="shrink-0 space-y-8 xl:w-[300px] xl:border-r xl:border-line xl:pr-8">
                {groups.map(group => (
                    <section key={group.index}>
                        <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-ink-faint">
                            <span className="font-display">{group.index}</span> · {group.title}
                        </p>
                        <div className="space-y-3">{group.children}</div>
                    </section>
                ))}
            </aside>
            <div className="min-w-0 flex-1">{children}</div>
        </div>
    );
}
