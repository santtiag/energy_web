export default function ChartStatePanel({
    status,
    height = 480,
    onRetry,
}: {
    status: 'error' | 'empty';
    height?: number;
    onRetry?: () => void;
}) {
    return (
        <div
            className="flex flex-col items-center justify-center border border-line px-6 text-center"
            style={{ height: height + 28 }}
        >
            <p className="text-[11px] uppercase tracking-[0.3em] text-ink-faint">
                {status === 'error' ? 'Sin conexión' : 'Sin resultados'}
            </p>
            <p className="mt-3 font-display text-2xl tracking-tight text-ink">
                {status === 'error'
                    ? 'Fuente de datos no disponible'
                    : 'No hay datos en este rango'}
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">
                {status === 'error'
                    ? 'No se pudo contactar la API. Verifica que el servicio esté encendido.'
                    : 'Prueba con otro rango de fechas u otra resolución.'}
            </p>
            {status === 'error' && onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-6 border-b border-accent pb-0.5 text-sm text-accent transition-opacity hover:opacity-70"
                >
                    Reintentar
                </button>
            )}
        </div>
    );
}
