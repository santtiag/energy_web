export const labelClass =
    'block text-[11px] uppercase tracking-[0.12em] text-ink-faint';

export const inputClass =
    'h-9 w-full border border-line bg-transparent px-3 text-sm text-ink focus:border-accent focus:outline-none';

export default function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <label className="block space-y-1.5">
            <span className={labelClass}>{label}</span>
            {children}
        </label>
    );
}
