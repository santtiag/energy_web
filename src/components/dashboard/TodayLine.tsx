'use client';
import { useEffect, useState } from 'react';

export default function TodayLine() {
    const [today, setToday] = useState('');
    useEffect(() => {
        setToday(
            new Intl.DateTimeFormat('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }).format(new Date())
        );
    }, []);
    return (
        <p className="min-h-5 pb-2 text-sm text-ink-muted first-letter:uppercase">
            {today}
        </p>
    );
}
