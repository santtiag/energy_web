'use client';
import { useEffect, useMemo, useState } from 'react';
import LazyTimeSeriesChart from '@/components/charts/LazyTimeSeriesChart';
import ChartSkeleton from '@/components/charts/ChartSkeleton';
import ChartStatePanel from '@/components/charts/ChartStatePanel';
import ControlRail from '@/components/controls/ControlRail';
import DateRangeControl from '@/components/controls/DateRangeControl';
import NumberField from '@/components/controls/NumberField';
import SelectField from '@/components/controls/SelectField';
import TimeRangeControl from '@/components/controls/TimeRangeControl';
import { useChartData } from '@/hooks/useChartData';
import { useSingleDayRange } from '@/hooks/useSingleDayRange';
import { API_URL, CLIMATE_VARIABLES, DEFAULT_DATE_RANGE } from '@/lib/constants';

interface ClimatePoint {
    time: string;
    value: number | null;
}

export default function ClimateVariablesPage() {
    const [selectedVariable, setSelectedVariable] = useState(CLIMATE_VARIABLES[0].value);
    const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
    const [timeRange, setTimeRange] = useState({ startHour: '00:00', endHour: '23:59' });

    const { isSingleDay, intervalValue } = useSingleDayRange(dateRange);
    const [intervalOverride, setIntervalOverride] = useState<number | null>(null);
    useEffect(() => setIntervalOverride(null), [dateRange.start, dateRange.end]);
    const effectiveInterval = intervalOverride ?? intervalValue;

    const params = useMemo(
        () => ({
            start_date: `${dateRange.start}T${timeRange.startHour}:00`,
            end_date: `${dateRange.end}T${timeRange.endHour}:00`,
            variable: selectedVariable,
        }),
        [dateRange, timeRange, selectedVariable]
    );

    const { data, status, retry } = useChartData<ClimatePoint>({
        url: `${API_URL}/data/climate_variable`,
        params,
        transform: raw =>
            raw.map((item: any) => ({ time: item.time, value: item.value })),
    });

    const variableLabel =
        CLIMATE_VARIABLES.find(v => v.value === selectedVariable)?.label ?? '';

    return (
        <ControlRail
            groups={[
                {
                    index: '01',
                    title: 'Variable',
                    children: (
                        <SelectField
                            label="Variable climática"
                            value={selectedVariable}
                            onChange={setSelectedVariable}
                            options={CLIMATE_VARIABLES}
                        />
                    ),
                },
                {
                    index: '02',
                    title: 'Rango',
                    children: (
                        <>
                            <DateRangeControl value={dateRange} onChange={setDateRange} />
                            <TimeRangeControl value={timeRange} onChange={setTimeRange} />
                            <NumberField
                                label="Intervalo (días múltiples)"
                                value={effectiveInterval}
                                min={1}
                                disabled={isSingleDay}
                                onChange={v => setIntervalOverride(v)}
                            />
                        </>
                    ),
                },
            ]}
        >
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-2xl tracking-tight text-ink">
                    Variables climáticas
                </h2>
                <p className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">
                    {variableLabel}
                </p>
            </div>
            {status === 'loading' && <ChartSkeleton />}
            {(status === 'error' || status === 'empty') && (
                <ChartStatePanel status={status} onRetry={retry} />
            )}
            {status === 'ready' && (
                <LazyTimeSeriesChart
                    data={data}
                    series={[{ dataKey: 'value', name: variableLabel, colorIndex: 3 }]}
                    isSingleDay={isSingleDay}
                    intervalValue={effectiveInterval}
                />
            )}
        </ControlRail>
    );
}
