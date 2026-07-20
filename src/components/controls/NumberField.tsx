'use client';
import Field, { inputClass } from './Field';

export default function NumberField({
    label,
    value,
    onChange,
    min,
    step,
    disabled,
}: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    step?: number;
    disabled?: boolean;
}) {
    return (
        <Field label={label}>
            <input
                type="number"
                value={value}
                min={min}
                step={step}
                disabled={disabled}
                onChange={e => onChange(parseFloat(e.target.value))}
                className={`${inputClass} tabular-nums disabled:opacity-40`}
            />
        </Field>
    );
}
