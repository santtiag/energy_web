'use client';

import React from 'react';
import HorizontalTabs from '@/components/HorizontalTabs';
import styles from './ManipulationGeneration.module.css';

const manipulationTabs = [
    { label: 'Upload', path: '/dashboard/manipulation/upload' },
    { label: 'Upload Variables', path: '/dashboard/manipulation/upload_variables' },
];

export default function ManipulationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.manipulationContainer}>
            <h1 className={styles.pageTitle}>Data Manipulation</h1>
            <HorizontalTabs tabs={manipulationTabs} basePath="/dashboard/manipulation" />
            <div style={{ marginTop: '2rem' }}>
                {children}
            </div>
        </div>
    );
}
