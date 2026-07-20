'use client';
import { useEffect, useMemo, useState } from 'react';
import LazyTimeSeriesChart from '@/components/charts/LazyTimeSeriesChart';
import ChartSkeleton from '@/components/charts/ChartSkeleton';
import ChartStatePanel from '@/components/charts/ChartStatePanel';
import CheckboxField from '@/components/controls/CheckboxField';
import ControlRail from '@/components/controls/ControlRail';
import DateRangeControl from '@/components/controls/DateRangeControl';
import NumberField from '@/components/controls/NumberField';
import ParamGrid from '@/components/controls/ParamGrid';
import PhaseSelector from '@/components/controls/PhaseSelector';
import SelectField from '@/components/controls/SelectField';
import TimeRangeControl from '@/components/controls/TimeRangeControl';
import { useChartData } from '@/hooks/useChartData';
import { useSingleDayRange } from '@/hooks/useSingleDayRange';
import {
    API_URL,
    BLOCKS,
    DEFAULT_DATE_RANGE,
    DEFAULT_KALMAN_PARAMS,
    DEFAULT_SAV_PARAMS,
    DEFAULT_WHIT_PARAMS,
    INDICATOR_UNITS,
    INDICATORS,
    RESOLUTION_LABELS,
    RESOLUTIONS,
    SMOOTHER_ALGORITHMS,
} from '@/lib/constants';
import { formatIndicatorLabel } from '@/lib/format';

interface SmootherData {
    time: string;
    [key: string]: number | string;
}

export default function SmoothersPage() {
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('kalman');
    const [selectedBlock, setSelectedBlock] = useState(BLOCKS[0]);
    const [selectedIndicator, setSelectedIndicator] = useState(INDICATORS[0]);
    const [resolution, setResolution] = useState(RESOLUTIONS[0]);
    const [selectedValue, setSelectedValue] = useState('1');
    const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
    const [timeRange, setTimeRange] = useState({ startHour: '00:00', endHour: '23:59' });
    const [kalmanParams, setKalmanParams] = useState<Record<string, number>>(DEFAULT_KALMAN_PARAMS);
    const [savParams, setSavParams] = useState<Record<string, number>>(DEFAULT_SAV_PARAMS);
    const [whitParams, setWhitParams] = useState<Record<string, number>>(DEFAULT_WHIT_PARAMS);
    const [showOriginalLine, setShowOriginalLine] = useState(true);
    const [showSmoothedLine, setShowSmoothedLine] = useState(true);

    const { isSingleDay, intervalValue } = useSingleDayRange(dateRange);
    const [intervalOverride, setIntervalOverride] = useState<number | null>(null);
    useEffect(() => setIntervalOverride(null), [dateRange.start, dateRange.end]);
    const effectiveInterval = intervalOverride ?? intervalValue;

    const params = useMemo(() => {
        const algorithmParams = {
            kalman: kalmanParams,
            savitzky_golay: savParams,
            whittaker: whitParams,
        }[selectedAlgorithm];
        return {
            start_date: `${dateRange.start}T${timeRange.startHour}:00`,
            end_date: `${dateRange.end}T${timeRange.endHour}:00`,
            resolution,
            indicator: selectedIndicator,
            table_name: selectedBlock,
            value: selectedValue,
            ...algorithmParams,
        };
    }, [
        selectedAlgorithm,
        selectedBlock,
        selectedIndicator,
        resolution,
        selectedValue,
        dateRange,
        timeRange,
        kalmanParams,
        savParams,
        whitParams,
    ]);

    const originalKey = `original_${selectedIndicator}_${selectedValue}`;
    const smoothedKey = `smoothed_${selectedIndicator}_${selectedValue}`;

    const { data, status, retry } = useChartData<SmootherData>({
        url: `${API_URL}/analysis/${selectedAlgorithm}/`,
        params,
        transform: raw =>
            raw.map((item: any) => ({
                time: item.time,
                [originalKey]: item.original[`value_${selectedValue}`],
                [smoothedKey]: item.smoothed[`value_${selectedValue}`],
            })),
    });

    const activeParams = {
        kalman: { params: kalmanParams, set: setKalmanParams },
        savitzky_golay: { params: savParams, set: setSavParams },
        whittaker: { params: whitParams, set: setWhitParams },
    }[selectedAlgorithm]!;

    const algorithmLabel =
        SMOOTHER_ALGORITHMS.find(a => a.value === selectedAlgorithm)?.label ?? '';

    const series = [
        ...(showOriginalLine
            ? [{
                  dataKey: originalKey,
                  name: `Original — Fase ${selectedValue}`,
                  colorIndex: 1,
              }]
            : []),
        ...(showSmoothedLine
            ? [{
                  dataKey: smoothedKey,
                  name: `Suavizado — Fase ${selectedValue}`,
                  colorIndex: 0,
                  dashed: true,
              }]
            : []),
    ];

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
                                mode="single"
                                selected={[`value_${selectedValue}`]}
                                onChange={([v]) => setSelectedValue(v.replace('value_', ''))}
                            />
                        </>
                    ),
                },
                {
                    index: '02',
                    title: 'Algoritmo',
                    children: (
                        <>
                            <SelectField
                                label="Suavizador"
                                value={selectedAlgorithm}
                                onChange={setSelectedAlgorithm}
                                options={SMOOTHER_ALGORITHMS}
                            />
                            <ParamGrid
                                params={activeParams.params}
                                onChange={activeParams.set}
                            />
                        </>
                    ),
                },
                {
                    index: '03',
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
                {
                    index: '04',
                    title: 'Capas',
                    children: (
                        <>
                            <CheckboxField
                                label="Datos originales"
                                checked={showOriginalLine}
                                onChange={setShowOriginalLine}
                            />
                            <CheckboxField
                                label="Datos suavizados"
                                checked={showSmoothedLine}
                                onChange={setShowSmoothedLine}
                            />
                        </>
                    ),
                },
            ]}
        >
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-2xl tracking-tight text-ink">
                    Suavizado — {algorithmLabel}
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
