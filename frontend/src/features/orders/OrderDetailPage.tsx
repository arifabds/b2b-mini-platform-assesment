import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Order } from '../../types';
import { LoaderCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function OrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const response = await fetch(`/api/orders/${id}`);
                if (!response.ok) {
                    if (response.status === 404) throw new Error('Order not found.');
                    throw new Error('Failed to fetch order details.');
                }
                const data: Order = await response.json();
                setOrder(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetail();
    }, [id]);

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

    if (!order) return null;

    return (
        <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 truncate">
                    Order: <span className="text-indigo-600 dark:text-indigo-400">{order.id}</span>
                </h1>
                <Link to="/orders" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors self-start">
                    <ArrowLeft size={16} />
                    Back to Orders
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-transparent dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</h3>
                        <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-1">{order.customerName}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order Date</h3>
                        <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-1">{new Date(order.orderDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</h3>
                        <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-1">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${{
                                    Delivered: 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300',
                                    Shipped: 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300',
                                    Pending: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300',
                                    Cancelled: 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300',
                                }[order.status]
                                }`}>
                                {order.status}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Items</h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-transparent dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">Product</th>
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider text-center">Qty</th>
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider text-right">Price</th>
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {order.items.map((item) => (
                                    <tr key={item.productId}>
                                        <td className="p-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 font-medium">{item.productName}</td>
                                        <td className="p-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">{item.quantity}</td>
                                        <td className="p-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                                            {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(item.price)}
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 font-medium text-right">
                                            {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(item.quantity * item.price)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50 dark:bg-gray-900">
                                <tr className="border-t-2 border-gray-200 dark:border-gray-700">
                                    <td colSpan={3} className="p-4 text-right font-bold text-gray-700 dark:text-gray-300">Total Amount</td>
                                    <td className="p-4 text-right font-bold text-xl text-gray-900 dark:text-white">
                                        {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(order.totalAmount)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}