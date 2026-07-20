'use client';
import { useMemo } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';

const FALLBACK = {
    light: {
        grid: '#ebe4d8',
        tick: '#6e675e',
        series: ['#c1502e', '#3d5a4c', '#8a6d3b', '#4a5b73'],
        tooltipBg: '#fffdf9',
        tooltipBorder: '#e4ddd2',
        tooltipText: '#22201c',
    },
    dark: {
        grid: '#2a2622',
        tick: '#a79e91',
        series: ['#d9714e', '#7fa98f', '#c2a366', '#8fa3be'],
        tooltipBg: '#211d1a',
        tooltipBorder: '#322d28',
        tooltipText: '#ede7dd',
    },
};

export function useChartTheme() {
    const { theme } = useTheme();
    return useMemo(() => {
        if (typeof window === 'undefined') return FALLBACK[theme];
        const style = getComputedStyle(document.documentElement);
        const read = (name: string, fallback: string) =>
            style.getPropertyValue(name).trim() || fallback;
        const fb = FALLBACK[theme];
        return {
            grid: read('--chart-grid', fb.grid),
            tick: read('--ink-muted', fb.tick),
            series: [
                read('--chart-1', fb.series[0]),
                read('--chart-2', fb.series[1]),
                read('--chart-3', fb.series[2]),
                read('--chart-4', fb.series[3]),
            ],
            tooltipBg: read('--surface', fb.tooltipBg),
            tooltipBorder: read('--line', fb.tooltipBorder),
            tooltipText: read('--ink', fb.tooltipText),
        };
    }, [theme]);
}
