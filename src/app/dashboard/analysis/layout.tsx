'use client';

import React from 'react';
import HorizontalTabs from '@/components/HorizontalTabs';
import styles from './AnalysisGeneration.module.css';

const analysisTabs = [
    { label: 'Smoothers', path: '/dashboard/analysis/smoothers' },
    { label: 'Evaluation', path: '/dashboard/analysis/evaluation' },
    { label: 'Predictions', path: '/dashboard/analysis/predictions' },
    { label: 'About', path: '/dashboard/analysis/about' },
];

export default function AnalysisLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.analysisContainer}>
            <h1 className={styles.pageTitle}>Data Analysis</h1>
            <HorizontalTabs tabs={analysisTabs} basePath="/dashboard/analysis" />
            <div style={{ marginTop: '2rem' }}>
                {children}
            </div>
        </div>
    );
}
