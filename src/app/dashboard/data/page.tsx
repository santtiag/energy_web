'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import styles from './DataGeneration.module.css';
import { API_URL, BLOCKS, DEFAULT_DATE_RANGE, INDICATOR_UNITS, INDICATORS, RESOLUTIONS, VALUES } from '@/lib/constants';
import { convertTimeToMinutes, convertMinutesToTime } from '../../../lib/utils';

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
    const [timeRange, setTimeRange] = useState({
        startHour: '00:00',
        endHour: '23:59'
    });

    const indicators = INDICATORS;
    const blocks = BLOCKS;
    const values = VALUES;

    const indicatorUnits: { [key: string]: string } = INDICATOR_UNITS;

    const fetchData = async () => {
        try {
            setLoading(true);
            const startDateTime = `${dateRange.start}T${timeRange.startHour}:00`;
            const endDateTime = `${dateRange.end}T${timeRange.endHour}:00`;

            const response = await axios.get(`${API_URL}/data/`, {
                params: {
                    start_date: startDateTime,
                    end_date: endDateTime,
                    resolution: resolution,
                    indicator: selectedIndicator,
                    table_name: selectedBlock
                }
            });

            const processedData = response.data.map((item: any) => ({
                time: new Date(item.time).toLocaleDateString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
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
        fetchData();
    }, [dateRange.start, dateRange.end, selectedIndicator, selectedBlock, selectedValues, resolution, timeRange.startHour, timeRange.endHour]);

    const generateLineColors = () => {
        const colors = ['#2563eb', '#dc2626', '#16a34a'];
        return colors.slice(0, selectedValues.length);
    };

    return (
        <div className="main-container">
            <div className={styles.comparisonControls}>
                <div className={styles.selectionPanel}>
                    <h3>Bloques</h3>
                    {blocks.map(block => (
                        <label key={block} className={styles.radioGroup}>
                            <input type="radio"
                                name="block"
                                checked={selectedBlock === block}
                                onChange={() => setSelectedBlock(block)}
                            />
                            <span>{block.toUpperCase()}</span>
                        </label>
                    ))}
                </div>

                <div className={styles.selectionPanel}>
                    <h3>Indicadores</h3>
                    {indicators.map(indicator => (
                        <label key={indicator} className={styles.radioGroup}>
                            <input type="radio"
                                name="indicator"
                                checked={selectedIndicator === indicator}
                                onChange={() => setSelectedIndicator(indicator)}
                            />
                            <span>{indicator.replace('_', ' ')}</span>
                        </label>
                    ))}
                </div>

                <div className={styles.selectionPanel}>
                    <h3>Resolución Temporal</h3>
                    <label className={styles.radioGroup}>
                        <input
                            type="radio"
                            name="resolution"
                            value="minute"
                            checked={resolution === 'minute'}
                            onChange={(e) => setResolution(e.target.value as 'minute' | 'hour')}
                        />
                        <span>Minutal</span>
                    </label>
                    <label className={styles.radioGroup}>
                        <input
                            type="radio"
                            name="resolution"
                            value="hour"
                            checked={resolution === 'hour'}
                            onChange={(e) => setResolution(e.target.value as 'minute' | 'hour')}
                        />
                        <span>Horaria</span>
                    </label>
                </div>

                <div className={styles.selectionPanel}>
                    <h3>Valores a Mostrar</h3>
                    {values.map(value => (
                        <label key={value} className={styles.checkboxGroup}>
                            <input type="checkbox"
                                checked={selectedValues.includes(value)}
                                onChange={(e) => {
                                    const newSelection = e.target.checked
                                        ? [...selectedValues, value]
                                        : selectedValues.filter(v => v !== value);
                                    setSelectedValues(newSelection);
                                }}
                            />
                            <span>{value.replace('_', ' ').toUpperCase()}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className={styles.dateControls}>
                <div className="form-group">
                    <label className="form-label">Fecha Inicio</label>
                    <input type="date"
                        className="form-input"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Fecha Fin</label>
                    <input type="date"
                        className="form-input"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    />
                </div>
            </div>
            <div className={styles.timeRangeControls}>
                <div className="form-group">
                    <label className="form-label">Hora Inicio</label>
                    <input
                        type="time"
                        className="form-input"
                        value={timeRange.startHour}
                        onChange={(e) => setTimeRange(prev => ({ ...prev, startHour: e.target.value }))}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Hora Fin</label>
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
            </div >
            <div className="chart-container">
                {loading ? (
                    <div className={styles.loadingSpinner}></div>
                ) : (
                    <ResponsiveContainer width="100%" height={500}>
                        <LineChart data={data}
                            margin={{ top: 20, bottom: 30 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" ></CartesianGrid>
                            <Legend
                                verticalAlign="top"
                                wrapperStyle={{
                                    lineHeight: '24px',
                                    textAlign: 'center'
                                }}
                            ></Legend>

                            <Legend></Legend>
                            <XAxis
                                dataKey="time"
                                angle={-45}
                                textAnchor="end"
                                tick={{ fontSize: 12 }}
                            ></XAxis>
                            <YAxis domain={['auto', 'auto']}
                                unit={indicatorUnits[selectedIndicator]}
                                width={80}  // Ajusta según necesidad
                                tickFormatter={(value) => `${value}`}
                            ></YAxis>
                            <Tooltip></Tooltip>
                            {selectedValues.map((value, index) => (
                                <Line key={value}
                                    type="monotone"
                                    dataKey={value}
                                    stroke={generateLineColors()[index]}
                                    strokeWidth={2}
                                    dot={false}
                                ></Line>
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>

        </div >

    );
};
export default DataGeneration;
