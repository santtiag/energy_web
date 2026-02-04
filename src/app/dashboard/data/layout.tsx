'use client';

import React from 'react';
import HorizontalTabs from '@/components/HorizontalTabs';
import styles from './DataGeneration.module.css';

const dataTabs = [
    { label: 'Indicators Visualization', path: '/dashboard/data/indicators_visualization' },
    { label: 'Climate Variables', path: '/dashboard/data/climate_variables_visualization' },
    { label: 'Comparison', path: '/dashboard/data/comparison' },
];

export default function DataLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.dataContainer}>
            <h1 className={styles.pageTitle}>Data Visualization</h1>
            <HorizontalTabs tabs={dataTabs} basePath="/dashboard/data" />
            <div style={{ marginTop: '2rem' }}>
                {children}
            </div>
        </div>
    );
}
