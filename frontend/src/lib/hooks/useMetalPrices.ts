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
    const ws = useRef<WebSocket | MockWebSocket | null>(null);

    // Key dependency to prevent infinite re-renders from the 'symbols' array.
    const symbolsKey = JSON.stringify(symbols);

    useEffect(() => {
        if (!symbols || symbols.length === 0) {
            setConnectionStatus('disconnected');
            return;
        }

        const streamNames = symbols.map(s => `${s.toLowerCase()}@miniTicker`).join('/');

        // Switch between mock and real WebSocket based on the environment.
        if (import.meta.env.DEV) {
            const mockUrl = `wss://mock.stream.binance.vision:9443/stream?streams=${streamNames}`;
            ws.current = new MockWebSocket(mockUrl);
        } else {
            const realUrl = `wss://stream.binance.vision:9443/stream?streams=${streamNames}`;
            ws.current = new WebSocket(realUrl);
        }

        setConnectionStatus('connecting');
        let isMounted = true;

        ws.current.onopen = () => { if (isMounted) setConnectionStatus('connected'); };
        ws.current.onclose = () => { if (isMounted) setConnectionStatus('disconnected'); };
        ws.current.onerror = (error: Event) => {
            console.error('[useMetalPrices] WebSocket error:', error);
            if (isMounted) setConnectionStatus('error');
        };
        ws.current.onmessage = (event: MessageEvent) => {
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

        // Cleanup: close connection when component unmounts or symbols change.
        return () => {
            isMounted = false;
            ws.current?.close();
        };

    }, [symbolsKey]);

    // Memorize the derived array to ensure a stable reference for consumers.
    const memoizedPrices = useMemo(() => {
        return Object.values(prices).sort((a, b) => a.symbol.localeCompare(b.symbol));
    }, [prices]);

    return {
        prices: memoizedPrices,
        connectionStatus,
    };
}