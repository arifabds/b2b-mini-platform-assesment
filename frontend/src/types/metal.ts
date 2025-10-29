// Core metal price data structure for individual gold types
export interface MetalPriceDetail {
    type: string;
    displayName: string;
    price: number;
    dailyChange: number;
    dailyChangePercent: number;
    isPositive: boolean;
    weight: number;
}

// Complete index data with all gold type variants
export interface MetalIndex {
    symbol: string;
    name: string;
    currency: string;
    currencySymbol: string;
    details: MetalPriceDetail[];
}

// WebSocket connection states
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

// Visual effect for price changes
export type PriceEffect = 'up' | 'down' | 'none';

// Gold type configuration
export interface GoldType {
    type: string;
    displayName: string;
    weight: number;
}

// Index configuration for initialization
export interface IndexConfig {
    symbol: string;
    name: string;
    currency: string;
    currencySymbol: string;
    binancePair: string;
    conversionRate?: number;
}

// Binance 24hr ticker data structure
export interface Binance24hrTicker {
    e: string;
    E: number;
    s: string;
    c: string; // Current price
    o: string; // Open price
    h: string; // High price
    l: string; // Low price
    p: string; // Price change
    P: string; // Price change percent
    v: string; // Volume
}