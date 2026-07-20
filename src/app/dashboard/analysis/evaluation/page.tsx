'use client';
import { useState } from 'react';
import axios from 'axios';
import ControlRail from '@/components/controls/ControlRail';
import CheckboxField from '@/components/controls/CheckboxField';
import DateRangeControl from '@/components/controls/DateRangeControl';
import ParamGrid from '@/components/controls/ParamGrid';
import PhaseSelector from '@/components/controls/PhaseSelector';
import SelectField from '@/components/controls/SelectField';
import TimeRangeControl from '@/components/controls/TimeRangeControl';
import {
    API_URL,
    BLOCKS,
    DEFAULT_DATE_RANGE,
    DEFAULT_KALMAN_PARAMS,
    DEFAULT_SAV_PARAMS,
    DEFAULT_WHIT_PARAMS,
    INDICATORS,
    SMOOTHER_ALGORITHMS,
    VALUE_LABELS,
} from '@/lib/constants';
import { formatIndicatorLabel } from '@/lib/format';

interface EvaluationMetrics {
    [key: string]: number | null;
}

interface EvaluationResponse {
    indicator: string;
    smoother: string;
    start_date: string;
    end_date: string;
    metrics: {
        value_1: EvaluationMetrics;
        value_2: EvaluationMetrics;
        value_3: EvaluationMetrics;
    };
}

const METRIC_NAMES = [
    'MSE',
    'MAE',
    'R²',
    'Var_reduction',
    'SNR (dB)',
    'Total_Variation',
    'Smoothness_Ratio',
    'MSE/Variance',
    'Trade-off (λ=0.01)',
];

const LOWER_IS_BETTER = ['MSE', 'MAE', 'MSE/Variance', 'Total_Variation'];

