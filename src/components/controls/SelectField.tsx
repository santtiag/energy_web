'use client';
import { ChevronDown } from 'lucide-react';
import Field, { inputClass } from './Field';

export default function SelectField({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
}) {
    return (
        <Field label={label}>
            <span className="relative block">
                <select
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className={`${inputClass} appearance-none bg-surface pr-8`}
                >
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-faint" />
            </span>
        </Field>
    );
}
