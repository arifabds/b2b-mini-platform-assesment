import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Order } from '../../types';

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
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div className="text-center p-4">Loading orders...</div>;
    }

    if (error) {
        return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left">

                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Order ID</th>
                            <th className="p-4 font-semibold text-gray-600">Customer</th>
                            <th className="p-4 font-semibold text-gray-600">Date</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order.id} className="border-t hover:bg-gray-50">
                                    <td className="p-4 text-sm text-indigo-600 font-medium">
                                        <Link to={`/orders/${order.id}`} className="hover:underline">
                                            {order.id}
                                        </Link>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{order.customerName}</td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {new Date(order.orderDate).toLocaleDateString('en-GB')}
                                    </td>
                                    <td className="p-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-800 font-medium text-right">
                                        {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(order.totalAmount)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center p-4 text-gray-500">No orders found.</td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    );
}