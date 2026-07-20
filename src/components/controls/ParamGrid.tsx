'use client';
import NumberField from './NumberField';

export default function ParamGrid({
    params,
    onChange,
}: {
    params: Record<string, number>;
    onChange: (next: Record<string, number>) => void;
}) {
    return (
        <div className="grid grid-cols-2 gap-3">
            {Object.entries(params).map(([key, value]) => (
                <NumberField
                    key={key}
                    label={key.replace(/_/g, ' ')}
                    value={value}
                    onChange={v => onChange({ ...params, [key]: v })}
                />
            ))}
        </div>
    );
}
