import { http, HttpResponse, delay } from 'msw'
import { orders } from '../../mocks/db'

export const ordersHandlers = [
    // Intercepts GET requests to /api/orders to return the full list.
    http.get('/api/orders', async () => {
        await delay(300);
        return HttpResponse.json(orders);
    }),

    // Intercepts GET requests to /api/orders/:id for a single order's details.
    http.get('/api/orders/:id', async ({ params }) => {
        await delay(300);
        const { id } = params;

        const order = orders.find(o => o.id === id);
        if (order) {
            return HttpResponse.json(order);
        }

        // If the order is not found, return a 404 Not Found response.
        return new HttpResponse(null, { status: 404 });
    }),
];