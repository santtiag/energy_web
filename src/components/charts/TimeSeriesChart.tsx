'use client';
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { formatXAxisTick } from '@/lib/format';
import { useChartTheme } from './useChartTheme';

export interface SeriesDef {
    dataKey: string;
    name: string;
    colorIndex: number;
    dashed?: boolean;
}

export interface TimeSeriesChartProps {
    data: object[];
    series: SeriesDef[];
    unit?: string;
    isSingleDay: boolean;
    intervalValue: number;
    height?: number;
}

export default function TimeSeriesChart({
    data,
    series,
    unit = '',
    isSingleDay,
    intervalValue,
    height = 480,
}: TimeSeriesChartProps) {
    const theme = useChartTheme();

    return (
        <div>
            {/* Leyenda editorial */}
            <div className="mb-4 flex flex-wrap gap-x-6 gap-y-1">
                {series.map(s => (
                    <span
                        key={s.dataKey}
                        className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-ink-muted"
                    >
                        <svg width="16" height="2" aria-hidden>
                            <line
                                x1="0"
                                y1="1"
                                x2="16"
                                y2="1"
                                stroke={theme.series[s.colorIndex % theme.series.length]}
                                strokeWidth="2"
                                strokeDasharray={s.dashed ? '4 3' : undefined}
                            />
                        </svg>
                        {s.name}
                    </span>
                ))}
            </div>
            <ResponsiveContainer width="100%" height={height}>
                <LineChart data={data} margin={{ top: 8, right: 8, bottom: 40 }}>
                    <CartesianGrid vertical={false} stroke={theme.grid} />
                    <XAxis
                        dataKey="time"
                        angle={-45}
                        textAnchor={isSingleDay ? 'end' : 'middle'}
                        tickFormatter={value => formatXAxisTick(value, isSingleDay)}
                        interval={
                            isSingleDay
                                ? 38
                                : Math.max(Math.ceil(data.length / Math.max(intervalValue, 1)), 1)
                        }
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: theme.tick }}
                    />
                    <YAxis
                        domain={['auto', 'auto']}
                        unit={unit}
                        width={72}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: theme.tick }}
                    />
                    <Tooltip
                        labelFormatter={value => formatXAxisTick(String(value), isSingleDay)}
                        contentStyle={{
                            backgroundColor: theme.tooltipBg,
                            border: `1px solid ${theme.tooltipBorder}`,
                            borderRadius: 0,
                            fontSize: 12,
                            color: theme.tooltipText,
                            fontVariantNumeric: 'tabular-nums',
                        }}
                        labelStyle={{ color: theme.tooltipText }}
                    />
                    {series.map(s => (
                        <Line
                            key={s.dataKey}
                            type="monotone"
                            dataKey={s.dataKey}
                            name={s.name}
                            stroke={theme.series[s.colorIndex % theme.series.length]}
                            strokeWidth={1.25}
                            strokeDasharray={s.dashed ? '5 5' : undefined}
                            dot={false}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
