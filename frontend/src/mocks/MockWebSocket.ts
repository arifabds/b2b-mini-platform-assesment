import type { MetalIndex, MetalPriceDetail } from '../types/metal';
import {
    GOLD_TYPES,
    INDICES_CONFIG,
    TROY_OUNCE_TO_GRAM,
    WS_UPDATE_INTERVAL,
    MAX_PRICE_FLUCTUATION,
    MAX_INITIAL_VARIANCE
} from '../constants/metalPrices';

export class MockWebSocket {
    url: string;
    onopen: () => void = () => { };
    onmessage: (event: { data: string }) => void = () => { };
    onerror: (error: Error) => void = () => { };
    onclose: () => void = () => { };

    private intervalId?: number;
    private symbols: string[] = [];
    private indices: Record<string, MetalIndex> = {};

    constructor(url: string) {
        this.url = url;
        this.extractSymbolsFromUrl(url);
        this.initializeIndices();
    }

    connect(): void {
        setTimeout(() => {
            this.onopen();
            this.startStreaming();
        }, 100);
    }

    close(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.onclose();
    }

    private extractSymbolsFromUrl(url: string): void {
        try {
            const streamsPart = url.split('?streams=')[1] || url.split('/')[3] || '';
            this.symbols = streamsPart
                .split('/')
                .map(s => s.split('@')[0].toUpperCase())
                .filter(s => s.length > 0);
        } catch (e) {
            console.error('[MockWebSocket] Failed to parse symbols from URL', e);
        }
    }

    private initializeIndices(): void {
        this.symbols.forEach(symbol => {
            const config = INDICES_CONFIG.find(c => c.symbol === symbol);
            if (!config) return;

            const pricePerGram = config.basePrice / TROY_OUNCE_TO_GRAM;

            this.indices[symbol] = {
                symbol: config.symbol,
                name: config.name,
                currency: config.currency,
                currencySymbol: config.currencySymbol,
                details: GOLD_TYPES.map(goldType =>
                    this.generateInitialPrice(pricePerGram, goldType)
                )
            };
        });
    }

    private generateInitialPrice(pricePerGram: number, goldType: typeof GOLD_TYPES[0]): MetalPriceDetail {
        const basePrice = pricePerGram * goldType.weight;
        const openPrice = basePrice * (1 + (Math.random() - 0.5) * MAX_INITIAL_VARIANCE);
        const currentPrice = basePrice * (1 + (Math.random() - 0.5) * MAX_INITIAL_VARIANCE * 0.5);
        const dailyChange = currentPrice - openPrice;
        const dailyChangePercent = (dailyChange / openPrice) * 100;

        return {
            type: goldType.type,
            displayName: goldType.displayName,
            price: currentPrice,
            dailyChange,
            dailyChangePercent,
            isPositive: dailyChange >= 0,
            weight: goldType.weight
        };
    }

    private startStreaming(): void {
        this.intervalId = window.setInterval(() => {
            if (this.symbols.length === 0) return;

            // Pick random index and gold type to update
            const symbolToUpdate = this.symbols[Math.floor(Math.random() * this.symbols.length)];
            const index = this.indices[symbolToUpdate];

            if (!index) return;

            const detailIndexToUpdate = Math.floor(Math.random() * index.details.length);
            const detail = index.details[detailIndexToUpdate];

            // Apply realistic price fluctuation
            const fluctuation = (Math.random() - 0.5) * MAX_PRICE_FLUCTUATION;
            const newPrice = detail.price * (1 + fluctuation);

            // Recalculate daily change with stable opening price
            const openPrice = detail.price / (1 + detail.dailyChangePercent / 100);
            const newDailyChange = newPrice - openPrice;
            const newDailyChangePercent = (newDailyChange / openPrice) * 100;

            index.details[detailIndexToUpdate] = {
                ...detail,
                price: newPrice,
                dailyChange: newDailyChange,
                dailyChangePercent: newDailyChangePercent,
                isPositive: newDailyChange >= 0
            };

            // Broadcast full state to all subscribers
            this.onmessage({
                data: JSON.stringify(Object.values(this.indices))
            });
        }, WS_UPDATE_INTERVAL);
    }
}