'use client';
import { convertMinutesToTime, convertTimeToMinutes } from '@/lib/utils';
import Field, { inputClass } from './Field';

export default function TimeRangeControl({
    value,
    onChange,
}: {
    value: { startHour: string; endHour: string };
    onChange: (value: { startHour: string; endHour: string }) => void;
}) {
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <Field label="Hora inicio">
                    <input
                        type="time"
                        value={value.startHour}
                        onChange={e => onChange({ ...value, startHour: e.target.value })}
                        className={inputClass}
                    />
                </Field>
                <Field label="Hora fin">
                    <input
                        type="time"
                        value={value.endHour}
                        min={value.startHour}
                        onChange={e => onChange({ ...value, endHour: e.target.value })}
                        className={inputClass}
                    />
                </Field>
            </div>
            <input
                type="range"
                min="0"
                max="1439"
                aria-label="Hora inicio (deslizador)"
                value={convertTimeToMinutes(value.startHour)}
                onChange={e =>
                    onChange({ ...value, startHour: convertMinutesToTime(parseInt(e.target.value)) })
                }
                className="w-full accent-(--accent)"
            />
            <input
                type="range"
                min="0"
                max="1439"
                aria-label="Hora fin (deslizador)"
                value={convertTimeToMinutes(value.endHour)}
                onChange={e =>
                    onChange({ ...value, endHour: convertMinutesToTime(parseInt(e.target.value)) })
                }
                className="w-full accent-(--accent)"
            />
        </div>
    );
}
