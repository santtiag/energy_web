'use client';
import { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import DateRangeControl from '@/components/controls/DateRangeControl';
import SelectField from '@/components/controls/SelectField';
import { API_URL, BLOCKS, DEFAULT_DATE_RANGE, INDICATOR_UNITS, INDICATORS } from '@/lib/constants';
import { formatIndicatorLabel } from '@/lib/format';

interface OperationData {
    [key: string]: string | number;
    indicator_name: string;
}

interface ComparisonBlock {
    id: number;
    block: string;
    indicator: string;
    operation: string;
    startDate: string;
    endDate: string;
    data?: OperationData[];
    error?: boolean;
}

const OPERATIONS = [
    { value: 'maximus', label: 'Máximos' },
    { value: 'lows', label: 'Mínimos' },
    { value: 'average', label: 'Promedios' },
];

export default function ComparisonPage() {
    const [comparisonBlocks, setComparisonBlocks] = useState<ComparisonBlock[]>([
        {
            id: Date.now(),
            block: BLOCKS[0],
            indicator: INDICATORS[0],
            operation: 'maximus',
            startDate: DEFAULT_DATE_RANGE.start,
            endDate: DEFAULT_DATE_RANGE.end,
        },
    ]);
    const [loading, setLoading] = useState<{ [key: number]: boolean }>({});

    const fetchOperationData = async (block: ComparisonBlock) => {
        setLoading(prev => ({ ...prev, [block.id]: true }));
        try {
            const response = await axios.get(`${API_URL}/operations/${block.operation}/`, {
                params: {
                    start_date: block.startDate,
                    end_date: block.endDate,
                    indicator: block.indicator,
                    table_name: block.block,
                },
            });
            setComparisonBlocks(prev =>
                prev.map(b =>
                    b.id === block.id ? { ...b, data: response.data, error: false } : b
                )
            );
        } catch (error) {
            console.error('Error fetching data:', error);
            setComparisonBlocks(prev =>
                prev.map(b => (b.id === block.id ? { ...b, data: undefined, error: true } : b))
            );
        } finally {
            setLoading(prev => ({ ...prev, [block.id]: false }));
        }
    };

    const addComparisonBlock = () => {
        setComparisonBlocks(prev => [
            ...prev,
            {
                id: Date.now(),
                block: BLOCKS[0],
                indicator: INDICATORS[0],
                operation: 'maximus',
                startDate: prev[0]?.startDate ?? DEFAULT_DATE_RANGE.start,
                endDate: prev[0]?.endDate ?? DEFAULT_DATE_RANGE.end,
            },
        ]);
    };

    const updateBlock = (id: number, field: string, value: string) => {
        setComparisonBlocks(prev =>
            prev.map(block => (block.id === id ? { ...block, [field]: value } : block))
        );
    };

    const removeBlock = (id: number) => {
        setComparisonBlocks(prev => prev.filter(block => block.id !== id));
    };

    return (
        <div>
            <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="font-display text-2xl tracking-tight text-ink">
                    Hojas de comparación
                </h2>
                <button
                    type="button"
                    onClick={addComparisonBlock}
                    className="border-b border-accent pb-0.5 text-sm text-accent transition-opacity hover:opacity-70"
                >
                    + Añadir bloque
                </button>
            </div>

            <div className="space-y-6">
                {comparisonBlocks.map((block, index) => (
                    <article key={block.id} className="border border-line bg-surface p-6">
                        <div className="mb-5 flex items-baseline justify-between">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">
                                <span className="font-display">#{String(index + 1).padStart(2, '0')}</span>{' '}
                                · Bloque de comparación
                            </p>
                            {comparisonBlocks.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeBlock(block.id)}
                                    aria-label={`Eliminar bloque ${index + 1}`}
                                    className="text-ink-faint transition-colors hover:text-negative"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>

                        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
                            <SelectField
                                label="Bloque"
                                value={block.block}
                                onChange={v => updateBlock(block.id, 'block', v)}
                                options={BLOCKS.map(b => ({ value: b, label: b.toUpperCase() }))}
                            />
                            <SelectField
                                label="Indicador"
                                value={block.indicator}
                                onChange={v => updateBlock(block.id, 'indicator', v)}
                                options={INDICATORS.map(i => ({
                                    value: i,
                                    label: formatIndicatorLabel(i),
                                }))}
                            />
                            <SelectField
                                label="Operación"
                                value={block.operation}
                                onChange={v => updateBlock(block.id, 'operation', v)}
                                options={OPERATIONS}
                            />
                            <div className="md:col-span-2">
                                <DateRangeControl
                                    value={{ start: block.startDate, end: block.endDate }}
                                    onChange={({ start, end }) => {
                                        setComparisonBlocks(prev =>
                                            prev.map(b =>
                                                b.id === block.id
                                                    ? { ...b, startDate: start, endDate: end }
                                                    : b
                                            )
                                        );
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => fetchOperationData(block)}
                            disabled={loading[block.id]}
                            className="mt-5 h-9 bg-ink px-5 text-sm text-background transition-colors hover:bg-accent disabled:opacity-40"
                        >
                            {loading[block.id] ? 'Consultando…' : 'Actualizar'}
                        </button>

                        {block.error && (
                            <p className="mt-4 text-sm text-negative">
                                Sin conexión — no se pudo consultar la operación.
                            </p>
                        )}

                        {block.data?.map((data, dataIndex) => (
                            <div key={dataIndex} className="mt-6 border-t border-line pt-5">
                                <p className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">
                                    {formatIndicatorLabel(data.indicator_name)}
                                </p>
                                <div className="mt-4 grid gap-6 sm:grid-cols-3">
                                    {Object.entries(data)
                                        .filter(([key]) => key.includes('value_'))
                                        .map(([key, value]) => {
                                            const phase = key.split('_').pop();
                                            const timestamp = data[`time_${phase}`];
                                            return (
                                                <div key={key}>
                                                    <p className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">
                                                        {key.replace(/_/g, ' ')}
                                                        {INDICATOR_UNITS[block.indicator] &&
                                                            ` · ${INDICATOR_UNITS[block.indicator]}`}
                                                    </p>
                                                    <p className="mt-1 font-display text-3xl tracking-tight text-ink tabular-nums">
                                                        {typeof value === 'number'
                                                            ? value.toFixed(3)
                                                            : value}
                                                    </p>
                                                    {timestamp && (
                                                        <p className="mt-1 text-xs text-ink-muted">
                                                            {new Date(
                                                                timestamp as string
                                                            ).toLocaleString('es-ES')}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        ))}
                    </article>
                ))}
            </div>
        </div>
    );
}
