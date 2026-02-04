'use client';
import { useRef, useState } from 'react';
import styles from '../upload/UploadComponent.module.css';

export default function UploadVariables() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const handleUpload = async () => {
        if (!fileInputRef.current?.files?.length) {
            alert('Selecciona un archivo');
            return;
        }
        const form = new FormData();
        form.append('file', fileInputRef.current.files![0]);

        try {
            setIsLoading(true);
            const resp = await fetch('http://localhost:5000/api/upload_variables', {
                method: 'POST',
                body: form,
            });
            const data = await resp.json();
            setMsg(resp.ok ? 'Archivo cargado con éxito' : `Error: ${data.detail}`);
        } catch (e) {
            setMsg(`Error de conexión: ${e instanceof Error ? e.message : 'unknown'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.uploadContainer}>
            <div className={styles.uploadCard}>
                <h2 className={styles.uploadTitle}>Upload climate variables</h2>

                <div className={styles.fileUploadWrapper}>
                    <input type="file" ref={fileInputRef} accept=".xlsx" className={styles.fileInput} />
                    <div className={styles.fileUploadHint}>
                        Select an .xlsx file
                    </div>
                </div>

                <button onClick={handleUpload} disabled={isLoading} className={styles.uploadButton}>
                    {isLoading ? 'Procesando...' : 'Upload'}
                </button>

                {msg && (
                    <div className={`${styles.resultMessage} ${msg.includes('Error') ? styles.error : styles.success}`}>
                        {msg}
                    </div>
                )}
            </div>

            {isLoading && (
                <div className={styles.loaderContainer}>
                    <div className={styles.loader}>
                        <div className={styles.spinner}></div>
                        <span className={styles.loaderText}>Cargando...</span>
                    </div>
                </div>
            )}
        </div>
    );
}
