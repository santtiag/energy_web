'use client';
import { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import styles from './Smoothers.module.css';
import { API_URL, RESOLUTIONS, INDICATORS, BLOCKS, INDICATOR_UNITS, DEFAULT_DATE_RANGE } from '../../../../lib/constants';
import { convertTimeToMinutes, convertMinutesToTime } from '../../../../lib/utils';

interface SmootherData {
    time: string;
    [key: string]: number | string;
}

const SmoothersPage = () => {
    const [data, setData] = useState<SmootherData[]>([]);
    const [loading, setLoading] = useState(false);
    const [intervalValue, setIntervalValue] = useState(1);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('kalman');
    const [selectedBlock, setSelectedBlock] = useState(BLOCKS[0]);
    const [selectedIndicator, setSelectedIndicator] = useState(INDICATORS[0]);
    const [resolution, setResolution] = useState(RESOLUTIONS[0]);
    const [selectedValue, setSelectedValue] = useState('1');
    const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
    const [isSingleDay, setIsSingleDay] = useState(true); // Nuevo estado para detectar si es solo un día


    // Detección de rango de un solo día
    useEffect(() => {
        setIsSingleDay(dateRange.start === dateRange.end);
    }, [dateRange]);


    const [timeRange, setTimeRange] = useState({
        startHour: '00:00',
        endHour: '23:59'
    });

    const colors = {
        // original: '#489DF7',
        // smoothed: 'red'

        original: '#17BECF',
        smoothed: '#FF2700'
    };

    //     #FF7F0E (Naranja brillante) – RGB: 255, 127, 14
    //     #17BECF (Cian claro) – RGB: 23, 190, 207
    //
    //     #FFD700 (Amarillo dorado) – RGB: 255, 215, 0
    //     #98DF8A (Verde lima) – RGB: 152, 223, 138
    //
    //     #FFBB78 (Naranja suave) – RGB: 255, 187, 120
    //     #2CA02C (Verde esmeralda) – RGB: 44, 160, 44



    // INFO: ALGORITHMS SMOOTHER
    const algorithms = [
        { value: 'kalman', label: 'Kalman' },
        { value: 'savitzky_golay', label: 'Savitzky Golay' },
        { value: 'whittaker', label: 'Whittaker' }
    ];

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

    const [showOriginalLine, setShowOriginalLine] = useState(true);
    const [showSmoothedLine, setShowSmoothedLine] = useState(true);

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
            let url = `${API_URL}/analysis/${selectedAlgorithm}/`;

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
                value: selectedValue,
                ...algorithmParams
            };


            const response = await axios.get(url, { params });

            const processedData = response.data.map((item: any) => ({
                // time: new Date(item.time).toLocaleTimeString(),
                time: item.time, // Almacenar el timestamp completo

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
    }, [selectedAlgorithm, selectedBlock, selectedIndicator, resolution, dateRange, selectedValue, kalmanParams, savParams, whitParams, timeRange.startHour, timeRange.endHour]);


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
                                            const newParams = { ...kalmanParams };
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
                                            const newParams = { ...savParams };
                                            newParams[key] = parseFloat(e.target.value);
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
                        <h4>Parámetros Whittaker</h4>
                        <div className={styles.parameterGrid}>
                            {Object.entries(whitParams).map(([key, value]) => (
                                <div key={key} className={styles.parameterItem}>
                                    <label>{key.toUpperCase()}</label>
                                    <input
                                        type="number"
                                        value={value}
                                        onChange={(e) => {
                                            const newParams = { ...whitParams };
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
                {/* Columna 1 */}

                <div className={styles.column1}>
                    <div className={styles.controlGroup}>
                        <label>Bloque</label>
                        <select value={selectedBlock}
                            onChange={(e) => setSelectedBlock(e.target.value)}
                        >
                            {BLOCKS.map(block => (
                                <option key={block} value={block}>{block.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.controlGroup}>
                        <label>Indicador</label>
                        <select value={selectedIndicator}
                            onChange={(e) => setSelectedIndicator(e.target.value)}
                        >
                            {INDICATORS.map(ind => (
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
                        <label>Fase</label>
                        <select
                            value={selectedValue}
                            onChange={(e) => setSelectedValue(e.target.value)}
                        >
                            <option value="1">Fase 1</option>
                            <option value="2">Fase 2</option>
                            <option value="3">Fase 3</option>
                        </select>
                    </div>

                    <div className={styles.controlGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={showOriginalLine}
                                onChange={() => setShowOriginalLine(!showOriginalLine)}
                            />
                            Datos originales
                        </label>
                    </div>
                    <div className={styles.controlGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={showSmoothedLine}
                                onChange={() => setShowSmoothedLine(!showSmoothedLine)}
                            />
                            Datos suavizados
                        </label>
                    </div>

                </div>



                {/* Columna 2 - Algoritmo y Parámetros */}
                <div className={styles.column2}>
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
                    {renderParameterInputs()}
                </div>



                {/* Columna 3 - Fechas, Horas y Opciones de Visualización */}
                <div className={styles.column3}>
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
                    </div>
                    <div className={styles.controlGroup}>
                        <label>Intervalo (Días múltiples)</label>
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
                                unit={INDICATOR_UNITS[selectedIndicator]}
                                width={80}
                                tickFormatter={(value) => `${value}`}
                                tick={{ fill: 'white' }}
                            ></YAxis>
                            <Tooltip></Tooltip>

                            {/* Línea Original */}
                            {showOriginalLine && (
                                <Line type="monotone"
                                    dataKey={`original_${selectedIndicator}_${selectedValue}`}
                                    stroke={colors.original}
                                    name={`Original ${selectedIndicator.replace('_', ' ')} - Fase ${selectedValue}`}
                                    dot={false}
                                ></Line>
                            )}

                            {/* Línea Suavizada */}
                            {showSmoothedLine && (
                                <Line type="monotone"
                                    dataKey={`smoothed_${selectedIndicator}_${selectedValue}`}
                                    stroke={colors.smoothed}
                                    name={`Suavizado ${selectedIndicator.replace('_', ' ')} - Fase ${selectedValue}`}
                                    strokeDasharray="5 5"
                                    dot={false}
                                ></Line>
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>


        </div>
    );
};

export default SmoothersPage;
