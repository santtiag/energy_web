'use client';
import { VALUES, VALUE_LABELS } from '@/lib/constants';
import { labelClass } from './Field';

interface PhaseSelectorProps {
    label?: string;
    mode: 'single' | 'multi';
    /** single: valor seleccionado; multi: lista de valores seleccionados */
    selected: string[];
    onChange: (selected: string[]) => void;
}

export default function PhaseSelector({
    label = 'Fase',
    mode,
    selected,
    onChange,
}: PhaseSelectorProps) {
    const toggle = (value: string) => {
        if (mode === 'single') {
            onChange([value]);
            return;
        }
        onChange(
            selected.includes(value)
                ? selected.filter(v => v !== value)
                : [...selected, value]
        );
    };

    return (
        <div className="space-y-1.5">
            <span className={labelClass}>{label}</span>
            <div className="flex border border-line">
                {VALUES.map((value, i) => {
                    const active = selected.includes(value);
                    return (
                        <button
                            key={value}
                            type="button"
                            aria-pressed={active}
                            onClick={() => toggle(value)}
                            className={`h-9 flex-1 text-sm transition-colors ${
                                i > 0 ? 'border-l border-line' : ''
                            } ${
                                active
                                    ? 'bg-accent-soft text-ink'
                                    : 'text-ink-muted hover:text-ink'
                            }`}
                        >
                            {VALUE_LABELS[value]}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
