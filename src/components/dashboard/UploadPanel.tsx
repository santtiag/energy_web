'use client';
import { useRef, useState } from 'react';
import { FileUp } from 'lucide-react';

export default function UploadPanel({
    title,
    description,
    resolveEndpoint,
    blockSelector = false,
}: {
    title: string;
    description: string;
    /** Recibe el bloque seleccionado ('A' | 'F') y retorna la URL del endpoint */
    resolveEndpoint: (block: 'A' | 'F') => string;
    blockSelector?: boolean;
}) {
    const [selectedBlock, setSelectedBlock] = useState<'A' | 'F'>('A');
    const [isLoading, setIsLoading] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async () => {
        if (!fileInputRef.current?.files?.length) {
            setResultMessage('Error: selecciona un archivo primero');
            return;
        }
        const formData = new FormData();
        formData.append('file', fileInputRef.current.files[0]);
        try {
            setIsLoading(true);
            setResultMessage('');
            const response = await fetch(resolveEndpoint(selectedBlock), {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setResultMessage(
                response.ok
                    ? 'Archivo procesado con éxito'
                    : `Error: ${data.detail}`
            );
        } catch (error) {
            setResultMessage(
                `Error de conexión: ${error instanceof Error ? error.message : 'desconocido'}`
            );
        } finally {
            setIsLoading(false);
        }
    };

    const isError = resultMessage.startsWith('Error');

    return (
        <div className="mx-auto max-w-xl">
            <h2 className="font-display text-2xl tracking-tight text-ink">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{description}</p>

            {blockSelector && (
                <div className="mt-6 space-y-1.5">
                    <span className="block text-[11px] uppercase tracking-[0.12em] text-ink-faint">
                        Bloque
                    </span>
                    <div className="flex border border-line">
                        {(['A', 'F'] as const).map((block, i) => (
                            <button
                                key={block}
                                type="button"
                                aria-pressed={selectedBlock === block}
                                onClick={() => setSelectedBlock(block)}
                                className={`h-9 flex-1 text-sm transition-colors ${
                                    i > 0 ? 'border-l border-line' : ''
                                } ${
                                    selectedBlock === block
                                        ? 'bg-accent-soft text-ink'
                                        : 'text-ink-muted hover:text-ink'
                                }`}
                            >
                                Bloque {block}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-line-strong px-6 py-12 text-center transition-colors hover:border-accent">
                <FileUp className="size-6 text-ink-faint" />
                <span className="text-sm text-ink-muted">
                    {fileName || 'Selecciona un archivo .xlsx'}
                </span>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept=".xlsx"
                    className="sr-only"
                    onChange={e => setFileName(e.target.files?.[0]?.name ?? '')}
                />
            </label>

            <button
                type="button"
                onClick={handleUpload}
                disabled={isLoading}
                className="mt-6 h-10 w-full bg-ink text-sm text-background transition-colors hover:bg-accent disabled:opacity-40"
            >
                {isLoading ? 'Procesando…' : 'Subir archivo'}
            </button>

            {resultMessage && (
                <p
                    className={`mt-4 text-sm ${isError ? 'text-negative' : 'text-positive'}`}
                    role="status"
                >
                    <span className="mr-2 text-[11px] uppercase tracking-[0.12em]">
                        {isError ? 'Error' : 'Listo'}
                    </span>
                    {resultMessage.replace(/^Error( de conexión)?: /, '')}
                </p>
            )}
        </div>
    );
}
