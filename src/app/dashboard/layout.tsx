'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import styles from './DashboardLayout.module.css';
import { useAuth } from '@/context/AuthContext'; // Importa useAuth
import { useRouter } from 'next/navigation'; // Importa useRouter

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { logout } = useAuth(); // Obtiene la función logout del contexto
    const router = useRouter(); // Obtiene la instancia del router

    const handleLogout = () => {
        logout(); // Llama a la función logout
        router.push('/login'); // Redirige al usuario a la página de login
    };
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
                    <Link href="/dashboard/upload" className={styles.navLink}>Upload</Link>
                    <button onClick={handleLogout} className={styles.navButton}>Logout</button>
                </nav>

                <main className={styles.mainContent}>
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}
