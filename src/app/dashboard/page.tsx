'use client';
import styles from './Dashboard.module.css';
import Link from 'next/link';
export default function DashboardPage() {
    return (
        <div className={styles.welcomeContainer}>
            <h1 className={styles.welcomeTitle}>Bienvenido al Panel de Control</h1>
            <div className={styles.cardGrid}>
                <div className={styles.featureCard}>
                    <h2>Visualización de Datos</h2>
                    <p>Accede a gráficos en tiempo real y análisis detallados</p>
                    <Link href="/dashboard/data" className={styles.cardLink}>Data</Link>
                </div>

                <div className={styles.featureCard}>
                    <h2>Operaciones</h2>
                    <p>Realiza cálculos y ajustes de parámetros</p>
                    <Link href="/dashboard/operations" className={styles.cardLink}>Operationos</Link>
                </div>

                <div className={styles.featureCard}>
                    <h2>Análisis Avanzados</h2>
                    <p>Utiliza herramientas de análisis predictivo</p>
                    <Link href="/dashboard/analysis" className={styles.cardLink}>Analysis</Link>
                </div>
            </div>
        </div>
    );
}
