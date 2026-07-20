import { useMemo } from 'react';

export function useSingleDayRange(dateRange: { start: string; end: string }) {
    return useMemo(() => {
        const isSingleDay = dateRange.start === dateRange.end;
        if (isSingleDay) return { isSingleDay, intervalValue: 1 };
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        const dayDifference = Math.floor(
            (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        );
        return { isSingleDay, intervalValue: Math.max(dayDifference, 1) };
    }, [dateRange.start, dateRange.end]);
}
