import { useState, useEffect, useRef } from 'react';
import type { MetalIndex, ConnectionStatus, Binance24hrTicker } from '../../types/metal';
import {
    INDICES_CONFIG,
    TROY_OUNCE_TO_GRAM,
    GOLD_TYPES,
    WS_RECONNECT_DELAY,
    WS_PING_INTERVAL,
    BINANCE_WS_BASE
} from '../../constants/metalPrices';

// Track if we've already initialized to prevent double mounting in strict mode
let hasInitialized = false;

export function useMetalPrices(symbols: string[]) {
    const [indices, setIndices] = useState<MetalIndex[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');

    // WebSocket refs for each pair
    const wsRef = useRef<Map<string, WebSocket>>(new Map());
    const reconnectTimeoutRef = useRef<Map<string, number>>(new Map());
    const pingIntervalRef = useRef<Map<string, number>>(new Map());
    const priceDataRef = useRef<Map<string, Binance24hrTicker>>(new Map());
    const symbolsRef = useRef(symbols);

    useEffect(() => {
        symbolsRef.current = symbols;
    }, [symbols]);

    useEffect(() => {
        if (hasInitialized) {
            console.log('[DEBUG] Already initialized, skipping...');
            return;
        }

        hasInitialized = true;
        console.log('[DEBUG] Initializing WebSocket connections...');

        const updateIndices = () => {
            const uniquePairs = [...new Set(INDICES_CONFIG.map(c => c.binancePair.toLowerCase()))];
            const hasAllData = uniquePairs.every(pair => priceDataRef.current.has(pair));
            if (!hasAllData) return;

            const newIndices = symbolsRef.current
                .map(symbol => {
                    const config = INDICES_CONFIG.find(c => c.symbol === symbol);
                    if (!config) return null;

                    const tickerData = priceDataRef.current.get(config.binancePair.toLowerCase());
                    if (!tickerData) return null;

                    const troyOuncePrice = parseFloat(tickerData.c);
                    const pricePerGram = troyOuncePrice / TROY_OUNCE_TO_GRAM;
                    const finalPricePerGram = config.conversionRate
                        ? pricePerGram * config.conversionRate
                        : pricePerGram;

                    const dailyChangePercent = parseFloat(tickerData.P);

                    return {
                        symbol: config.symbol,
                        name: config.name,
                        currency: config.currency,
                        currencySymbol: config.currencySymbol,
                        details: GOLD_TYPES.map(goldType => {
                            const price = goldType.type === 'raw'
                                ? troyOuncePrice * (config.conversionRate ?? 1)
                                : finalPricePerGram * goldType.weight;

                            const dailyChange = (price * dailyChangePercent) / 100;

                            return {
                                type: goldType.type,
                                displayName: goldType.displayName,
                                price,
                                dailyChange,
                                dailyChangePercent,
                                isPositive: dailyChange >= 0,
                                weight: goldType.weight
                            };
                        })
                    };
                })
                .filter((index): index is MetalIndex => index !== null);

            setIndices(newIndices);
        };

        const connectWebSocket = (pair: string) => {
            const lowerPair = pair.toLowerCase();
            if (wsRef.current.has(lowerPair)) {
                const existingWs = wsRef.current.get(lowerPair)!;
                if (existingWs.readyState === WebSocket.OPEN || existingWs.readyState === WebSocket.CONNECTING) {
                    console.log(`[DEBUG] WebSocket for ${pair} already exists, skipping...`);
                    return;
                }
            }

            const wsUrl = `${BINANCE_WS_BASE}/${lowerPair}@ticker`;
            console.log('[DEBUG] Connecting:', wsUrl);
            setConnectionStatus('connecting');

            const ws = new WebSocket(wsUrl);
            wsRef.current.set(lowerPair, ws);

            ws.onopen = () => {
                console.log(`[DEBUG] ✅ WebSocket connected successfully: ${pair}`);
                setConnectionStatus('connected');

                const pingId = window.setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ method: 'ping' }));
                    }
                }, WS_PING_INTERVAL);
                pingIntervalRef.current.set(lowerPair, pingId);
            };

            ws.onmessage = (event) => {
                try {
                    const raw = JSON.parse(event.data);
                    const ticker = raw.data ? raw.data : raw;

                    if (ticker.e === '24hrTicker' && ticker.s) {
                        const pairKey = ticker.s.toLowerCase();
                        priceDataRef.current.set(pairKey, ticker);
                        updateIndices();
                    }
                } catch (error) {
                    console.error('[useMetalPrices] Critical Parse Error:', error, 'Raw Data:', event.data);
                }
            };

            ws.onerror = (error) => {
                console.error(`[DEBUG] ❌ WebSocket error for ${pair}:`, error);
                setConnectionStatus('error');
            };

            ws.onclose = (event) => {
                console.log(`[DEBUG] 🔌 WebSocket closed for ${pair}:`, event.code, event.reason);
                setConnectionStatus('disconnected');

                // Clear ping
                const pingId = pingIntervalRef.current.get(lowerPair);
                if (pingId) {
                    clearInterval(pingId);
                    pingIntervalRef.current.delete(lowerPair);
                }

                // Reconnect
                if (hasInitialized) {
                    const timeoutId = window.setTimeout(() => {
                        console.log(`[DEBUG] 🔄 Reconnecting WebSocket for ${pair}...`);
                        connectWebSocket(pair);
                    }, WS_RECONNECT_DELAY);
                    reconnectTimeoutRef.current.set(lowerPair, timeoutId);
                }
            };
        };

        // Connect all pairs
        const uniquePairs = [...new Set(INDICES_CONFIG.map(c => c.binancePair))];
        uniquePairs.forEach(connectWebSocket);

        return () => {
            console.log('[DEBUG] Cleanup - resetting initialization flag');
            hasInitialized = false;

            // Clear reconnects
            reconnectTimeoutRef.current.forEach(id => clearTimeout(id));
            reconnectTimeoutRef.current.clear();

            // Clear pings
            pingIntervalRef.current.forEach(id => clearInterval(id));
            pingIntervalRef.current.clear();

            // Close all WebSockets
            wsRef.current.forEach(ws => ws.close());
            wsRef.current.clear();
        };
    }, []);

    return { indices, connectionStatus };
}