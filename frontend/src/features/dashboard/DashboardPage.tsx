import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/contexts/AuthContext';
import type { Order } from '../../types';
import { Package, ShoppingCart, LoaderCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import MetalPricesWidget from './components/MetalPricesWidget'; 

// Interface defining dashboard summary data structure (unchanged).
interface SummaryData {
    totalProducts: number;
    totalOrders: number;
    latestOrders: Order[];
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [data, setData] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // This useEffect fetches static summary data (Total Products/Orders) and remains unchanged.
    useEffect(() => {
        const fetchSummaryData = async () => {
            try {
                const response = await fetch('/api/summary');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result: SummaryData = await response.json();
                setData(result);
            } catch (err) {
                setError('Failed to fetch dashboard data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchSummaryData();
    }, []);

    // Renders a loading spinner while the initial summary data is being fetched.
    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoaderCircle className="h-10 w-10 animate-spin text-indigo-500" />
            </div>
        );
    }

    // Renders an error message if the initial summary data fetch fails.
    if (error) {
        return (
            <div className="bg-red-100 dark:bg-red-500/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md" role="alert">
                <div className="flex items-center">
                    <AlertTriangle className="h-6 w-6 mr-3" />
                    <div>
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    // The main dashboard layout with all components integrated.
    return (
        <div className="space-y-8 md:space-y-10">
            {/* Block 1: Welcome message and summary cards. */}
            <div className="animate-fade-in-down space-y-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                    Welcome, {user?.firstName}!
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-transparent dark:border-gray-700 transition-transform duration-300 hover:scale-[1.02]">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-base font-semibold text-gray-600 dark:text-gray-400">Total Products</h2>
                                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{data?.totalProducts}</p>
                            </div>
                            <div className="bg-blue-100 dark:bg-blue-500/20 p-3 rounded-full">
                                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-transparent dark:border-gray-700 transition-transform duration-300 hover:scale-[1.02]">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-base font-semibold text-gray-600 dark:text-gray-400">Total Orders</h2>
                                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{data?.totalOrders}</p>
                            </div>
                            <div className="bg-green-100 dark:bg-green-500/20 p-3 rounded-full">
                                <ShoppingCart className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Block 2: The newly integrated real-time Metal Prices Widget. */}
            <MetalPricesWidget />

            {/* Block 3: Recent Orders table. */}
            <div className="animate-fade-in-up">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Recent Orders</h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-transparent dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {data?.latestOrders && data.latestOrders.length > 0 ? (
                                    data.latestOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="p-4 whitespace-nowrap text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                                                <Link to={`/orders/${order.id}`} className="hover:underline">{order.id}</Link>
                                            </td>
                                            <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{order.customerName}</td>
                                            <td className="p-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(order.orderDate).toLocaleDateString('en-GB')}
                                            </td>
                                            <td className="p-4 whitespace-nowrap text-sm">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${{
                                                    Delivered: 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300',
                                                    Shipped: 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300',
                                                    Pending: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300',
                                                    Cancelled: 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300',
                                                }[order.status]
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 font-medium text-right">
                                                {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(order.totalAmount)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center p-8 text-gray-500 dark:text-gray-400">No recent orders found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}