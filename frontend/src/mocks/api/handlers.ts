import { authHandlers } from '../../features/auth/authHandlers';
import { dashboardHandlers } from '../../features/dashboard/dashboardHandlers';
import { ordersHandlers } from '../../features/orders/ordersHandlers';
import { productsHandlers } from '../../features/products/productsHandlers';

// Aggregates all mock API handlers from different features into a single array.
export const handlers = [
    ...authHandlers,
    ...dashboardHandlers,
    ...ordersHandlers,
    ...productsHandlers,
];