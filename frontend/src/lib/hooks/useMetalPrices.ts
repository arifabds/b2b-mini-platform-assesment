import { useState, useEffect, useRef } from 'react';
import type { MetalIndex, ConnectionStatus, Binance24hrTicker } from '../../types/metal';
import {
    INDICES_CONFIG,
    TROY_OUNCE_TO_GRAM,
    GOLD_TYPES,
    WS_RECONNECT_DELAY,
    WS_PING_INTERVAL
} from '../../constants/metalPrices';

// Track if we've already initialized to prevent double mounting in strict mode
let hasInitialized = false;

export function useMetalPrices(symbols: string[]) {
    const [indices, setIndices] = useState<MetalIndex[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<number | undefined>(undefined);
    const pingIntervalRef = useRef<number | undefined>(undefined);
    const priceDataRef = useRef<Map<string, Binance24hrTicker>>(new Map());
    const symbolsRef = useRef(symbols);

    useEffect(() => {
        symbolsRef.current = symbols;
    }, [symbols]);

    useEffect(() => {
        // Skip if already initialized (strict mode double mount)
        if (hasInitialized) {
            console.log('[DEBUG] Already initialized, skipping...');
            return;
        }

        hasInitialized = true;
        console.log('[DEBUG] Initializing WebSocket connection...');

        const updateIndices = () => {
            /*const uniquePairs = [...new Set(INDICES_CONFIG.map(c => c.binancePair))];
            const hasAllData = uniquePairs.every(pair => priceDataRef.current.has(pair));

            if (!hasAllData) return;*/

            const newIndices = symbolsRef.current
                .map(symbol => {
                    const config = INDICES_CONFIG.find(c => c.symbol === symbol);
                    if (!config) return null;

                    const tickerData = priceDataRef.current.get(config.binancePair);
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
                            const price = finalPricePerGram * goldType.weight;
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

        const connectWebSocket = () => {
            if (wsRef.current) {
                if (wsRef.current.readyState === WebSocket.OPEN ||
                    wsRef.current.readyState === WebSocket.CONNECTING) {
                    console.log('[DEBUG] Connection already exists, skipping...');
                    return;
                }
            }

            const uniquePairs = [...new Set(INDICES_CONFIG.map(c => c.binancePair))];
            const streams = uniquePairs.map(pair => `${pair}@ticker`).join('/');
            const wsUrl = `wss://data-stream.binance.vision:443/ws/${streams}`;

            console.log('[DEBUG] Connecting to:', wsUrl);
            setConnectionStatus('connecting');

            try {
                const ws = new WebSocket(wsUrl);
                wsRef.current = ws;

                console.log('[DEBUG] WebSocket created, readyState:', ws.readyState);

                ws.onopen = () => {
                    console.log('[DEBUG] ✅ WebSocket connected successfully');
                    setConnectionStatus('connected');

                    pingIntervalRef.current = window.setInterval(() => {
                        if (ws.readyState === WebSocket.OPEN) {
                            ws.send(JSON.stringify({ method: 'ping' }));
                        }
                    }, WS_PING_INTERVAL);
                };

                ws.onmessage = (event) => {
                    try {
                        const ticker: Binance24hrTicker = JSON.parse(event.data);
                        
                        if (ticker.e === '24hrTicker' && ticker.s) {
                            const pair = ticker.s; 
                            
                            priceDataRef.current.set(pair, ticker);
                            
                            updateIndices();
                        }
                    } catch (error) { 
                        console.error('[useMetalPrices] Critical Parse Error:', error, 'Raw Data:', event.data); 
                    }
                };

                ws.onerror = (error) => {
                    console.error('[DEBUG] ❌ WebSocket error:', error);
                    setConnectionStatus('error');
                };

                ws.onclose = (event) => {
                    console.log('[DEBUG] 🔌 WebSocket closed:', event.code, event.reason);
                    setConnectionStatus('disconnected');

                    if (pingIntervalRef.current) {
                        clearInterval(pingIntervalRef.current);
                        pingIntervalRef.current = undefined;
                    }

                    if (hasInitialized) {
                        reconnectTimeoutRef.current = window.setTimeout(() => {
                            console.log('[DEBUG] 🔄 Reconnecting...');
                            connectWebSocket();
                        }, WS_RECONNECT_DELAY);
                    }
                };

            } catch (error) {
                console.error('[DEBUG] ❌ Connection error:', error);
                setConnectionStatus('error');
            }
        };

        connectWebSocket();

        return () => {
            console.log('[DEBUG] Cleanup - resetting initialization flag');
            hasInitialized = false;

            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = undefined;
            }
            if (pingIntervalRef.current) {
                clearInterval(pingIntervalRef.current);
                pingIntervalRef.current = undefined;
            }
            if (wsRef.current) {
                console.log('[DEBUG] Closing WebSocket in cleanup');
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, []);

    return { indices, connectionStatus };
}