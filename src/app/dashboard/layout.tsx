'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className={styles.dashboardContainer}>
                <nav className={styles.navSidebar}>
                    <div className={styles.navHeader}>
                        Energy Analytics
                    </div>
                    <Link href="/dashboard" className={styles.navLink}>Home</Link>
                    <Link href="/dashboard/data" className={styles.navLink}>Data</Link>
                    <Link href="/dashboard/operations" className={styles.navLink}>Operations</Link>
                    <Link href="/dashboard/analysis" className={styles.navLink}>Analysis</Link>
                </nav>

                <main className={styles.mainContent}>
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}
