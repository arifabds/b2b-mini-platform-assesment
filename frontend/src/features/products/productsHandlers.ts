import { http, HttpResponse } from 'msw'
import { products } from '../../mocks/db'

export const productsHandlers = [
    // Intercepts GET /api/products to list and filter products based on query parameters.
    http.get('/api/products', ({ request }) => {

        // Extract search query 'q' and 'category' from the request URL.
        const url = new URL(request.url);

        const query = url.searchParams.get('q')?.toLowerCase();
        const category = url.searchParams.get('category');

        let filteredProducts = [...products];

        // Apply filters if query parameters are present.
        if (query) {
            filteredProducts = filteredProducts.filter(product =>
                product.name.toLowerCase().includes(query)
            );
        }

        if (category && category !== 'all') {
            filteredProducts = filteredProducts.filter(product => product.category === category);
        }

        return HttpResponse.json(filteredProducts);
    }),
];