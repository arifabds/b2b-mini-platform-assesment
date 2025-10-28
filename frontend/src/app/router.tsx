import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardPage from '../features/dashboard/DashboardPage';
import LoginPage from '../features/auth/LoginPage';
import ProductsPage from '../features/products/ProductsPage';
import OrdersPage from '../features/orders/OrdersPage';
import SettingsPage from '../features/settings/SettingsPage';
import PrivateRoute from './PrivateRoute';
import OrderDetailPage from '../features/orders/OrderDetailPage';
import NotFoundPage from '../components/common/NotFoundPage';
//import CrashTest from '../components/CrashTest'; //To test crashes
import ErrorBoundary from '../components/common/ErrorBoundary';

export const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ErrorBoundary>
                <PrivateRoute />
            </ErrorBoundary>
        ),
        errorElement: <ErrorBoundary />,
        children: [
            //Auto navigate to dashboard
            { index: true, element: <Navigate to="/dashboard" replace /> },
            { path: 'dashboard', element: <DashboardPage /> },
            { path: 'products', element: <ProductsPage /> },
            { path: 'orders', element: <OrdersPage /> },
            { path: 'orders/:id', element: <OrderDetailPage /> },
            { path: 'settings', element: <SettingsPage /> },
            //{ path: 'crash', element: <CrashTest /> },
        ],
    },
    {
        path: '/login', //Independent login path 
        element: <LoginPage />,
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
]);