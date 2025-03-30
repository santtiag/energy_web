'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './OperationsGeneration.module.css';

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
}

const OperationsGeneration = () => {
    const [comparisonBlocks, setComparisonBlocks] = useState<ComparisonBlock[]>([
        {
            id: Date.now(),
            block: 'blq_a',
            indicator: 'power_factor',
            operation: 'maximus',
            startDate: '2025-01-01',
            endDate: '2025-01-02'
        }
    ]);

    const [loading, setLoading] = useState<{ [key: number]: boolean }>({});

    const indicators = ['voltage', 'current', 'active_power', 'reactive_power', 'power_factor'];
    const blocks = ['blq_a', 'blq_b', 'blq_c', 'blq_d', 'blq_e', 'blq_f'];
    const operations = [
        { value: 'maximus', label: 'Máximos' },
        { value: 'lows', label: 'Mínimos' },
        { value: 'average', label: 'Promedios' }
    ];

    const fetchOperationData = async (block: ComparisonBlock) => {
        setLoading(prev => ({ ...prev, [block.id]: true }));

        try {
            const response = await axios.get(
                `http://localhost:5000/api/operations/${block.operation}/`, {
                params: {
                    start_date: block.startDate,
                    end_date: block.endDate,
                    indicator: block.indicator,
                    table_name: block.block
                }
            });

            const updatedBlocks = comparisonBlocks.map(b =>
                b.id === block.id ? { ...b, data: response.data } : b
            );

            setComparisonBlocks(updatedBlocks);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(prev => ({ ...prev, [block.id]: false }));
        }
    };

    const addComparisonBlock = () => {
        const newBlock: ComparisonBlock = {
            id: Date.now(),
            block: 'blq_a',
            indicator: 'power_factor',
            operation: 'maximus',
            startDate: comparisonBlocks[0].startDate,
            endDate: comparisonBlocks[0].endDate
        };
        setComparisonBlocks([...comparisonBlocks, newBlock]);
    };

    const updateBlock = (id: number, field: string, value: string) => {
        const updatedBlocks = comparisonBlocks.map(block =>
            block.id === id ? { ...block, [field]: value } : block
        );
        setComparisonBlocks(updatedBlocks);
    };

    const removeBlock = (id: number) => {
        setComparisonBlocks(comparisonBlocks.filter(block => block.id !== id));
    };

    return (
        <div className="main-container">
            <div className={styles.header}>
                <h1>Comparación de Operaciones</h1>
                <button onClick={addComparisonBlock} className={styles.addButton}>
                    + Añadir Bloque
                </button>
            </div>

            <div className={styles.comparisonContainer}>
                {comparisonBlocks.map((block, index) => (
                    <div key={block.id} className={styles.comparisonBlock}>
                        <div className={styles.blockHeader}>
                            <h3>Bloque de Comparación #{index + 1}</h3>
                            {comparisonBlocks.length > 1 && (
                                <button
                                    onClick={() => removeBlock(block.id)}
                                    className={styles.removeButton}
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        <div className={styles.controlsGrid}>
                            <div className={styles.controlGroup}>
                                <label>Bloque</label>
                                <select value={block.block}
                                    onChange={(e) => updateBlock(block.id, 'block', e.target.value)}
                                >
                                    {blocks.map(b => (
                                        <option key={b} value={b}>{b.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.controlGroup}>
                                <label>Indicador</label>
                                <select value={block.indicator}
                                    onChange={(e) => updateBlock(block.id, 'indicator', e.target.value)}
                                >
                                    {indicators.map(ind => (
                                        <option key={ind} value={ind}>
                                            {ind.replace('_', ' ').toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.controlGroup}>
                                <label>Operación</label>
                                <select value={block.operation}
                                    onChange={(e) => updateBlock(block.id, 'operation', e.target.value)}
                                >
                                    {operations.map(op => (
                                        <option key={op.value} value={op.value}>
                                            {op.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.controlGroup}>
                                <label>Fecha Inicio</label>
                                <input type="date"
                                    value={block.startDate}
                                    onChange={(e) => updateBlock(block.id, 'startDate', e.target.value)}
                                />
                            </div>

                            <div className={styles.controlGroup}>
                                <label>Fecha Fin</label>
                                <input type="date"
                                    value={block.endDate}
                                    onChange={(e) => updateBlock(block.id, 'endDate', e.target.value)}
                                />
                            </div>

                            <button
                                onClick={() => fetchOperationData(block)}
                                className={styles.fetchButton}
                                disabled={loading[block.id]}
                            >
                                {loading[block.id] ? 'Cargando...' : 'Actualizar Datos'}
                            </button>
                        </div>

                        {block.data?.map((data, dataIndex) => (
                            <div key={dataIndex} className={styles.resultsCard}>
                                <h4>{data.indicator_name.replace('_', ' ').toUpperCase()}</h4>
                                <div className={styles.valuesGrid}>
                                    {Object.entries(data)
                                        .filter(([key]) => key.includes('value_'))
                                        .map(([key, value]) => (
                                            <div key={key} className={styles.valueItem}>
                                                <div className={styles.valueHeader}>
                                                    <span>{key.replace(/_/g, ' ').toUpperCase()}</span>
                                                    <span className={styles.valueUnit}>
                                                        {block.indicator === 'power_factor' ? '' :
                                                            block.indicator === 'voltage' ? 'V' :
                                                                block.indicator === 'current' ? 'A' :
                                                                    block.indicator === 'active_power' ? 'W' : 'VAr'}
                                                    </span>
                                                </div>
                                                <div className={styles.value}>
                                                    {typeof value === 'number' ? value.toFixed(3) : value}
                                                </div>
                                                {data[`time_${key.split('_').pop()}`] && (
                                                    <div className={styles.timeStamp}>
                                                        {new Date(data[`time_${key.split('_').pop()}`] as string)
                                                            .toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OperationsGeneration;
