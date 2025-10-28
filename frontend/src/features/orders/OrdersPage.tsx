import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Order } from '../../types';
import { LoaderCircle, AlertTriangle } from 'lucide-react';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/orders');
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data: Order[] = await response.json();
                setOrders(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoaderCircle className="h-10 w-10 animate-spin text-indigo-500" />
            </div>
        );
    }

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

    return (
        <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Orders</h1>
            </div>

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
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="p-4 whitespace-nowrap text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                                            <Link to={`/orders/${order.id}`} className="hover:underline">
                                                {order.id}
                                            </Link>
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
                                    <td colSpan={5} className="text-center p-8 text-gray-500 dark:text-gray-400">No orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}