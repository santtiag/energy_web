'use client';

import { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import styles from './VariablesChart.module.css';
import { API_URL, DEFAULT_DATE_RANGE, CLIMATE_VARIABLES } from '../../../../lib/constants';
import { convertTimeToMinutes, convertMinutesToTime } from '../../../../lib/utils';

interface ClimatePoint {
    time: string; // timestamp ISO 8601
    value: number | null;
}

const VariablesChart = () => {
    /*** ESTADOS ***/
    const [data, setData] = useState<ClimatePoint[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedVariable, setSelectedVariable] = useState(
        CLIMATE_VARIABLES[0].value,
    );
    const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
    const [timeRange, setTimeRange] = useState({
        startHour: '00:00',
        endHour: '23:59',
    });
    const [isSingleDay, setIsSingleDay] = useState(true);
    const [intervalValue, setIntervalValue] = useState(1); // solo para la densidad del eje X

    /*** DETECCIÓN DE RANGO DE UN SOLO DÍA ***/
    useEffect(() => {
        setIsSingleDay(dateRange.start === dateRange.end);
        if (dateRange.start !== dateRange.end) {
            const start = new Date(dateRange.start);
            const end = new Date(dateRange.end);
            const dayDiff = Math.floor(
                (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
            );
            setIntervalValue(dayDiff);
        } else {
            setIntervalValue(1);
        }
    }, [dateRange]);

    /*** FORMATEADOR DE EJE X ***/
    const formatXAxisTick = useCallback(
        (dateStr: string) => {
            const d = new Date(dateStr);
            if (isSingleDay) {
                return d.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                });
            }
            return `${String(d.getDate()).padStart(2, '0')}/${String(
                d.getMonth() + 1,
            ).padStart(2, '0')}/${d.getFullYear()}`;
        },
        [isSingleDay],
    );

    /*** PETICIÓN A LA API ***/
    const fetchData = async () => {
        try {
            setLoading(true);
            const startDateTime = `${dateRange.start}T${timeRange.startHour}:00`;
            const endDateTime = `${dateRange.end}T${timeRange.endHour}:00`;

            const url = `${API_URL}/data/climate_variable`; // <-- nuevo endpoint
            const params = {
                start_date: startDateTime,
                end_date: endDateTime,
                variable: selectedVariable,
            };

            const resp = await axios.get(url, { params });
            /* La respuesta de la función PL/pgSQL tiene:
                 [{ time: "...", value: 12.34 }, ...]
               Así que solo la pasamos tal cual. */
            const processed: ClimatePoint[] = resp.data.map((item: any) => ({
                time: item.time,
                value: item.value,
            }));

            setData(processed);
        } catch (e) {
            console.error('Error obteniendo datos climáticos:', e);
        } finally {
            setLoading(false);
        }
    };

    /*** RE‑EJECUCIÓN CUANDO CAMBIA ALGÚN PARÁMETRO ***/
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        selectedVariable,
        dateRange,
        timeRange.startHour,
        timeRange.endHour,
        // la variable `intervalValue` solo afecta al eje X, no a la petición.
    ]);

    /*** RENDER ***/
    return (
        <div className={styles.container}>
            {/* ---------- CONTROLES ---------- */}
            <div className={styles.controlsContainer}>
                {/* Columna 1 – Selección de variable y rangos de fechas */}
                <div className={styles.column1}>
                    <div className={styles.controlGroup}>
                        <label>Climate Variable</label>
                        <select
                            value={selectedVariable}
                            onChange={(e) => setSelectedVariable(e.target.value)}
                        >
                            {CLIMATE_VARIABLES.map((v) => (
                                <option key={v.value} value={v.value}>
                                    {v.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.dateControls}>
                        <div className={styles.controlGroup}>
                            <label>Start Date</label>
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) =>
                                    setDateRange((prev) => ({ ...prev, start: e.target.value }))
                                }
                            />
                        </div>
                        <div className={styles.controlGroup}>
                            <label>End Date</label>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) =>
                                    setDateRange((prev) => ({ ...prev, end: e.target.value }))
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Columna 2 – Rango de horas */}
                <div className={styles.column2}>
                    <div className={styles.controlGroup}>
                        <label>Start Time</label>
                        <input
                            type="time"
                            value={timeRange.startHour}
                            onChange={(e) =>
                                setTimeRange((prev) => ({ ...prev, startHour: e.target.value }))
                            }
                        />
                    </div>
                    <div className={styles.controlGroup}>
                        <label>End Time</label>
                        <input
                            type="time"
                            value={timeRange.endHour}
                            min={timeRange.startHour}
                            onChange={(e) =>
                                setTimeRange((prev) => ({ ...prev, endHour: e.target.value }))
                            }
                        />
                    </div>

                </div>
                <div className={styles.column1}>
                    {/* Deslizadores de horas (opcional, mantienen la UI original) */}
                    <div className={styles.controlGroup}>
                        <label>Deslizador inicio</label>
                        <input
                            type="range"
                            min="0"
                            max="1439"
                            value={convertTimeToMinutes(timeRange.startHour)}
                            onChange={(e) =>
                                setTimeRange((prev) => ({
                                    ...prev,
                                    startHour: convertMinutesToTime(parseInt(e.target.value)),
                                }))
                            }
                        />
                    </div>
                    <div className={styles.controlGroup}>
                        <label>Deslizador fin</label>
                        <input
                            type="range"
                            min="0"
                            max="1439"
                            value={convertTimeToMinutes(timeRange.endHour)}
                            onChange={(e) =>
                                setTimeRange((prev) => ({
                                    ...prev,
                                    endHour: convertMinutesToTime(parseInt(e.target.value)),
                                }))
                            }
                        />
                    </div>

                    {/* Intervalo visual (solo afecta al eje X) */}
                    <div className={styles.controlGroup}>
                        <label>Interval (Multiple Days)</label>
                        <input
                            type="number"
                            min="1"
                            value={intervalValue + 1}
                            onChange={(e) => setIntervalValue(parseInt(e.target.value))}
                            disabled={isSingleDay}
                        />
                    </div>
                </div>


            </div>

            {/* ---------- GRÁFICA ---------- */}
            <div className={styles.chartContainer}>
                {loading ? (
                    <div className={styles.loading}>Cargando datos...</div>
                ) : (
                    <ResponsiveContainer width="100%" height={550}>
                        <LineChart data={data} margin={{ top: 20, bottom: 40 }}>
                            <Legend
                                verticalAlign="top"
                                wrapperStyle={{ lineHeight: '24px', textAlign: 'center' }}
                            />
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="time"
                                angle={-45}
                                tickFormatter={formatXAxisTick}
                                textAnchor={isSingleDay ? 'end' : 'middle'}
                                interval={isSingleDay ? 38 : Math.ceil(data.length / intervalValue)}
                                // tick={{ fontSize: 14.8, fill: '#1e293b' }}
                                tick={{ fontSize: 14.8, fill: 'white' }}
                                domain={['auto', 'auto']}
                            />
                            <YAxis
                                unit={''} // opcional: puedes poner la unidad que corresponda
                                width={80}
                                tickFormatter={(v) => `${v}`}
                                tick={{ fill: 'white' }}
                                domain={['auto', 'auto']}
                            />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#489DF7"
                                name={CLIMATE_VARIABLES.find((v) => v.value === selectedVariable)?.label}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default VariablesChart;
