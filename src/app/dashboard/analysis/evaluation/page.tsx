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

const EvaluationPage = () => {
    const [metrics, setMetrics] = useState<EvaluationResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedAlgorithm, setSelectedAlgorithm] = useState('kalman');
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

    const fetchMetrics = async () => {
        try {
            setLoading(true);
            setError(null);

            const startDateTime = `${dateRange.start}T${timeRange.startHour}:00`;
            const endDateTime = `${dateRange.end}T${timeRange.endHour}:00`;

            let url = `${API_URL}/analysis/evaluation/${selectedAlgorithm}/`;

            const algorithmParams = {
                kalman: kalmanParams,
                savitzky_golay: savParams,
                whittaker: whitParams
            }[selectedAlgorithm];

            const params = {
                start_date: startDateTime,
                end_date: endDateTime,
                resolution,
                indicator: selectedIndicator,
                table_name: selectedBlock,
                ...algorithmParams
            };

            const response = await axios.get<EvaluationResponse>(url, { params });
            setMetrics(response.data);
        } catch (err) {
            console.error('Error fetching metrics:', err);
            setError('Error al obtener las métricas de evaluación');
            setMetrics(null);
        } finally {
            setLoading(false);
        }
    };

    const renderParameterInputs = () => {
        switch (selectedAlgorithm) {
            case 'kalman':
                return (
                    <div className={styles.parameterGroup}>
                        <h3>Parámetros Kalman</h3>
                        <div className={styles.parameterGrid}>
                            {Object.entries(kalmanParams).map(([key, value]) => (
                                <div key={key} className={styles.parameterItem}>
                                    <label>{key.replace(/_/g, ' ')}</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={value}
                                        onChange={(e) => {
                                            const newParams = { ...kalmanParams };
                                            newParams[key as keyof typeof kalmanParams] = parseFloat(e.target.value) || 0;
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
                        <h3>Parámetros Savitzky-Golay</h3>
                        <div className={styles.parameterGrid}>
                            {Object.entries(savParams).map(([key, value]) => (
                                <div key={key} className={styles.parameterItem}>
                                    <label>{key.replace(/_/g, ' ')}</label>
                                    <input
                                        type="number"
                                        value={value}
                                        onChange={(e) => {
                                            const newParams = { ...savParams };
                                            newParams[key as keyof typeof savParams] = parseInt(e.target.value) || 0;
                                            setSavParams(newParams);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'whittaker':
                return (
                    <div className={styles.parameterGroup}>
                        <h3>Parámetros Whittaker</h3>
                        <div className={styles.parameterGrid}>
                            {Object.entries(whitParams).map(([key, value]) => (
                                <div key={key} className={styles.parameterItem}>
                                    <label>{key.toUpperCase()}</label>
                                    <input
                                        type="number"
                                        value={value}
                                        onChange={(e) => {
                                            const newParams = { ...whitParams };
                                            newParams[key as keyof typeof whitParams] = parseFloat(e.target.value) || 0;
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

    const renderMetricsTable = () => {
        if (!metrics) return null;

        const phases = ['value_1', 'value_2', 'value_3'];
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

        return (
            <div className={styles.metricsContainer}>
                <div className={styles.metricsHeader}>
                    <h2>Métricas de Evaluación</h2>
                    <div className={styles.metricsInfo}>
                        <span>Indicador: <strong>{metrics.indicator.replace(/_/g, ' ')}</strong></span>
                        <span>Suavizador: <strong>{metrics.smoother}</strong></span>
                        <span>Periodo: <strong>{metrics.start_date} a {metrics.end_date}</strong></span>
                    </div>
                </div>

                <div className={styles.metricsTable}>
                    <table>
                        <thead>
                            <tr>
                                <th>Métrica</th>
                                <th>Fase 1</th>
                                <th>Fase 2</th>
                                <th>Fase 3</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metricNames.map(metricName => (
                                <tr key={metricName}>
                                    <td className={styles.metricName}>{metricName}</td>
                                    {phases.map(phase => (
                                        <td key={phase} className={styles.metricValue}>
                                            {metrics.metrics[phase as keyof typeof metrics.metrics][metricName as keyof EvaluationMetrics]?.toFixed(4) || 'N/A'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.metricsSummary}>
                    <h3>Resumen</h3>
                    <p>
                        El suavizador <strong>{metrics.smoother}</strong> ha sido aplicado al indicador <strong>{metrics.indicator.replace(/_/g, ' ')}</strong> entre
                        <strong> {metrics.start_date}</strong> y <strong>{metrics.end_date}</strong>.
                    </p>
                    <div className={styles.summaryStats}>
                        {phases.map(phase => {
                            const phaseMetrics = metrics.metrics[phase as keyof typeof metrics.metrics];
                            const r2 = phaseMetrics['R²'];
                            const snr = phaseMetrics['SNR (dB)'];
                            return (
                                <div key={phase} className={styles.phaseSummary}>
                                    <h4>Fase {phase.charAt(phase.length - 1)}</h4>
                                    <p>R²: {r2 !== null ? (r2 * 100).toFixed(2) + '%' : 'N/A'} de varianza explicada</p>
                                    <p>SNR: {snr !== null ? snr.toFixed(2) + ' dB' : 'N/A'} de relación señal-ruido</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <h1>Evaluación de Suavizadores</h1>

            <div className={styles.controlsContainer}>
                <div className={styles.controlSection}>
                    <h3>Configuración Principal</h3>
                    <div className={styles.controlGroup}>
                        <label>Bloque</label>
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
                        <label>Indicador</label>
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
                        <label>Resolución</label>
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
                    <div className={styles.controlGroup}>
                        <label>Suavizador</label>
                        <select
                            value={selectedAlgorithm}
                            onChange={(e) => setSelectedAlgorithm(e.target.value)}
                        >
                            {algorithms.map(alg => (
                                <option key={alg.value} value={alg.value}>
                                    {alg.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    {renderParameterInputs()}
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
                        disabled={loading}
                    >
                        {loading ? 'Calculando...' : 'Calcular Métricas'}
                    </button>
                </div>
            </div>

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

            {metrics && !loading && renderMetricsTable()}
        </div>
    );
};

export default EvaluationPage;
