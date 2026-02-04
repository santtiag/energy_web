'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import styles from './DashboardLayout.module.css';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
    FiLogOut,
    FiChevronLeft,
    FiChevronRight,
    FiDatabase,
    FiBarChart,
    FiPieChart
} from 'react-icons/fi';
import { useState } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { logout } = useAuth();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <ProtectedRoute>
            <div className={styles.dashboardContainer}>
                <nav className={`${styles.navSidebar} ${isCollapsed ? styles.collapsed : ''}`}>
                    <div className={styles.navHeader}>
                        {isCollapsed ? 'EV' : 'Energética Vatio'}
                    </div>

                    <div className={styles.navLinks}>
                        <Link href="/dashboard/data" className={styles.navLink}>
                            <FiBarChart size={20} style={{ marginRight: isCollapsed ? 0 : 8 }} />
                            {!isCollapsed && 'Data'}
                        </Link>
                        <Link href="/dashboard/analysis" className={styles.navLink}>
                            <FiPieChart size={20} style={{ marginRight: isCollapsed ? 0 : 8 }} />
                            {!isCollapsed && 'Analysis'}
                        </Link>
                        <Link href="/dashboard/manipulation" className={styles.navLink}>
                            <FiDatabase size={20} style={{ marginRight: isCollapsed ? 0 : 8 }} />
                            {!isCollapsed && 'Manipulation'}
                        </Link>
                    </div>

                    <div className={styles.navFooter}>
                        <button onClick={handleLogout} className={styles.navButton}>
                            <FiLogOut size={20} style={{ marginRight: isCollapsed ? 0 : 8 }} />
                            {!isCollapsed && 'Logout'}
                        </button>

                        <button onClick={toggleSidebar} className={styles.collapseButton}>
                            {isCollapsed ? (
                                <FiChevronRight size={20} />
                            ) : (
                                <FiChevronLeft size={20} />
                            )}
                        </button>
                    </div>
                </nav>
                <main className={`${styles.mainContent} ${isCollapsed ? styles.mainContentCollapsed : ''}`}>
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}
