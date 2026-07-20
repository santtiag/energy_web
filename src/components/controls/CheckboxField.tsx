'use client';

export default function CheckboxField({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-muted transition-colors hover:text-ink">
            <input
                type="checkbox"
                checked={checked}
                onChange={e => onChange(e.target.checked)}
                className="size-4 cursor-pointer appearance-none border border-line-strong bg-transparent transition-colors checked:border-accent checked:bg-accent"
            />
            {label}
        </label>
    );
}
