import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardPage from '../features/dashboard/DashboardPage';
import LoginPage from '../features/auth/LoginPage';
import ProductsPage from '../features/products/ProductsPage';
import OrdersPage from '../features/orders/OrdersPage';
import SettingsPage from '../features/settings/SettingsPage';
import PrivateRoute from './PrivateRoute';
import OrderDetailPage from '../features/orders/OrderDetailPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <PrivateRoute />,
        children: [
            //Auto navigate to dashboard
            { index: true, element: <Navigate to="/dashboard" replace /> },
            { path: 'dashboard', element: <DashboardPage /> },
            { path: 'products', element: <ProductsPage /> },
            { path: 'orders', element: <OrdersPage /> },
            { path: 'orders/:id', element: <OrderDetailPage /> },
            { path: 'settings', element: <SettingsPage /> },
        ],
    },
    {
        path: '/login', //Independent login path 
        element: <LoginPage />,
    },
]);