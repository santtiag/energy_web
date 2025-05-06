import Link from 'next/link';
import styles from './page.module.css';

const AlgoritmosPage = () => {
    return (
        <div className={styles.algoritmosContainer}>
            <h1>Algoritmos</h1>
            <ul className={styles.algoritmosLinks}>
                <li>
                    <Link href="/dashboard/analysis/algoritms/smoothers">Smoothers</Link>
                </li>
                <li>
                    <Link href="/dashboard/analysis/algoritms/otros">Otros</Link>
                </li>
            </ul>
        </div>
    );
};

export default AlgoritmosPage;
