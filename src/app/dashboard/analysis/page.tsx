'use client';

import { useState, useEffect, Fragment } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import styles from './AnalysisGenerations.module.css';

// Cambiar la interfaz a:
interface SmootherData {
    time: string;
    [key: string]: number | string;
}

const AnalysisGenerations = () => {
    const [data, setData] = useState<SmootherData[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('kalman');
    const [selectedBlock, setSelectedBlock] = useState('blq_a');
    const [selectedIndicator, setSelectedIndicator] = useState('voltage');
    const [resolution, setResolution] = useState('minute');
    const [selectedValue, setSelectedValue] = useState('1');
    const [dateRange, setDateRange] = useState({
        start: '2025-01-01',
        end: '2025-01-02'
    });

    const colors = {
        original: '#2563eb',  // Azul
        smoothed: '#7c3aed'   // Morado
    };
    

    const algorithms = [
        { value: 'kalman', label: 'Filtro de Kalman' },
        { value: 'savitzky_golay', label: 'Savitzky-Golay' },
        { value: 'whittacker', label: 'Whittaker' }
    ];

    const indicators = ['voltage', 'current', 'active_power', 'reactive_power', 'power_factor'];
    const blocks = ['blq_a', 'blq_f'];

    const [kalmanParams, setKalmanParams] = useState({
        initial_error: 1,
        measurement_variance: 1,
        process_variance: 0.1,
        transition_matrix: 1,
        observation_matrix: 1
    });

    const [savParams, setSavParams] = useState({
        window_length: 11,
        polyorder: 2
    });

    const [whitParams, setWhitParams] = useState({
        lmbd: 100,
        d: 2
    });


    const fetchData = async () => {
        try {
            setLoading(true);
            let url = `http://localhost:5000/api/analysis/${selectedAlgorithm}/`;

            const algorithmParams = {
                kalman: kalmanParams,
                savitzky_golay: savParams,
                whittacker: whitParams
            }[selectedAlgorithm];

            const params = {
                start_date: dateRange.start,
                end_date: dateRange.end,
                resolution,
                indicator: selectedIndicator,
                table_name: selectedBlock,
                value: selectedValue,
                ...algorithmParams
            };

            
            const response = await axios.get(url, { params });

            const processedData = response.data.map((item: any) => ({
                time: new Date(item.time).toLocaleTimeString(),
                [`original_${selectedIndicator}_${selectedValue}`]: item.original[`value_${selectedValue}`],
                [`smoothed_${selectedIndicator}_${selectedValue}`]: item.smoothed[`value_${selectedValue}`]
            }));

            
            
            setData(processedData);
        } catch (error) {
            console.error('Error fetching smoother data:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [ selectedAlgorithm, selectedBlock, selectedIndicator, resolution, dateRange, selectedValue, kalmanParams, savParams, whitParams]);


    useEffect(() => {
        if (data.length > 0) {
            console.log('Datos procesados:', data);
            console.log('Primer elemento:', data[0]);
        }
    }, [data]);

    const renderParameterInputs = () => {
        switch (selectedAlgorithm) {
            case 'kalman':
                return (
                <div className={styles.parameterGroup}>
                    <h4>Parámetros Kalman</h4>
                    <div className={styles.parameterGrid}>
                        {Object.entries(kalmanParams).map(([key, value]) => (
                            <div key={key} className={styles.parameterItem}>
                                <label>{key.replace('_', ' ').toUpperCase()}</label>
                                <input 
                                    type="number" 
                                    value={value}
                                    onChange={(e) => {
                                        const newParams = {...kalmanParams};
                                        newParams[key] = parseFloat(e.target.value);
                                        setKalmanParams(newParams);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                );
            case 'savitzky_golay':
                return (
                <div className={styles.parameterGroup}>
                    <h4>Parámetros Savitzky-Golay</h4>
                    <div className={styles.parameterGrid}>
                        {Object.entries(savParams).map(([key, value]) => (
                            <div key={key} className={styles.parameterItem}>
                                <label>{key.replace('_', ' ').toUpperCase()}</label>
                                <input 
                                    type="number" 
                                    value={value}
                                    onChange={(e) => {
                                        const newParams = {...savParams};
                                        newParams[key] = parseFloat(e.target.value);
                                        setSavParams(newParams);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                );
            case 'whittacker':
                return (
                <div className={styles.parameterGroup}>
                    <h4>Parámetros Whittaker</h4>
                    <div className={styles.parameterGrid}>
                        {Object.entries(whitParams).map(([key, value]) => (
                            <div key={key} className={styles.parameterItem}>
                                <label>{key.toUpperCase()}</label>
                                <input 
                                    type="number" 
                                    value={value}
                                    onChange={(e) => {
                                        const newParams = {...whitParams};
                                        newParams[key] = parseFloat(e.target.value);
                                        setWhitParams(newParams);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.controlsContainer}>
                <div className={styles.mainControls}>
                    <div className={styles.controlGroup}>
                        <label>Algoritmo</label>
                        <select value={selectedAlgorithm}
                            onChange={(e) => setSelectedAlgorithm(e.target.value)}
                        >
                            {algorithms.map(alg => (
                                <option key={alg.value} value={alg.value}>{alg.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.controlGroup}>
                        <label>Bloque</label>
                        <select value={selectedBlock}
                            onChange={(e) => setSelectedBlock(e.target.value)}
                        >
                            {blocks.map(block => (
                                <option key={block} value={block}>{block.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.controlGroup}>
                        <label>Indicador</label>
                        <select value={selectedIndicator}
                            onChange={(e) => setSelectedIndicator(e.target.value)}
                        >
                            {indicators.map(ind => (
                                <option key={ind} value={ind}>{ind.replace('_', ' ')}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.controlGroup}>
                        <label>Resolución</label>
                        <select value={resolution}
                            onChange={(e) => setResolution(e.target.value)}
                        >
                            <option value="minute">Minutal</option>
                            <option value="hour">Horaria</option>
                        </select>
                    </div>

                    <div className={styles.controlGroup}>
                        <label>Valor</label>
                        <select 
                            value={selectedValue}
                            onChange={(e) => setSelectedValue(e.target.value)}
                        >
                            <option value="1">Valor 1</option>
                            <option value="2">Valor 2</option>
                            <option value="3">Valor 3</option>
                        </select>
                    </div>

                </div>

                {renderParameterInputs()}

                <div className={styles.dateControls}>
                    <div className={styles.controlGroup}>
                        <label>Fecha Inicio</label>
                        <input type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        />
                    </div>

                    <div className={styles.controlGroup}>
                        <label>Fecha Fin</label>
                        <input type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.chartContainer}>
                {loading ? (
                    <div className={styles.loading}>Cargando datos...</div>
                ) : (
                    <ResponsiveContainer width="100%" height={500}>
                        <LineChart 
                            data={data}
                            margin={{top: 50}}
                        >
                        <Legend 
                            verticalAlign="top"
                            wrapperStyle={{ 
                                lineHeight: '24px', 
                                textAlign: 'center' 
                            }}
                        ></Legend>
                            <CartesianGrid strokeDasharray="3 3" ></CartesianGrid>
                            <XAxis
                                dataKey="time"
                                angle={-45}
                                tick={{ fontSize: 12, dy: 10 }}
                                interval="preserveStartEnd"
                            ></XAxis>
                            <YAxis
                                domain={['auto', 'auto']}
                            ></YAxis>
                            <Tooltip></Tooltip>
                        {/* Línea Original */}
                        <Line                             type="monotone"
                            dataKey={`original_${selectedIndicator}_${selectedValue}`}
                            stroke={colors.original}
                            name={`Original ${selectedIndicator.replace('_', ' ')} ${selectedValue}`}
                            dot={false}
                        ></Line>
                        
                        {/* Línea Suavizada */}
                        <Line                             type="monotone"
                            dataKey={`smoothed_${selectedIndicator}_${selectedValue}`}
                            stroke={colors.smoothed}
                            name={`Suavizado ${selectedIndicator.replace('_', ' ')} ${selectedValue}`}
                            strokeDasharray="5 5"
                            dot={false}
                        ></Line>
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default AnalysisGenerations;
