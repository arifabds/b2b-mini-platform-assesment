import { useState, useEffect, useRef } from "react";

export interface MetalPrice {
    symbol: string;
    name: string;
    price: number;
    dailyChange: number;
    dailyChangePercent: number;
    isPositive: boolean;
}

export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

const SYMBOL_NAMES: Record<string, string> = {
    XAUTUSDT: "Gold (XAU/USDT)",
    XAGUSDT: "Silver (XAG/USDT)",
};

const POLL_INTERVAL = 2000;

export function useMetalPrices(symbols: string[]) {
    const [prices, setPrices] = useState<Record<string, MetalPrice>>({});
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");
    const prevPricesRef = useRef<Record<string, number>>({});

    const fetchPrices = async () => {
        if (!symbols || symbols.length === 0) {
            setConnectionStatus("disconnected");
            return;
        }

        try {
            setConnectionStatus("connecting");

            const responses = await Promise.all(
                symbols.map((symbol) =>
                    fetch(`/api/prices/${symbol}`).then(res => res.json())
                )
            );

            const newPrices: Record<string, MetalPrice> = {};

            responses.forEach((data) => {
                const symbol = data.symbol;
                const currentPrice = parseFloat(data.lastPrice);
                const openPrice = parseFloat(data.openPrice);
                const dailyChange = currentPrice - openPrice;
                const dailyChangePercent = (dailyChange / openPrice) * 100;

                newPrices[symbol] = {
                    symbol,
                    name: SYMBOL_NAMES[symbol] || symbol,
                    price: currentPrice,
                    dailyChange,
                    dailyChangePercent: isFinite(dailyChangePercent) ? dailyChangePercent : 0,
                    isPositive: dailyChange >= 0,
                };
            });

            prevPricesRef.current = Object.fromEntries(
                Object.entries(newPrices).map(([symbol, price]) => [symbol, prices[symbol]?.price ?? price.price])
            );

            setPrices(newPrices);
            setConnectionStatus("connected");
        } catch (e) {
            console.error("❌ Error fetching prices", e);
            setConnectionStatus("error");
        }
    };

    useEffect(() => {
        fetchPrices();
        const interval = setInterval(fetchPrices, POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [symbols]);

    return {
        prices: Object.values(prices).sort((a, b) => a.symbol.localeCompare(b.symbol)),
        prevPrices: prevPricesRef.current,
        connectionStatus,
    };
}