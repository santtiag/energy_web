export function formatXAxisTick(dateStr: string, isSingleDay: boolean): string {
    const date = new Date(dateStr);
    if (isSingleDay) {
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    }
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

export function formatIndicatorLabel(indicator: string): string {
    return indicator.replace(/_/g, ' ');
}
