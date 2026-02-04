import styles from './page.module.css';

const NotFoundPage = () => {
    return (
        <div className={styles.notFoundContainer}>
            <h1>404 - Not Found</h1>
            <p>Página no disponible</p>
        </div>
    );
};

export default NotFoundPage;
