'use client';
import dynamic from 'next/dynamic';
import ChartSkeleton from './ChartSkeleton';

const TimeSeriesChart = dynamic(() => import('./TimeSeriesChart'), {
    ssr: false,
    loading: () => <ChartSkeleton />,
});

export default TimeSeriesChart;
export type { SeriesDef, TimeSeriesChartProps } from './TimeSeriesChart';
