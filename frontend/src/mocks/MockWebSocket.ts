interface BinanceStreamPayload {
    stream: string;
    data: {
        e: string; // Event type
        E: number; // Event time
        s: string; // Symbol
        c: string; // Close price
        o: string; // Open price
    };
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
        console.log(`[MockWebSocket] Connecting to: ${url}`);
        this.extractSymbolsFromUrl(url);
        this.connect();
    }

    private extractSymbolsFromUrl(url: string): void {
        try {
            const streamsPart = url.split('?streams=')[1];
            if (streamsPart) {
                this.symbols = streamsPart.split('/').map(s => s.split('@')[0].toUpperCase());
            }
        } catch (e) {
            console.error('[MockWebSocket] Could not parse symbols from URL', e);
        }
    }

    private connect(): void {
        setTimeout(() => {
            console.log('[MockWebSocket] Connection OPENED.');
            this.onopen();
            this.startStreaming();
        }, 500); 
    }

    private startStreaming(): void {
        this.intervalId = window.setInterval(() => {
            this.symbols.forEach(symbol => {
                const mockPayload = this.generateMockPayload(symbol);
                this.onmessage({ data: JSON.stringify(mockPayload) });
            });
        }, 2000);
    }

    private generateMockPayload(symbol: string): BinanceStreamPayload {
        const price = symbol === 'XAUTUSDT' ? 2320 + Math.random() * 10 : 29 + Math.random();
        const openPrice = price * (1 + (Math.random() - 0.5) * 0.01);

        return {
            stream: `${symbol.toLowerCase()}@miniTicker`,
            data: {
                e: '24hrMiniTicker',
                E: Date.now(),
                s: symbol,
                c: price.toFixed(2),
                o: openPrice.toFixed(2),
            },
        };
    }

    close(): void {
        console.log('[MockWebSocket] Connection CLOSED.');
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.onclose();
    }
}