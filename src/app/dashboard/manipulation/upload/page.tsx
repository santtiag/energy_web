'use client'
import { useState, useRef } from 'react';
import styles from './UploadComponent.module.css';

export default function UploadComponent() {
    const [selectedBlock, setSelectedBlock] = useState<'A' | 'F'>('A');
    const [isLoading, setIsLoading] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async () => {
        if (!fileInputRef.current?.files?.length) {
            alert("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append("file", fileInputRef.current.files[0]);

        try {
            setIsLoading(true);
            const endpoint = selectedBlock === 'A'
                ? 'http://localhost:5000/api/upload_blq_a'
                : 'http://localhost:5000/api/upload_blq_f';

            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setResultMessage('File processed successfully');
            } else {
                setResultMessage(`Error: ${data.detail}`);
            }
        } catch (error) {
            setResultMessage(`Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.uploadContainer}>
            <div className={styles.uploadCard}>
                <h2 className={styles.uploadTitle}>Upload electrical indicator data</h2>

                <div className={styles.blockSelector}>
                    <label className={styles.radioLabel}>
                        <input type="radio"
                            value="A"
                            checked={selectedBlock === 'A'}
                            onChange={(e) => setSelectedBlock(e.target.value as 'A' | 'F')}
                            className={styles.radioInput}
                        />
                        <span className={styles.radioText}>Bloque A</span>
                    </label>
                    <label className={styles.radioLabel}>
                        <input type="radio"
                            value="F"
                            checked={selectedBlock === 'F'}
                            onChange={(e) => setSelectedBlock(e.target.value as 'A' | 'F')}
                            className={styles.radioInput}
                        />
                        <span className={styles.radioText}>Bloque F</span>
                    </label>
                </div>

                <div className={styles.fileUploadWrapper}>
                    <input type="file"
                        ref={fileInputRef}
                        accept=".xlsx"
                        className={styles.fileInput}
                    />
                    <div className={styles.fileUploadHint}>
                        Select an .xlsx file
                    </div>
                </div>

                <button
                    onClick={handleUpload}
                    className={styles.uploadButton}
                    disabled={isLoading}
                >
                    {isLoading ? 'Processing...' : 'Upload file'}
                </button>

                {resultMessage && (
                    <div className={`${styles.resultMessage} ${resultMessage.includes('Error') ? styles.error : styles.success}`}>
                        {resultMessage}
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
