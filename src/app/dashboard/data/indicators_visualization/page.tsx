'use client';

import { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import styles from './visualization.module.css';
import { API_URL, BLOCKS, DEFAULT_DATE_RANGE, INDICATOR_UNITS, INDICATORS, RESOLUTIONS, VALUES, VALUE_LABELS } from '@/lib/constants';
import { convertTimeToMinutes, convertMinutesToTime } from '../../../../lib/utils';

interface ChartData {
    time: string;
    value_1: number;
    value_2: number;
    value_3: number;
}

const DataGeneration = () => {
    const [data, setData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedValues, setSelectedValues] = useState<string[]>(VALUES);
    const [selectedIndicator, setSelectedIndicator] = useState(INDICATORS[0]);
    const [selectedBlock, setSelectedBlock] = useState(BLOCKS[0]);
    const [resolution, setResolution] = useState(RESOLUTIONS[0]);
    const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
    const [isSingleDay, setIsSingleDay] = useState(true);
    const [intervalValue, setIntervalValue] = useState(1);

    const [timeRange, setTimeRange] = useState({
        startHour: '00:00',
        endHour: '23:59'
    });

    const indicators = INDICATORS;
    const blocks = BLOCKS;
    const values = VALUES;

    const indicatorUnits: { [key: string]: string } = INDICATOR_UNITS;

    // Detección de rango de un solo día
    useEffect(() => {
        setIsSingleDay(dateRange.start === dateRange.end);
    }, [dateRange]);

    // Formateador del eje X dinámico
    const formatXAxisTick = useCallback((dateStr: string) => {
        const date = new Date(dateStr);

        if (isSingleDay) {
            return date.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } else {
            return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        }
    }, [isSingleDay]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const startDateTime = `${dateRange.start}T${timeRange.startHour}:00`;
            const endDateTime = `${dateRange.end}T${timeRange.endHour}:00`;

            const response = await axios.get(`${API_URL}/data/indicator/`, {
                params: {
                    start_date: startDateTime,
                    end_date: endDateTime,
                    resolution: resolution,
                    indicator: selectedIndicator,
                    table_name: selectedBlock
                }
            });

            const processedData = response.data.map((item: any) => ({
                time: item.time, // Almacenar el timestamp completo
                value_1: item.value_1,
                value_2: item.value_2,
                value_3: item.value_3
            }));

            setData(processedData);
        } catch (error) {
            console.error('Error fetching :', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setIsSingleDay(dateRange.start === dateRange.end);
        if (!isSingleDay) {
            const start = new Date(dateRange.start);
            const end = new Date(dateRange.end);
            const dayDifference = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            setIntervalValue(dayDifference);
        } else {
            setIntervalValue(1);
        }
    }, [dateRange]);

    useEffect(() => {
        fetchData();
    }, [dateRange.start, dateRange.end, selectedIndicator, selectedBlock, selectedValues, resolution, timeRange.startHour, timeRange.endHour]);

    const generateLineColors = () => {
        // const colors = ['#2563eb', '#dc2626', '#16a34a'];
        const colors = ['#17BECF', '#98DF8A', '#FFBB78'];
        return colors.slice(0, selectedValues.length);
    };


//     Naranja brillante: #FF7F0E (RGB: 255, 127, 14)
//     Rojo intenso: #D62728 (RGB: 214, 39, 40)
//     Amarillo dorado: #FFD700 (RGB: 255, 215, 0)
//
//     Verde esmeralda: #2CA02C (RGB: 44, 160, 44)
//     Morado vibrante: #9467BD (RGB: 148, 103, 189)
//     Rosa coral: #FF9896 (RGB: 255, 152, 150)
//
//     Cian claro: #17BECF (RGB: 23, 190, 207)
//     Verde lima: #98DF8A (RGB: 152, 223, 138)
//     Naranja suave: #FFBB78 (RGB: 255, 187, 120)
//

    return (
        <div className={styles.container}>
            <div className={styles.controlsContainer}>
                {/* Columna 1 */}
                <div className={styles.column1}>
                    <div className={styles.controlGroup}>
                        <label>Block</label>
                        <select value={selectedBlock}
                            onChange={(e) => setSelectedBlock(e.target.value)}
                        >
                            {blocks.map(block => (
                                <option key={block} value={block}>{block.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.controlGroup}>
                        <label>Indicator</label>
                        <select value={selectedIndicator}
                            onChange={(e) => setSelectedIndicator(e.target.value)}
                        >
                            {indicators.map(ind => (
                                <option key={ind} value={ind}>{ind.replace('_', ' ')}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.controlGroup}>
                        <label>Resolution</label>
                        <select value={resolution}
                            onChange={(e) => setResolution(e.target.value)}
                        >
                            <option value="minute">Minutal</option>
                            <option value="hour">Horaria</option>
                        </select>
                    </div>
                    <div className={styles.controlGroup}>
                        <label>Values to Display</label>
                        <div className={styles.checkboxGroup}>
                            {values.map(value => (
                                <label key={value} className={styles.checkboxLabel}>
                                    <input type="checkbox"
                                        checked={selectedValues.includes(value)}
                                        onChange={(e) => {
                                            const newSelection = e.target.checked
                                                ? [...selectedValues, value]
                                                : selectedValues.filter(v => v !== value);
                                            setSelectedValues(newSelection);
                                        }}
                                    />
                                    <span>{VALUE_LABELS[value]}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Columna 2 - Vacía para mantener consistencia */}
                <div className={styles.column2}>
                    <div className={styles.dateControls}>
                        <div className={styles.controlGroup}>
                            <label>Start Date</label>
                            <input type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            />
                        </div>
                        <div className={styles.controlGroup}>
                            <label>End Date</label>
                            <input type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>

                {/* Columna 3 - Fechas, Horas y Opciones de Visualización */}
                <div className={styles.column3}>
                    <div className={styles.timeRangeControls}>
                        <div className="form-group">
                            <label className="form-label">Start Time</label>
                            <input
                                type="time"
                                className="form-input"
                                value={timeRange.startHour}
                                onChange={(e) => setTimeRange(prev => ({ ...prev, startHour: e.target.value }))}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">End Time</label>
                            <input
                                type="time"
                                className="form-input"
                                value={timeRange.endHour}
                                onChange={(e) => setTimeRange(prev => ({ ...prev, endHour: e.target.value }))}
                                min={timeRange.startHour}
                            />
                        </div>
                        {/* Opcional: Agregar un deslizador visual */}
                        <input
                            type="range"
                            min="0"
                            max="1439"
                            value={convertTimeToMinutes(timeRange.startHour)}
                            onChange={(e) => setTimeRange(prev => ({ ...prev, startHour: convertMinutesToTime(parseInt(e.target.value)) }))}
                        />
                        <input
                            type="range"
                            min="0"
                            max="1439"
                            value={convertTimeToMinutes(timeRange.endHour)}
                            onChange={(e) => setTimeRange(prev => ({ ...prev, endHour: convertMinutesToTime(parseInt(e.target.value)) }))}
                        />
                    </div>
                    <div className={styles.controlGroup}>
                        <label>Interval (Multiple Days)</label>
                        <input
                            type="number"
                            min="1"
                            value={intervalValue + 1}
                            onChange={e => setIntervalValue(parseInt(e.target.value))}
                            disabled={isSingleDay}
                        />
                    </div>
                </div>
            </div>

            {/* Graph */}
            <div className={styles.chartContainer}>
                {loading ? (
                    <div className={styles.loading}>Cargando datos...</div>
                ) : (
                    // Tamaño de cuadro donde va a estar la grafica
                    <ResponsiveContainer width="100%" height={550}>
                        <LineChart
                            data={data}
                            margin={{ top: 20, bottom: 40 }} // Ajusta el tamaño de la grafica dentro del <ResponsiveContainer>
                        >
                            <Legend
                                verticalAlign="top"
                                wrapperStyle={{
                                    lineHeight: '24px',
                                    textAlign: 'center'
                                }}
                            ></Legend>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                domain={['auto', 'auto']}
                                dataKey="time"
                                angle={-45}
                                tickFormatter={formatXAxisTick}
                                textAnchor={isSingleDay ? 'end' : 'middle'}
                                interval={isSingleDay ? 38 : Math.ceil(data.length / intervalValue)} // Reducir densidad de etiquetas en múltiples días
                                tick={{ fontSize: 14.8, fill: 'white' }}
                            ></XAxis>
                            <YAxis
                                domain={['auto', 'auto']}
                                unit={indicatorUnits[selectedIndicator]}
                                width={80}
                                tickFormatter={(value) => `${value}`}
                                tick={{ fill: 'white' }}
                            ></YAxis>
                            <Tooltip></Tooltip>
                            {selectedValues.map((value, index) => (
                                <Line key={value}
                                    type="monotone"
                                    dataKey={value}
                                    name={VALUE_LABELS[value]}
                                    stroke={generateLineColors()[index]}
                                    strokeWidth={2}
                                    dot={false}
                                ></Line>
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
export default DataGeneration;
