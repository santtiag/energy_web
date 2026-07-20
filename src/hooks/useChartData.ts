import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useDebouncedValue } from './useDebouncedValue';

export type ChartDataStatus = 'loading' | 'error' | 'empty' | 'ready';

interface UseChartDataOptions<T> {
    url: string;
    params: Record<string, unknown>;
    transform?: (raw: any) => T[];
    enabled?: boolean;
    debounceMs?: number;
}

export function useChartData<T>({
    url,
    params,
    transform,
    enabled = true,
    debounceMs = 450,
}: UseChartDataOptions<T>) {
    const [data, setData] = useState<T[]>([]);
    const [status, setStatus] = useState<ChartDataStatus>('loading');
    const [refreshKey, setRefreshKey] = useState(0);

    const requestKey = useMemo(() => JSON.stringify({ url, params }), [url, params]);
    const debouncedKey = useDebouncedValue(requestKey, debounceMs);

    useEffect(() => {
        if (!enabled) return;
        const { url: reqUrl, params: reqParams } = JSON.parse(debouncedKey);
        const controller = new AbortController();
        setStatus('loading');

        axios
            .get(reqUrl, { params: reqParams, signal: controller.signal })
            .then(response => {
                const rows = transform ? transform(response.data) : response.data;
                setData(rows);
                setStatus(rows.length === 0 ? 'empty' : 'ready');
            })
            .catch(error => {
                if (axios.isCancel(error)) return;
                console.error('Error fetching chart data:', error);
                setStatus('error');
            });

        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedKey, enabled, refreshKey]);

    return { data, status, retry: () => setRefreshKey(k => k + 1) };
}
