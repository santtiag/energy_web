'use client';
import { useEffect, useMemo, useState } from 'react';
import LazyTimeSeriesChart from '@/components/charts/LazyTimeSeriesChart';
import ChartSkeleton from '@/components/charts/ChartSkeleton';
import ChartStatePanel from '@/components/charts/ChartStatePanel';
import ControlRail from '@/components/controls/ControlRail';
import DateRangeControl from '@/components/controls/DateRangeControl';
import NumberField from '@/components/controls/NumberField';
import PhaseSelector from '@/components/controls/PhaseSelector';
import SelectField from '@/components/controls/SelectField';
import TimeRangeControl from '@/components/controls/TimeRangeControl';
import { useChartData } from '@/hooks/useChartData';
import { useSingleDayRange } from '@/hooks/useSingleDayRange';
import {
    API_URL,
    BLOCKS,
    DEFAULT_DATE_RANGE,
    INDICATOR_UNITS,
    INDICATORS,
    RESOLUTION_LABELS,
    RESOLUTIONS,
    VALUE_LABELS,
    VALUES,
} from '@/lib/constants';
import { formatIndicatorLabel } from '@/lib/format';

interface ChartData {
    time: string;
    value_1: number;
    value_2: number;
    value_3: number;
}

export default function IndicatorsVisualizationPage() {
    const [selectedValues, setSelectedValues] = useState<string[]>(VALUES);
    const [selectedIndicator, setSelectedIndicator] = useState(INDICATORS[0]);
    const [selectedBlock, setSelectedBlock] = useState(BLOCKS[0]);
    const [resolution, setResolution] = useState(RESOLUTIONS[0]);
    const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
    const [timeRange, setTimeRange] = useState({ startHour: '00:00', endHour: '23:59' });

    const { isSingleDay, intervalValue } = useSingleDayRange(dateRange);
    const [intervalOverride, setIntervalOverride] = useState<number | null>(null);
    useEffect(() => setIntervalOverride(null), [dateRange.start, dateRange.end]);
    const effectiveInterval = intervalOverride ?? intervalValue;

    // selectedValues solo afecta el render, no la petición
    const params = useMemo(
        () => ({
            start_date: `${dateRange.start}T${timeRange.startHour}:00`,
            end_date: `${dateRange.end}T${timeRange.endHour}:00`,
            resolution,
            indicator: selectedIndicator,
            table_name: selectedBlock,
        }),
        [dateRange, timeRange, resolution, selectedIndicator, selectedBlock]
    );

    const { data, status, retry } = useChartData<ChartData>({
        url: `${API_URL}/data/indicator/`,
        params,
        transform: raw =>
            raw.map((item: any) => ({
                time: item.time,
                value_1: item.value_1,
                value_2: item.value_2,
                value_3: item.value_3,
            })),
    });

    const series = selectedValues.map((value, i) => ({
        dataKey: value,
        name: VALUE_LABELS[value],
        colorIndex: VALUES.indexOf(value) >= 0 ? VALUES.indexOf(value) : i,
    }));

    return (
        <ControlRail
            groups={[
                {
                    index: '01',
                    title: 'Fuente',
                    children: (
                        <>
                            <SelectField
                                label="Bloque"
                                value={selectedBlock}
                                onChange={setSelectedBlock}
                                options={BLOCKS.map(b => ({ value: b, label: b.toUpperCase() }))}
                            />
                            <SelectField
                                label="Indicador"
                                value={selectedIndicator}
                                onChange={setSelectedIndicator}
                                options={INDICATORS.map(i => ({
                                    value: i,
                                    label: formatIndicatorLabel(i),
                                }))}
                            />
                            <SelectField
                                label="Resolución"
                                value={resolution}
                                onChange={setResolution}
                                options={RESOLUTIONS.map(r => ({
                                    value: r,
                                    label: RESOLUTION_LABELS[r],
                                }))}
                            />
                            <PhaseSelector
                                mode="multi"
                                selected={selectedValues}
                                onChange={setSelectedValues}
                            />
                        </>
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
                    Indicadores por fase
                </h2>
                <p className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">
                    {formatIndicatorLabel(selectedIndicator)}
                    {INDICATOR_UNITS[selectedIndicator] &&
                        ` · ${INDICATOR_UNITS[selectedIndicator]}`}
                </p>
            </div>
            {status === 'loading' && <ChartSkeleton />}
            {(status === 'error' || status === 'empty') && (
                <ChartStatePanel status={status} onRetry={retry} />
            )}
            {status === 'ready' && (
                <LazyTimeSeriesChart
                    data={data}
                    series={series}
                    unit={INDICATOR_UNITS[selectedIndicator]}
                    isSingleDay={isSingleDay}
                    intervalValue={effectiveInterval}
                />
            )}
        </ControlRail>
    );
}
