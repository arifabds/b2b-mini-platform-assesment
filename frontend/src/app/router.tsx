import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import DashboardPage from '../features/dashboard/DashboardPage';
import LoginPage from '../features/auth/LoginPage';
import ProductsPage from '../features/products/ProductsPage';
import OrdersPage from '../features/orders/OrdersPage';
import SettingsPage from '../features/settings/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      //Auto redirect to dashboard
      { index: true, element: <Navigate to="/dashboard" replace /> }, 
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '/login', //Independent login path 
    element: <LoginPage />,
  },
]);