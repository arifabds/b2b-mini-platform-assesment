
import { useState, useEffect, useRef } from 'react';
import { MockWebSocket } from '../../mocks/MockWebSocket';
import type { MetalIndex, ConnectionStatus } from '../../types/metal';

export function useMetalPrices(symbols: string[]) {
    const [indices, setIndices] = useState<MetalIndex[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
    const ws = useRef<MockWebSocket | null>(null);

    useEffect(() => {
        const streamNames = symbols.map(s => `${s.toLowerCase()}@miniTicker`).join('/');
        ws.current = new MockWebSocket(`wss://mock.stream?streams=${streamNames}`);
        let isMounted = true;

        ws.current.onopen = () => {
            if (isMounted) setConnectionStatus('connected');
        };

        ws.current.onclose = () => {
            if (isMounted) setConnectionStatus('disconnected');
        };

        ws.current.onerror = (error: Error) => {
            console.error('[useMetalPrices] WebSocket error:', error);
            if (isMounted) setConnectionStatus('error');
        };

        ws.current.onmessage = (event: { data: string }) => {
            if (!isMounted) return;
            try {
                const newIndices: MetalIndex[] = JSON.parse(event.data);
                setIndices(newIndices);
            } catch (e) {
                console.error('[useMetalPrices] Failed to parse message:', e);
            }
        };

        ws.current.connect();

        return () => {
            isMounted = false;
            ws.current?.close();
        };
    }, [symbols.join(',')]);

    return { indices, connectionStatus };
}