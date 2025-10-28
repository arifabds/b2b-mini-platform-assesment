import { http, HttpResponse, delay } from 'msw'
import { products, orders } from '../../mocks/db'

export const dashboardHandlers = [
    // Intercepts GET requests to /api/summary to provide dashboard data.
    http.get('/api/summary',  async () => {
        await delay(300); // Got these fetches a bit lazy to show loading screens

        const totalProducts = products.length;
        const totalOrders = orders.length;

        // Get the 5 most recent orders by sorting them in descending date order.
        const latestOrders = [...orders]
            .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
            .slice(0, 5);

        // Return a combined summary object.
        return HttpResponse.json({
            totalProducts,
            totalOrders,
            latestOrders,
        });
    }),
];