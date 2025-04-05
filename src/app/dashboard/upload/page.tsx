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
      alert("Por favor seleccione un archivo");
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
        setResultMessage('Archivo procesado exitosamente');
      } else {
        setResultMessage(`Error: ${data.detail}`);
      }
    } catch (error) {
      setResultMessage(`Error de conexión: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <h2>Subir datos de medición</h2>
      
      <div className={styles.blockSelector}>
        <label>
          <input             type="radio"
            value="A"
            checked={selectedBlock === 'A'}
            onChange={(e) => setSelectedBlock(e.target.value as 'A' | 'F')}
          />
          Bloque A
        </label>
        <label>
          <input             type="radio"
            value="F"
            checked={selectedBlock === 'F'}
            onChange={(e) => setSelectedBlock(e.target.value as 'A' | 'F')}
          />
          Bloque F
        </label>
      </div>

      <input         type="file"
        ref={fileInputRef}
        accept=".xlsx"
        className={styles.fileInput}
      />
      
      <button 
        onClick={handleUpload}
        className={styles.uploadButton}
        disabled={isLoading}
      >
        {isLoading ? 'Procesando...' : 'Subir Archivo'}
      </button>

      {resultMessage && <div className={styles.resultMessage}>{resultMessage}</div>}

      {isLoading && (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}>
            <span className={styles.loaderText}>Cargando...</span>
          </div>
        </div>
      )}
    </div>
  );
}