import { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useMetalPrices } from '../../../lib/hooks/useMetalPrices';
import type { PriceEffect } from '../../../types/metal';

const SYMBOLS_TO_TRACK = ['XAUUSD', 'XAUEUR', 'XAUTRY'];

export default function MetalPricesWidget() {
  console.log('[MetalPricesWidget] Component rendering...');

  const { indices, connectionStatus } = useMetalPrices(SYMBOLS_TO_TRACK);

  console.log('[MetalPricesWidget] Hook returned:', { 
    indicesCount: indices.length, 
    connectionStatus 
  });
  
  const [priceEffects, setPriceEffects] = useState<Record<string, PriceEffect>>({});
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);
  const prevPricesRef = useRef<Record<string, number>>({});

  useEffect(() => {
    if (indices.length === 0) return;

    const newEffects: Record<string, PriceEffect> = {};

    indices.forEach(index => {
      index.details.forEach(detail => {
        const key = `${index.symbol}-${detail.type}`;
        const oldPrice = prevPricesRef.current[key];

        if (oldPrice !== undefined && oldPrice !== detail.price) {
          newEffects[key] = detail.price > oldPrice ? 'up' : 'down';
        } else {
          newEffects[key] = 'none';
        }

        prevPricesRef.current[key] = detail.price;
      });
    });

    setPriceEffects(newEffects);

    const timer = setTimeout(() => {
      setPriceEffects({});
    }, 1000);

    return () => clearTimeout(timer);
  }, [indices]);

  const formatPrice = (price: number, currencySymbol: string) => {
    return `${currencySymbol}${price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500 animate-pulse';
      case 'disconnected': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Live';
      case 'connecting': return 'Connecting...';
      case 'disconnected': return 'Disconnected';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  const toggleExpand = (symbol: string) => {
    setExpandedIndex(expandedIndex === symbol ? null : symbol);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
          Real-time Gold Indices
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
            {getStatusText()}
          </span>
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
        </div>
      </div>

      <div className="space-y-4">
        {indices.map((index) => {
          const isExpanded = expandedIndex === index.symbol;

          return (
            <div
              key={index.symbol}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-transparent dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-xl"
            >
              <button
                onClick={() => toggleExpand(index.symbol)}
                className="w-full px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 border-b border-gray-200 dark:border-gray-700 hover:from-gray-100 hover:to-gray-150 dark:hover:from-gray-750 dark:hover:to-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-sm">
                        {index.symbol.slice(3)}
                      </span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                        {index.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {index.symbol} • {index.currency}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 hidden sm:inline">
                      {isExpanded ? 'Collapse' : 'Expand'}
                    </span>
                    <RefreshCw
                      size={16}
                      className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  } overflow-hidden`}
              >
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {index.details.map((detail) => {
                    const effectKey = `${index.symbol}-${detail.type}`;
                    const effect = priceEffects[effectKey];
                    const effectClass =
                      effect === 'up'
                        ? 'bg-green-50 dark:bg-green-500/10'
                        : effect === 'down'
                          ? 'bg-red-50 dark:bg-red-500/10'
                          : '';

                    return (
                      <div
                        key={detail.type}
                        className={`px-4 sm:px-6 py-3 transition-colors duration-500 ${effectClass}`}
                      >
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-center">
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                              {detail.displayName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {detail.weight}g
                            </p>
                          </div>

                          <div className="text-right sm:text-center">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                              {formatPrice(detail.price, index.currencySymbol)}
                            </p>
                          </div>

                          <div className="col-span-2 sm:col-span-1 flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100 dark:border-gray-700">
                            <span className="text-xs text-gray-500 dark:text-gray-400 sm:hidden">
                              24h Change
                            </span>
                            <div
                              className={`flex items-center gap-1.5 ${detail.isPositive
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                                }`}
                            >
                              {detail.isPositive ? (
                                <TrendingUp size={14} />
                              ) : (
                                <TrendingDown size={14} />
                              )}
                              <span className="text-xs sm:text-sm font-medium">
                                {detail.dailyChangePercent.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {connectionStatus === 'error' && (
        <div className="mt-4 bg-red-50 dark:bg-red-500/10 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md text-sm">
          <p className="font-medium">Connection Error</p>
          <p className="text-xs mt-1">Unable to connect to Binance WebSocket. Retrying...</p>
        </div>
      )}

      {indices.length === 0 && connectionStatus === 'connected' && (
        <div className="mt-4 bg-yellow-50 dark:bg-yellow-500/10 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 p-4 rounded-md text-sm">
          <p className="font-medium">Waiting for data...</p>
          <p className="text-xs mt-1">Receiving live gold prices from Binance.</p>
        </div>
      )}
    </div>
  );
}