import type { GoldType, IndexConfig } from '../types/metal';

// Standard gold weight variants
export const GOLD_TYPES: GoldType[] = [
    { type: 'gram', displayName: 'Gram', weight: 1 },
    { type: 'quarter', displayName: 'Quarter', weight: 1.75 },
    { type: 'half', displayName: 'Half', weight: 3.5 },
    { type: 'full', displayName: 'Full', weight: 7 }
];

// Binance trading pairs for gold
export const BINANCE_PAIRS = {
    PAXGUSDT: 'paxgusdt', // 1 PAXG = 1 troy ounce gold
    PAXGBUSD: 'paxgbusd'
};

// Major gold indices configuration with troy ounce base
export const INDICES_CONFIG: IndexConfig[] = [
    {
        symbol: 'XAUUSD',
        name: 'Gold vs. US Dollar',
        currency: 'USD',
        currencySymbol: '$',
        binancePair: BINANCE_PAIRS.PAXGUSDT
    },
    {
        symbol: 'XAUEUR',
        name: 'Gold vs. Euro',
        currency: 'EUR',
        currencySymbol: '€',
        binancePair: BINANCE_PAIRS.PAXGUSDT,
        conversionRate: 0.86 // EUR/USD approximate rate
    },
    {
        symbol: 'XAUTRY',
        name: 'Gold vs. Turkish Lira',
        currency: 'TRY',
        currencySymbol: '₺',
        binancePair: BINANCE_PAIRS.PAXGUSDT,
        conversionRate: 41.94 // TRY/USD approximate rate
    }
];

// Troy ounce to gram conversion
export const TROY_OUNCE_TO_GRAM = 31.1034768;

// Binance WebSocket configuration
export const BINANCE_WS_BASE = 'wss://data-stream.binance.vision:443/ws';
export const WS_RECONNECT_DELAY = 3000;
export const WS_PING_INTERVAL = 30000;