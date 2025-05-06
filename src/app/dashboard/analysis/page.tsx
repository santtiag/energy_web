import Link from 'next/link';
import styles from './page.module.css';

const AnalysisPage = () => {
    return (
        <div className={styles.analysisContainer}>
            <h1>Analysis</h1>
            <ul className={styles.analysisLinks}>
                <li>
                    <Link href="/dashboard/analysis/artificial-intelligence">Inteligencia Artificial</Link>
                </li>
                <li>
                    <Link href="/dashboard/analysis/algoritms">Algoritmos</Link>
                </li>
            </ul>
        </div>
    );
};

export default AnalysisPage;