export default function EvaluationPage() {
    const [metrics, setMetrics] = useState<EvaluationResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>(['kalman']);
    const [selectedPhases, setSelectedPhases] = useState<string[]>([
        'value_1',
        'value_2',
        'value_3',
    ]);
    const [selectedBlock, setSelectedBlock] = useState(BLOCKS[0]);
    const [selectedIndicator, setSelectedIndicator] = useState(INDICATORS[0]);
    const [resolution, setResolution] = useState('minute');
    const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
    const [timeRange, setTimeRange] = useState({ startHour: '00:00', endHour: '23:59' });

    const [kalmanParams, setKalmanParams] = useState<Record<string, number>>(DEFAULT_KALMAN_PARAMS);
    const [savParams, setSavParams] = useState<Record<string, number>>(DEFAULT_SAV_PARAMS);
    const [whitParams, setWhitParams] = useState<Record<string, number>>(DEFAULT_WHIT_PARAMS);

    const paramConfig: Record<
        string,
        { params: Record<string, number>; set: (p: Record<string, number>) => void; label: string }
    > = {
        kalman: { params: kalmanParams, set: setKalmanParams, label: 'Kalman' },
        savitzky_golay: { params: savParams, set: setSavParams, label: 'Savitzky-Golay' },
        whittaker: { params: whitParams, set: setWhitParams, label: 'Whittaker' },
    };

    const toggleAlgorithm = (algorithm: string) => {
        setSelectedAlgorithms(prev =>
            prev.includes(algorithm)
                ? prev.filter(a => a !== algorithm)
                : [...prev, algorithm]
        );
    };

    const fetchMetrics = async () => {
        try {
            setLoading(true);
            setError(null);
            const startDateTime = `${dateRange.start}T${timeRange.startHour}:00`;
            const endDateTime = `${dateRange.end}T${timeRange.endHour}:00`;
            const algorithmParams: Record<string, Record<string, number>> = {
                kalman: kalmanParams,
                savitzky_golay: savParams,
                whittaker: whitParams,
            };
            const promises = selectedAlgorithms.map(async algorithm => {
                const url = `${API_URL}/analysis/evaluation/${algorithm}/`;
                const params = {
                    start_date: startDateTime,
                    end_date: endDateTime,
                    resolution,
                    indicator: selectedIndicator,
                    table_name: selectedBlock,
                    ...algorithmParams[algorithm],
                };
                const response = await axios.get<EvaluationResponse>(url, { params });
                return response.data;
            });
            setMetrics(await Promise.all(promises));
        } catch (err) {
            console.error('Error fetching metrics:', err);
            setError('No se pudo contactar la API. Verifica que el servicio esté encendido.');
            setMetrics([]);
        } finally {
            setLoading(false);
        }
    };

    const combinations = metrics.flatMap(metricData =>
        selectedPhases.flatMap(phase => {
            const phaseMetrics = metricData.metrics[phase as keyof typeof metricData.metrics];
            if (!phaseMetrics) return [];
            return [{
                id: `${metricData.smoother}-${phase}`,
                label: `${metricData.smoother} — ${VALUE_LABELS[phase] ?? phase}`,
                metrics: phaseMetrics,
            }];
        })
    );

    const bestValueFor = (metricName: string) => {
        const values = combinations
            .map(c => c.metrics[metricName])
            .filter((v): v is number => v !== null && !isNaN(v));
        if (values.length === 0) return null;
        return LOWER_IS_BETTER.includes(metricName)
            ? Math.min(...values)
            : Math.max(...values);
    };

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
                                options={[
                                    { value: 'minute', label: 'Minutal' },
                                    { value: 'hour', label: 'Horaria' },
                                ]}
                            />
                        </>
                    ),
                },
                {
                    index: '02',
                    title: 'Algoritmos',
                    children: (
                        <>
                            {SMOOTHER_ALGORITHMS.map(alg => (
                                <CheckboxField
                                    key={alg.value}
                                    label={alg.label}
                                    checked={selectedAlgorithms.includes(alg.value)}
                                    onChange={() => toggleAlgorithm(alg.value)}
                                />
                            ))}
                            <PhaseSelector
                                label="Fases"
                                mode="multi"
                                selected={selectedPhases}
                                onChange={setSelectedPhases}
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
                            <button
                                type="button"
                                onClick={fetchMetrics}
                                disabled={
                                    loading ||
                                    selectedAlgorithms.length === 0 ||
                                    selectedPhases.length === 0
                                }
                                className="h-9 w-full bg-ink text-sm text-background transition-colors hover:bg-accent disabled:opacity-40"
                            >
                                {loading ? 'Calculando…' : 'Calcular métricas'}
                            </button>
                        </>
                    ),
                },
            ]}
        >
            {/* Hiperparámetros por algoritmo seleccionado */}
            {selectedAlgorithms.length > 0 && (
                <section className="mb-10">
                    <h2 className="mb-5 font-display text-2xl tracking-tight text-ink">
                        Hiperparámetros
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {selectedAlgorithms.map(algorithm => {
                            const config = paramConfig[algorithm];
                            if (!config) return null;
                            return (
                                <div key={algorithm} className="border-l border-line pl-5">
                                    <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-ink-faint">
                                        {config.label}
                                    </p>
                                    <ParamGrid params={config.params} onChange={config.set} />
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {error && (
                <div className="border border-line px-6 py-10 text-center">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-ink-faint">
                        Sin conexión
                    </p>
                    <p className="mt-3 font-display text-2xl tracking-tight text-ink">
                        Fuente de datos no disponible
                    </p>
                    <p className="mt-2 text-sm text-ink-muted">{error}</p>
                </div>
            )}

            {loading && !error && (
                <div className="space-y-3 border border-line p-6" aria-hidden>
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-4 animate-pulse bg-line" />
                    ))}
                </div>
            )}

            {combinations.length > 0 && !loading && (
                <section>
                    <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
                        <h2 className="font-display text-2xl tracking-tight text-ink">
                            Métricas de evaluación
                        </h2>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">
                            {formatIndicatorLabel(metrics[0].indicator)} ·{' '}
                            {metrics[0].start_date} → {metrics[0].end_date}
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-line-strong">
                                    <th className="py-3 pr-4 text-left text-[11px] font-normal uppercase tracking-[0.12em] text-ink-faint">
                                        Métrica
                                    </th>
                                    {combinations.map(comb => (
                                        <th
                                            key={comb.id}
                                            className="px-4 py-3 text-right text-[11px] font-normal uppercase tracking-[0.12em] text-ink-faint"
                                        >
                                            {comb.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {METRIC_NAMES.map(metricName => {
                                    const best = bestValueFor(metricName);
                                    return (
                                        <tr key={metricName} className="border-b border-line">
                                            <td className="py-3 pr-4 text-ink-muted">
                                                {metricName}
                                            </td>
                                            {combinations.map(comb => {
                                                const value = comb.metrics[metricName];
                                                const isBest =
                                                    value !== null &&
                                                    !isNaN(value) &&
                                                    value === best;
                                                return (
                                                    <td
                                                        key={comb.id}
                                                        className={`px-4 py-3 text-right tabular-nums ${
                                                            isBest
                                                                ? 'font-medium text-accent underline decoration-1 underline-offset-4'
                                                                : 'text-ink'
                                                        }`}
                                                    >
                                                        {value !== null && !isNaN(value)
                                                            ? value.toFixed(4)
                                                            : 'N/A'}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </ControlRail>
    );
}
