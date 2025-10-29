import { useEffect, useState } from "react";
import { LoaderCircle, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { useMetalPrices } from "../../../lib/hooks/useMetalPrices";
import type { MetalPrice } from "../../../lib/hooks/useMetalPrices";

const SYMBOLS_TO_TRACK = ["XAUTUSDT", "XAGUSDT"];

export default function MetalPricesWidget() {
  const { prices, prevPrices, connectionStatus } = useMetalPrices(SYMBOLS_TO_TRACK);

  const renderContent = () => {
    switch (connectionStatus) {
      case "connecting":
        return (
          <div className="flex items-center justify-center h-40">
            <LoaderCircle className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        );

      case "error":
      case "disconnected":
        return (
          <div className="flex flex-col items-center justify-center h-40 text-red-500 dark:text-red-400">
            <AlertTriangle className="h-6 w-6 mb-2" />
            <span className="font-medium">Connection Lost</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Could not fetch real-time data.
            </span>
          </div>
        );

      case "connected":
        if (prices.length === 0) {
          return (
            <div className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-400">
              Waiting for data...
            </div>
          );
        }

        return (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[320px] md:min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="p-3 md:p-4 font-semibold text-sm md:text-base text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="p-3 md:p-4 font-semibold text-sm md:text-base text-gray-600 dark:text-gray-400 uppercase tracking-wider text-right">
                    Last Price
                  </th>
                  <th className="p-3 md:p-4 font-semibold text-sm md:text-base text-gray-600 dark:text-gray-400 uppercase tracking-wider text-right">
                    24h Change
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {prices.map((metal) => {
                  const prevPrice = prevPrices[metal.symbol] ?? metal.price;
                  const priceDiff = metal.price - prevPrice;

                  return (
                    <tr
                      key={metal.symbol}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-300"
                    >
                      <td className="p-3 md:p-4 whitespace-nowrap text-sm md:text-base font-medium text-gray-800 dark:text-gray-200">
                        {metal.name}
                      </td>
                      <td
                        className={`p-3 md:p-4 whitespace-nowrap text-sm md:text-base font-semibold text-right transition-colors duration-700 ${priceDiff > 0
                            ? "text-green-600 dark:text-green-400"
                            : priceDiff < 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                      >
                        <span
                          className={`inline-block transition-transform duration-700 ease-out transform ${priceDiff > 0 ? "translate-y-[-2px]" : priceDiff < 0 ? "translate-y-[2px]" : ""
                            }`}
                        >
                          {metal.price.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </td>
                      <td className="p-3 md:p-4 whitespace-nowrap text-sm md:text-base font-medium text-right">
                        <div
                          className={`flex items-center justify-end gap-2 transition-colors duration-700 ${metal.isPositive
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                            }`}
                        >
                          {metal.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          <span>{metal.dailyChangePercent.toFixed(2)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in-up p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Real-time Metal Prices
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-transparent dark:border-gray-700 overflow-hidden transition-all duration-500">
        {renderContent()}
      </div>
    </div>
  );
}