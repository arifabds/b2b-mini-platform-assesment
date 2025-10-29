export default async function handler(req: any, res: any) {
    try {
        const { symbol } = req.query;
        if (!symbol) {
            res.status(400).json({ error: 'Symbol missing. Use /api/prices/XAUTUSDT' });
            return;
        }

        const binanceUrl = `https://api.binance.com/api/v3/ticker/24hr?symbol=${encodeURIComponent(symbol)}`;
        const binanceRes = await fetch(binanceUrl);

        if (!binanceRes.ok) {
            const text = await binanceRes.text();
            res.status(502).json({ error: 'Binance fetch failed', status: binanceRes.status, body: text });
            return;
        }

        const data = await binanceRes.json();
        res.status(200).json(data);
    } catch (err: any) {
        res.status(500).json({ error: 'Internal serverless error', message: err.message });
    }
}