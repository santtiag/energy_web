'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Evaluation.module.css';
import { API_URL, RESOLUTIONS, INDICATORS, BLOCKS, DEFAULT_DATE_RANGE } from '../../../../lib/constants';

interface EvaluationMetrics {
    "MSE": number | null;
    "MAE": number | null;
    "R²": number | null;
    "Var_reduction": number | null;
    "SNR (dB)": number | null;
    "Total_Variation": number | null;
    "Smoothness_Ratio": number | null;
    "MSE/Variance": number | null;
    "Trade-off (λ=0.01)": number | null;
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

interface AlgorithmConfig {
    algorithm: string;
    phases: string[];
    params?: any;
}

const EvaluationPage = () => {
    const [metrics, setMetrics] = useState<EvaluationResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>(['kalman']);
    const [selectedPhases, setSelectedPhases] = useState<string[]>(['value_1', 'value_2', 'value_3']);
    const [selectedBlock, setSelectedBlock] = useState(BLOCKS[0]);
    const [selectedIndicator, setSelectedIndicator] = useState(INDICATORS[0]);
    const [resolution, setResolution] = useState(RESOLUTIONS[0]);
    const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
    const [timeRange, setTimeRange] = useState({
        startHour: '00:00',
        endHour: '23:59'
    });

    // Parámetros de los suavizadores
    const [kalmanParams, setKalmanParams] = useState({
        initial_error: 1,
        measurement_variance: 10,
        process_variance: 0.1,
        transition_matrix: 1,
        observation_matrix: 1
    });

    const [savParams, setSavParams] = useState({
        window_length: 21,
        polyorder: 2
    });

    const [whitParams, setWhitParams] = useState({
        lmbd: 100,
        d: 2
    });

    const algorithms = [
        { value: 'kalman', label: 'Kalman' },
        { value: 'savitzky_golay', label: 'Savitzky Golay' },
        { value: 'whittaker', label: 'Whittaker' }
    ];

    const phases = [
        { value: 'value_1', label: 'Fase 1' },
        { value: 'value_2', label: 'Fase 2' },
        { value: 'value_3', label: 'Fase 3' }
    ];

    const toggleAlgorithm = (algorithm: string) => {
        setSelectedAlgorithms(prev =>
            prev.includes(algorithm)
                ? prev.filter(a => a !== algorithm)
                : [...prev, algorithm]
        );
    };

    const togglePhase = (phase: string) => {
        setSelectedPhases(prev =>
            prev.includes(phase)
                ? prev.filter(p => p !== phase)
                : [...prev, phase]
        );
    };

    const fetchMetrics = async () => {
        try {
            setLoading(true);
            setError(null);

            const startDateTime = `${dateRange.start}T${timeRange.startHour}:00`;
            const endDateTime = `${dateRange.end}T${timeRange.endHour}:00`;

            const algorithmParams = {
                kalman: kalmanParams,
                savitzky_golay: savParams,
                whittaker: whitParams
            };

            const promises = selectedAlgorithms.map(async (algorithm) => {
                const url = `${API_URL}/analysis/evaluation/${algorithm}/`;

                const params = {
                    start_date: startDateTime,
                    end_date: endDateTime,
                    resolution,
                    indicator: selectedIndicator,
                    table_name: selectedBlock,
                    ...algorithmParams[algorithm as keyof typeof algorithmParams]
                };

                const response = await axios.get<EvaluationResponse>(url, { params });
                return response.data;
            });

            const results = await Promise.all(promises);
            setMetrics(results);
        } catch (err) {
            console.error('Error fetching metrics:', err);
            setError('Error al obtener las métricas de evaluación');
            setMetrics([]);
        } finally {
            setLoading(false);
        }
    };

    const renderParameterInputs = () => {
        if (selectedAlgorithms.length === 0) return null;

        const getParams = (algorithm: string) => {
            switch (algorithm) {
                case 'kalman':
                    return { params: kalmanParams, setParams: setKalmanParams, name: 'Parámetros Kalman', isDecimal: true };
                case 'savitzky_golay':
                    return { params: savParams, setParams: setSavParams, name: 'Parámetros Savitzky-Golay', isDecimal: false };
                case 'whittaker':
                    return { params: whitParams, setParams: setWhitParams, name: 'Parámetros Whittaker', isDecimal: true };
                default:
                    return null;
            }
        };

        return (
            <div className={styles.parameterSection}>
                {selectedAlgorithms.map(algorithm => {
                    const config = getParams(algorithm);
                    if (!config) return null;

                    return (
                        <div key={algorithm} className={styles.parameterGroup}>
                            <h3>{config.name}</h3>
                            <div className={styles.parameterGrid}>
                                {Object.entries(config.params).map(([key, value]) => (
                                    <div key={key} className={styles.parameterItem}>
                                        <label>{key.replace(/_/g, ' ')}</label>
                                        <input
                                            type="number"
                                            step={config.isDecimal ? "any" : "1"}
                                            value={value}
                                            onChange={(e) => {
                                                const parsedValue = config.isDecimal
                                                    ? parseFloat(e.target.value) || 0
                                                    : parseInt(e.target.value) || 0;

                                                // Use appropriate setter based on algorithm
                                                if (algorithm === 'kalman') {
                                                    const newParams = { ...kalmanParams };
                                                    newParams[key as keyof typeof kalmanParams] = parsedValue;
                                                    setKalmanParams(newParams);
                                                } else if (algorithm === 'savitzky_golay') {
                                                    const newParams = { ...savParams };
                                                    newParams[key as keyof typeof savParams] = parsedValue;
                                                    setSavParams(newParams);
                                                } else if (algorithm === 'whittaker') {
                                                    const newParams = { ...whitParams };
                                                    newParams[key as keyof typeof whitParams] = parsedValue;
                                                    setWhitParams(newParams);
                                                }
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const getBestValueForMetric = (metricName: string, data: Array<{ value: number | null }>) => {
        const validValues = data.map(d => d.value).filter(v => v !== null && !isNaN(v)) as number[];

        // For MSE and MAE, lower is better. For R² and SNR, higher is better.
        const lowerIsBetter = ['MSE', 'MAE', 'MSE/Variance', 'Total_Variation'].includes(metricName);

        if (validValues.length === 0) return null;

        return lowerIsBetter ? Math.min(...validValues) : Math.max(...validValues);
    };

    const renderMetricsTable = () => {
        if (metrics.length === 0) return null;

        const metricNames = [
            'MSE',
            'MAE',
            'R²',
            'Var_reduction',
            'SNR (dB)',
            'Total_Variation',
            'Smoothness_Ratio',
            'MSE/Variance',
            'Trade-off (λ=0.01)'
        ];

        // Build data structure: each item is an algorithm-phase combination
        const combinations: Array<{ id: string; label: string; metrics: EvaluationMetrics }> = [];

        metrics.forEach(metricData => {
            selectedPhases.forEach(phase => {
                const phaseMetrics = metricData.metrics[phase as keyof typeof metricData.metrics];
                if (phaseMetrics) {
                    const phaseLabel = phases.find(p => p.value === phase)?.label || phase;
                    combinations.push({
                        id: `${metricData.smoother}-${phase}`,
                        label: `${metricData.smoother} (${phaseLabel})`,
                        metrics: phaseMetrics
                    });
                }
            });
        });

        if (combinations.length === 0) return null;

        return (
            <div className={styles.metricsContainer}>
                <div className={styles.metricsHeader}>
                    <h2>Métricas de Evaluación</h2>
                    <div className={styles.metricsInfo}>
                        <span>Indicador: <strong>{metrics[0].indicator.replace(/_/g, ' ')}</strong></span>
                        <span>Periodo: <strong>{metrics[0].start_date} a {metrics[0].end_date}</strong></span>
                    </div>
                </div>

                <div className={styles.metricsTable}>
                    <table>
                        <thead>
                            <tr>
                                <th className={styles.metricName}>Métrica</th>
                                {combinations.map(comb => (
                                    <th key={comb.id} className={styles.columnHeader}>{comb.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {metricNames.map(metricName => {
                                // Get all values for this metric across combinations
                                const metricData = combinations.map(c => ({
                                    id: c.id,
                                    value: c.metrics[metricName as keyof EvaluationMetrics]
                                }));
                                const bestValue = getBestValueForMetric(metricName, metricData);

                                return (
                                    <tr key={metricName}>
                                        <td className={styles.metricName}>{metricName}</td>
                                        {combinations.map(comb => {
                                            const value = comb.metrics[metricName as keyof EvaluationMetrics];
                                            const valueDisplay = value !== null && !isNaN(value) ? value.toFixed(4) : 'N/A';
                                            const isBest = value !== null && !isNaN(value) && value === bestValue;

                                            return (
                                                <td key={comb.id} className={`${styles.metricValue} ${isBest ? styles.bestValue : ''}`}>
                                                    {valueDisplay}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.controlsContainer}>
                <div className={styles.controlSection}>
                    <h3>Configuración Principal</h3>
                    <div className={styles.controlGroup}>
                        <label>Block</label>
                        <select
                            value={selectedBlock}
                            onChange={(e) => setSelectedBlock(e.target.value)}
                        >
                            {BLOCKS.map(block => (
                                <option key={block} value={block}>
                                    {block.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.controlGroup}>
                        <label>Indicator</label>
                        <select
                            value={selectedIndicator}
                            onChange={(e) => setSelectedIndicator(e.target.value)}
                        >
                            {INDICATORS.map(ind => (
                                <option key={ind} value={ind}>
                                    {ind.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.controlGroup}>
                        <label>Resolution</label>
                        <select
                            value={resolution}
                            onChange={(e) => setResolution(e.target.value)}
                        >
                            <option value="minute">Minutal</option>
                            <option value="hour">Horaria</option>
                        </select>
                    </div>
                </div>

                <div className={styles.controlSection}>
                    <h3>Algoritmo de Suavizado</h3>
                    <div className={styles.checkboxGroup}>
                        <label>Seleccionar Suavizadores:</label>
                        <div className={styles.checkboxContainer}>
                            {algorithms.map(alg => (
                                <label key={alg.value} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={selectedAlgorithms.includes(alg.value)}
                                        onChange={() => toggleAlgorithm(alg.value)}
                                    />
                                    {alg.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={styles.checkboxGroup}>
                        <label>Seleccionar Fases:</label>
                        <div className={styles.checkboxContainer}>
                            {phases.map(phase => (
                                <label key={phase.value} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={selectedPhases.includes(phase.value)}
                                        onChange={() => togglePhase(phase.value)}
                                    />
                                    {phase.label}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.controlSection}>
                    <h3>Rango de Tiempo</h3>
                    <div className={styles.dateControls}>
                        <div className={styles.controlGroup}>
                            <label>Fecha Inicio</label>
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            />
                        </div>
                        <div className={styles.controlGroup}>
                            <label>Fecha Fin</label>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className={styles.timeControls}>
                        <div className={styles.controlGroup}>
                            <label>Hora Inicio</label>
                            <input
                                type="time"
                                value={timeRange.startHour}
                                onChange={(e) => setTimeRange(prev => ({ ...prev, startHour: e.target.value }))}
                            />
                        </div>
                        <div className={styles.controlGroup}>
                            <label>Hora Fin</label>
                            <input
                                type="time"
                                value={timeRange.endHour}
                                onChange={(e) => setTimeRange(prev => ({ ...prev, endHour: e.target.value }))}
                            />
                        </div>
                    </div>

                    <button
                        className={styles.evaluateButton}
                        onClick={fetchMetrics}
                        disabled={loading || selectedAlgorithms.length === 0 || selectedPhases.length === 0}
                    >
                        {loading ? 'Calculando...' : 'Calcular Métricas'}
                    </button>
                </div>
            </div>

            {selectedAlgorithms.length > 0 && (
                <div className={styles.paramsSection}>
                    <h2>Configuración de Hiperparámetros</h2>
                    {renderParameterInputs()}
                </div>
            )}

            {error && (
                <div className={styles.errorContainer}>
                    <p className={styles.errorMessage}>{error}</p>
                </div>
            )}

            {loading && !error && (
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Procesando datos y calculando métricas...</p>
                </div>
            )}

            {metrics.length > 0 && !loading && renderMetricsTable()}
        </div>
    );
};

export default EvaluationPage;
