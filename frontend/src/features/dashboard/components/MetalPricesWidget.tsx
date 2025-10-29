import { useState, useEffect, useRef } from "react";
import { LoaderCircle, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { useMetalPrices } from "../../../lib/hooks/useMetalPrices";
import type { MetalPrice } from "../../../lib/hooks/useMetalPrices";


// Component constants defined outside to prevent re-creation on renders.
const SYMBOLS_TO_TRACK = ["XAUTUSDT", "XAGUSDT"];
type PriceEffect = 'up' | 'down' | 'none';

export default function MetalPricesWidget() {
  const { prices, connectionStatus } = useMetalPrices(SYMBOLS_TO_TRACK);
  const [priceEffects, setPriceEffects] = useState<Record<string, PriceEffect>>({});
  const prevPricesRef = useRef<Record<string, number>>({});

  // This effect detects price changes to trigger a visual flash feedback.
  useEffect(() => {
    if (prices.length === 0) return;

    const newEffects: Record<string, PriceEffect> = {};
    const newPricesMap: Record<string, number> = {};

    prices.forEach((metal: MetalPrice) => {
      const oldPrice = prevPricesRef.current[metal.symbol];
      if (oldPrice !== undefined && oldPrice !== metal.price) {
        newEffects[metal.symbol] = metal.price > oldPrice ? 'up' : 'down';
      } else {
        newEffects[metal.symbol] = 'none';
      }
      newPricesMap[metal.symbol] = metal.price;
    });

    setPriceEffects(newEffects);
    prevPricesRef.current = newPricesMap;

  }, [prices]);

  const renderContent = () => {
    switch (connectionStatus) {
      case "connecting":
        return (
          <div className="flex items-center justify-center h-48">
            <LoaderCircle className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        );

      case "error":
      case "disconnected":
        return (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4">
            <AlertTriangle className="h-8 w-8 mb-2 text-red-500 dark:text-red-400" />
            <span className="font-semibold text-gray-800 dark:text-gray-200">Connection Issue</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Could not fetch real-time data.</span>
          </div>
        );

      case "connected":
        if (prices.length === 0) {
          return (
            <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
              Waiting for data...
            </div>
          );
        }

        return (
          <div>
            {/* Desktop-only table header for clarity on wider screens. */}
            <div className="hidden md:grid grid-cols-3 gap-4 px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">Asset</h3>
              <h3 className="font-semibold text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider text-right">Last Price</h3>
              <h3 className="font-semibold text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider text-right">24h Change</h3>
            </div>

            {/* A unified list that adapts its layout from mobile to desktop. */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {prices.map((metal: MetalPrice) => {
                const effect = priceEffects[metal.symbol];
                const effectClass =
                  effect === 'up' ? 'bg-green-100/50 dark:bg-green-500/10' :
                    effect === 'down' ? 'bg-red-100/50 dark:bg-red-500/10' :
                      '';

                return (
                  <div
                    key={metal.symbol}
                    className={`grid grid-cols-2 md:grid-cols-3 gap-4 items-center px-6 py-4 transition-colors duration-1000 ease-out ${effectClass}`}
                  >
                    {/* Asset Name section */}
                    <div className="md:col-span-1">
                      <p className="font-medium text-gray-800 dark:text-gray-200">{metal.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 md:hidden">Asset</p>
                    </div>

                    {/* Price section with mobile label */}
                    <div className="text-right md:col-span-1">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {metal.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 md:hidden">Last Price</p>
                    </div>

                    {/* 24h Change section, structured differently for mobile. */}
                    <div className="col-span-2 md:col-span-1 flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700/50 md:border-0 md:pt-0 md:justify-end">
                      <p className="text-sm text-gray-500 dark:text-gray-400 md:hidden">24h Change</p>
                      <div className={`flex items-center justify-end gap-2 ${metal.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                        {metal.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        <span>{metal.dailyChangePercent.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Real-time Metal Prices
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-transparent dark:border-gray-700 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}