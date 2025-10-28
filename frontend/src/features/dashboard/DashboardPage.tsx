import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/contexts/AuthContext';
import type { Order } from '../../types';

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

    useEffect(() => {
        //Start fetching on first render
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
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSummaryData();
    }, []);//Just once

    if (loading) {
        return <div className="text-center p-4">Loading dashboard...</div>;
    }

    if (error) {
        return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.firstName}!</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-600">Total Products</h2>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{data?.totalProducts}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-600">Total Orders</h2>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{data?.totalOrders}</p>
                </div>
            </div>

            {/* Last Orders*/}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Orders</h2>
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
                            {data?.latestOrders && data.latestOrders.length > 0 ? (
                                data.latestOrders.map((order) => (
                                    <tr key={order.id} className="border-t hover:bg-gray-50">
                                        <td className="p-4 text-sm text-gray-800 font-medium">{order.id}</td>
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
                                    <td colSpan={5} className="text-center p-4 text-gray-500">No recent orders found.</td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
}