import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Order } from '../../types';

export default function OrderDetailPage() {
    //Dynamic id 
    const { id } = useParams<{ id: string }>(); 
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const response = await fetch(`/api/orders/${id}`);
                
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Order not found.');
                    }
                    throw new Error('Failed to fetch order details.');
                }
                
                const data: Order = await response.json();
                setOrder(data);

            } catch (err) {
                setError((err as Error).message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [id]); //Depend on id

    if (loading) {
        return <div className="text-center p-4">Loading order details...</div>;
    }

    if (error) {
        return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">{error}</div>;
    }

    if (!order) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">
                    Order Details: <span className="text-indigo-600">{order.id}</span>
                </h1>
                <Link to="/orders" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300">
                    &larr; Back to Orders
                </Link>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500">Customer</h3>
                        <p className="text-lg text-gray-800">{order.customerName}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500">Order Date</h3>
                        <p className="text-lg text-gray-800">{new Date(order.orderDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500">Status</h3>
                        <p className="text-lg text-gray-800">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                                {order.status}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Details*/}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Items</h2>
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-left">

                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Product Name</th>
                                <th className="p-4 font-semibold text-gray-600 text-center">Quantity</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">Price</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">Subtotal</th>
                            </tr>
                        </thead>

                        <tbody>
                            {order.items.map((item) => (
                                <tr key={item.productId} className="border-t">
                                    <td className="p-4 text-sm text-gray-800 font-medium">{item.productName}</td>
                                    <td className="p-4 text-sm text-gray-600 text-center">{item.quantity}</td>
                                    <td className="p-4 text-sm text-gray-600 text-right">
                                        {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(item.price)}
                                    </td>
                                    <td className="p-4 text-sm text-gray-800 font-medium text-right">
                                        {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(item.quantity * item.price)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                        <tfoot className="bg-gray-50">
                            <tr className="border-t-2 border-gray-200">
                                <td colSpan={3} className="p-4 text-right font-bold text-gray-700">Total Amount</td>
                                <td className="p-4 text-right font-bold text-xl text-gray-900">
                                    {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(order.totalAmount)}
                                </td>
                            </tr>
                        </tfoot>

                    </table>
                </div>
            </div>
        </div>
    );
}