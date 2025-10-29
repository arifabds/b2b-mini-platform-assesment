interface BinanceStreamPayload {
    stream: string;
    data: { e: string; E: number; s: string; c: string; o: string; };
}

export class MockWebSocket {
    url: string;
    onopen: () => void = () => { };
    onmessage: (event: { data: string }) => void = () => { };
    onerror: (error: Error) => void = () => { };
    onclose: () => void = () => { };

    private intervalId?: number;
    private symbols: string[] = [];

    constructor(url: string) {
        this.url = url;
        console.log(`[MockWebSocket] Instance created for: ${url}`);
        this.extractSymbolsFromUrl(url);
    }

    connect(): void {
        console.log('[MockWebSocket] connect() called.');
        setTimeout(() => {
            console.log('[MockWebSocket] Connection OPENED.');
            this.onopen();
            this.startStreaming();
        }, 0);
    }

    close(): void {
        console.log('[MockWebSocket] Connection CLOSED.');
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.onclose();
    }

    private startStreaming(): void {
        this.intervalId = window.setInterval(() => {
            this.symbols.forEach(symbol => {
                const mockPayload = this.generateMockPayload(symbol);
                this.onmessage({ data: JSON.stringify(mockPayload) });
            });
        }, 2000);
    }

    private extractSymbolsFromUrl(url: string): void {
        try {
            const streamsPart = url.split('?streams=')[1] || url.split('/')[3];
            this.symbols = streamsPart.split('/').map(s => s.split('@')[0].toUpperCase());
        } catch (e) { console.error('[MockWebSocket] Could not parse symbols', e); }
    }

    private generateMockPayload(symbol: string): BinanceStreamPayload {
        const price = symbol === 'XAUTUSDT' ? 2320 + Math.random() * 10 : 29 + Math.random();
        const openPrice = price * (1 + (Math.random() - 0.5) * 0.01);

        return {
            stream: `${symbol.toLowerCase()}@miniTicker`,
            data: { e: '24hrMiniTicker', E: Date.now(), s: symbol, c: price.toFixed(2), o: openPrice.toFixed(2) },
        };
    }
}