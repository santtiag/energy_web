'use client';
import Field, { inputClass } from './Field';

export default function DateRangeControl({
    value,
    onChange,
}: {
    value: { start: string; end: string };
    onChange: (value: { start: string; end: string }) => void;
}) {
    return (
        <div className="grid grid-cols-2 gap-3">
            <Field label="Fecha inicio">
                <input
                    type="date"
                    value={value.start}
                    onChange={e => onChange({ ...value, start: e.target.value })}
                    className={inputClass}
                />
            </Field>
            <Field label="Fecha fin">
                <input
                    type="date"
                    value={value.end}
                    min={value.start}
                    onChange={e => onChange({ ...value, end: e.target.value })}
                    className={inputClass}
                />
            </Field>
        </div>
    );
}
