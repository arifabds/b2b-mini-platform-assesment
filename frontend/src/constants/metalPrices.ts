import type { GoldType, IndexConfig } from '../types/metal';

// Standard gold weight variants
export const GOLD_TYPES: GoldType[] = [
    { type: 'gram', displayName: 'Gram', weight: 1 },
    { type: 'quarter', displayName: 'Quarter', weight: 1.75 },
    { type: 'half', displayName: 'Half', weight: 3.5 },
    { type: 'full', displayName: 'Full', weight: 7 }
];

// Major gold indices configuration
export const INDICES_CONFIG: IndexConfig[] = [
    {
        symbol: 'XAUUSD',
        name: 'Gold vs. US Dollar',
        currency: 'USD',
        currencySymbol: '$',
        basePrice: 2330
    },
    {
        symbol: 'XAUEUR',
        name: 'Gold vs. Euro',
        currency: 'EUR',
        currencySymbol: '€',
        basePrice: 2165
    },
    {
        symbol: 'XAUTRY',
        name: 'Gold vs. Turkish Lira',
        currency: 'TRY',
        currencySymbol: '₺',
        basePrice: 180000
    }
];

// Troy ounce to gram conversion
export const TROY_OUNCE_TO_GRAM = 31.1034768;

// WebSocket update interval
export const WS_UPDATE_INTERVAL = 800;

// Price fluctuation limits
export const MAX_PRICE_FLUCTUATION = 0.0005;
export const MAX_INITIAL_VARIANCE = 0.015;