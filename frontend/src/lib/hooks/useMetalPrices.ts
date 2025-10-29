import { useState, useEffect, useMemo, useRef } from 'react';
import { MockWebSocket } from '../../mocks/MockWebSocket';

export interface MetalPrice {
    symbol: string;
    name: string;
    price: number;
    dailyChange: number;
    dailyChangePercent: number;
    isPositive: boolean;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

const SYMBOL_NAMES: Record<string, string> = {
    'XAUTUSDT': 'Gold (XAU/USDT)',
    'XAGUSDT': 'Silver (XAG/USDT)',
};

export function useMetalPrices(symbols: string[]) {
    const [prices, setPrices] = useState<Record<string, MetalPrice>>({});
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
    const ws = useRef<MockWebSocket | null>(null);

    // Key dependency to prevent infinite re-renders from the 'symbols' array.
    const symbolsKey = JSON.stringify(symbols);

    useEffect(() => {
        if (!symbols || symbols.length === 0) {
            setConnectionStatus('disconnected');
            return;
        }

        const streamNames = symbols.map(s => `${s.toLowerCase()}@miniTicker`).join('/');

        // Always use the mock WebSocket in all environments.
        ws.current = new MockWebSocket(`wss://mock.stream/${streamNames}`);

        let isMounted = true;

        // 1. Attach event handlers to the mock instance first.
        ws.current.onopen = () => { if (isMounted) setConnectionStatus('connected'); };
        ws.current.onclose = () => { if (isMounted) setConnectionStatus('disconnected'); };
        ws.current.onerror = (error: Error) => {
            console.error('[useMetalPrices] MockWebSocket error:', error);
            if (isMounted) setConnectionStatus('error');
        };
        ws.current.onmessage = (event: { data: string }) => {
            if (!isMounted) return;
            try {
                const message = JSON.parse(event.data);
                const payload = message.data;
                if (!payload || !payload.s) return;

                const currentPrice = parseFloat(payload.c);
                const openPrice = parseFloat(payload.o);
                const dailyChange = currentPrice - openPrice;
                const dailyChangePercent = (openPrice !== 0) ? (dailyChange / openPrice) * 100 : 0;

                const newPriceData: MetalPrice = {
                    symbol: payload.s,
                    name: SYMBOL_NAMES[payload.s] || payload.s,
                    price: currentPrice,
                    dailyChange: dailyChange,
                    dailyChangePercent: isFinite(dailyChangePercent) ? dailyChangePercent : 0,
                    isPositive: dailyChange >= 0,
                };

                // Use functional update to prevent stale state issues.
                setPrices(prevPrices => ({ ...prevPrices, [payload.s]: newPriceData }));
            } catch (e) { console.error("Error processing WebSocket message:", e); }
        };

        // 2. Explicitly initiate the connection after handlers are set.
        ws.current.connect();

        // Cleanup: close connection when the component unmounts.
        return () => {
            isMounted = false;
            ws.current?.close();
        };

    }, [symbolsKey]);

    // Memoize the derived array to ensure a stable reference for consumers.
    const memoizedPrices = useMemo(() => {
        return Object.values(prices).sort((a, b) => a.symbol.localeCompare(b.symbol));
    }, [prices]);

    return {
        prices: memoizedPrices,
        connectionStatus,
    };
}