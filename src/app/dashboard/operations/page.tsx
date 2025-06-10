import Link from 'next/link';
import styles from './page.module.css';

const OperationPage = () => {
    return (
        <div className={styles.operationContainer}>
            <h1>Generación de Operaciones</h1>
            <ul className={styles.operationLinks}>
                <li>
                    <Link href="/dashboard/operations/numerical-comparison">Comparación Numerica</Link>
                </li>
                <li>
                    <Link href="/dashboard/analysis/graphical-comparison">Comparación Gráfica</Link>
                </li>
            </ul>
        </div>
    );
};

export default OperationPage;
