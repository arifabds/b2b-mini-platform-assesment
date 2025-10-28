import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/contexts/AuthContext';
import Layout from '../components/layout/Layout';

export default function PrivateRoute() {
    const { isAuthenticated } = useAuth();

    //In case of login
    if (isAuthenticated) {
        return <Layout />;
    }

    //Otherwise, Navigate to login
    return <Navigate to="/login" replace />;
}