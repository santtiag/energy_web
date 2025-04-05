'use client';

import { useState, useEffect, Fragment } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import styles from './AnalysisGenerations.module.css';

interface SmootherData {
    time: string;
    original: {
        value_1: number;
        value_2: number;
        value_3: number;
    };
    smoothed: {
        value_1: number;
        value_2: number;
        value_3: number;
    };
}

const AnalysisGenerations = () => {
    const [data, setData] = useState<SmootherData[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('kalman');
    const [selectedBlock, setSelectedBlock] = useState('blq_a');
    const [selectedIndicator, setSelectedIndicator] = useState('voltage');
    const [resolution, setResolution] = useState('minute');
    const [dateRange, setDateRange] = useState({
        start: '2025-01-01',
        end: '2025-01-02'
    });

    const colors = {
        original: ['#2563eb', '#16a34a', '#dc2626'],
        smoothed: ['#7c3aed', '#059669', '#991b1b']
    };
    
    // Parámetros dinámicos según el algoritmo
    const [parameters, setParameters] = useState({
        kalman: {
            initial_error: 1,
            measurement_variance: 1,
            process_variance: 0.1,
            transition_matrix: 1,
            observation_matrix: 1
        },
        savitzky_golay: {
            window_length: 11,
            polyorder: 2
        },
        whittacker: {
            lmbd: 100,
            d: 2
        }
    });

    const algorithms = [
        { value: 'kalman', label: 'Filtro de Kalman' },
        { value: 'savitzky_golay', label: 'Savitzky-Golay' },
        { value: 'whittacker', label: 'Whittaker' }
    ];

    const indicators = ['voltage', 'current', 'active_power', 'reactive_power', 'power_factor'];
    const blocks = ['blq_a', 'blq_f'];
    const values = ['value_1', 'value_2', 'value_3'];

    const fetchSmootherData = async () => {
        try {
            setLoading(true);
            console.log('Enviando parámetros:', {
                start_date: dateRange.start,
                end_date: dateRange.end,
                resolution,
                indicator: selectedIndicator,
                table_name: selectedBlock,
            });
            let url = `http://localhost:5000/api/analysis/${selectedAlgorithm}/`;
            
            const params: any = {
                start_date: dateRange.start,
                end_date: dateRange.end,
                resolution,
                indicator: selectedIndicator,
                table_name: selectedBlock,
                ...parameters[selectedAlgorithm as keyof typeof parameters]
            };

            const response = await axios.get(url, { params });
            const processedData = response.data.map((item: any) => ({
                time: new Date(item.time).toLocaleTimeString(),
                // Aplanar los objetos
                ...Object.entries(item.original).reduce((acc, [key, value]) => {
                  acc[`original_${key}`] = value;
                  return acc;
                }, {} as Record<string, any>),
                ...Object.entries(item.smoothed).reduce((acc, [key, value]) => {
                  acc[`smoothed_${key}`] = value;
                  return acc;
                }, {} as Record<string, any>)
              }));

            setData(processedData);
        } catch (error) {
            console.error('Error fetching smoother data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSmootherData();
    }, [selectedAlgorithm, selectedBlock, selectedIndicator, resolution, dateRange, parameters]);
    useEffect(() => {
        if (data.length > 0) {
          console.log('Datos procesados:', data);
          console.log('Primer elemento:', data[0]);
        }
      }, [data]);

    const renderParameterInputs = () => {
        switch(selectedAlgorithm) {
            case 'kalman':
                return (
                    <div className={styles.parameterGroup}>
                        <h4>Parámetros Kalman</h4>
                        <div className={styles.parameterGrid}>
                            <div className={styles.parameterItem}>
                                <label>Error Inicial</label>
                                <input                                     type="number"
                                    step="0.1"
                                    value={parameters.kalman.initial_error}
                                    onChange={(e) => setParameters(prev => ({
                                        ...prev,
                                        kalman: { ...prev.kalman, initial_error: parseFloat(e.target.value) }
                                    }))}
                                />
                            </div>
                            {/* Repetir para los demás parámetros de Kalman */}
                        </div>
                    </div>
                );
            case 'savitzky_golay':
                return (
                    <div className={styles.parameterGroup}>
                        <h4>Parámetros Savitzky-Golay</h4>
                        <div className={styles.parameterGrid}>
                            <div className={styles.parameterItem}>
                                <label>Ventana</label>
                                <input                                     type="number"
                                    value={parameters.savitzky_golay.window_length}
                                    onChange={(e) => setParameters(prev => ({
                                        ...prev,
                                        savitzky_golay: { ...prev.savitzky_golay, window_length: parseInt(e.target.value) }
                                    }))}
                                />
                            </div>
                            {/* Añadir polyorder */}
                        </div>
                    </div>
                );
            case 'whittacker':
                return (
                    <div className={styles.parameterGroup}>
                        <h4>Parámetros Whittaker</h4>
                        <div className={styles.parameterGrid}>
                            <div className={styles.parameterItem}>
                                <label>Lambda (λ)</label>
                                <input                                     type="number"
                                    value={parameters.whittacker.lmbd}
                                    onChange={(e) => setParameters(prev => ({
                                        ...prev,
                                        whittacker: { ...prev.whittacker, lmbd: parseInt(e.target.value) }
                                    }))}
                                />
                            </div>
                            {/* Añadir parámetro d */}
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
                        <select                             value={selectedAlgorithm}
                            onChange={(e) => setSelectedAlgorithm(e.target.value)}
                        >
                            {algorithms.map(alg => (
                                <option key={alg.value} value={alg.value}>{alg.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.controlGroup}>
                        <label>Bloque</label>
                        <select                             value={selectedBlock}
                            onChange={(e) => setSelectedBlock(e.target.value)}
                        >
                            {blocks.map(block => (
                                <option key={block} value={block}>{block.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.controlGroup}>
                        <label>Indicador</label>
                        <select                             value={selectedIndicator}
                            onChange={(e) => setSelectedIndicator(e.target.value)}
                        >
                            {indicators.map(ind => (
                                <option key={ind} value={ind}>{ind.replace('_', ' ')}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.controlGroup}>
                        <label>Resolución</label>
                        <select                             value={resolution}
                            onChange={(e) => setResolution(e.target.value)}
                        >
                            <option value="minute">Minutal</option>
                            <option value="hour">Horaria</option>
                        </select>
                    </div>
                </div>

                {renderParameterInputs()}

                <div className={styles.dateControls}>
                    <div className={styles.controlGroup}>
                        <label>Fecha Inicio</label>
                        <input                             type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        />
                    </div>

                    <div className={styles.controlGroup}>
                        <label>Fecha Fin</label>
                        <input                             type="date"
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
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" ></CartesianGrid>
                            <XAxis 
                                dataKey="time" 
                                angle={-45}
                                tick={{ fontSize: 12, dy: 10 }}
                                interval="preserveStartEnd"
                            ></XAxis>
                            <YAxis domain={['auto', 'auto']}></YAxis>
                            <Tooltip></Tooltip>
                            <Legend></Legend>
                            
                            {values.map((value, index) => {
                                const valueNumber = value.split('_')[1];
                                return (
                                    <Fragment key={value}>
                                        <Line         dataKey={`original_${value}`}
                                        stroke={colors.original[index]}
                                        name={`Original ${valueNumber}`}
                                        dot={false}
                                        ></Line>
                                        <Line         dataKey={`smoothed_${value}`}
                                        stroke={colors.smoothed[index]}
                                        name={`Suavizado ${valueNumber}`}
                                        strokeDasharray="5 5"
                                        dot={false}
                                        ></Line>
                                    </Fragment>
                                );
                            })}
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default AnalysisGenerations;