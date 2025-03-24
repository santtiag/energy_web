'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import styles from './DataGeneration.module.css';

interface ChartData {
    time: string;
    value_1: number;
    value_2: number;
    value_3: number;
}

const DataGeneration = () => {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedValues, setSelectedValues] = useState<string[]>(['value_1', 'value_2', 'value_3']);
    const [selectedIndicator, setSelectedIndicator] = useState('power_factor');
    const [selectedBlock, setSelectedBlock] = useState('blq_a');
    const [resolution, setResolution] = useState<'minute' | 'hour'>('minute');
    const [dateRange, setDateRange] = useState({
        start: '2025-01-01',
        end: '2025-01-02'
    });

    const indicators = ['voltage', 'current', 'active_power', 'reactive_power', 'power_factor'];
    const blocks = ['blq_a', 'blq_f'];
    const values = ['value_1', 'value_2', 'value_3'];

    const fetchData = async () => {
        try {
            //if (resolution === 'minute') {
            //    const start = new Date(dateRange.start);
            //    const end = new Date(dateRange.end);
            //    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            //
            //    if (diffDays > 3) {
            //        alert('Rango máximo para resolución minutal: 3 días');
            //        return;
            //    }
            //}
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/data/', {
                params: {
                    start_date: dateRange.start,
                    end_date: dateRange.end,
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

            setChartData(processedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [dateRange.start, dateRange.end, selectedIndicator, selectedBlock, selectedValues, resolution]);

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
            <div className="chart-container">
                {loading ? (
                    <div className={styles.loadingSpinner}></div>
                ) : (
                    <ResponsiveContainer width="100%" height={500}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" ></CartesianGrid>
                            <XAxis
                                dataKey="time"
                                angle={-45}
                                textAnchor="end"
                                tick={{ fontSize: 12 }}
                            ></XAxis>
                            <YAxis domain={['auto', 'auto']} ></YAxis>
                            <Tooltip></Tooltip>
                            <Legend></Legend>
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
