import { http, HttpResponse, delay } from 'msw'
import { products } from '../../mocks/db'
import type { Product } from '../../types';

export const productsHandlers = [
    // Intercepts GET /api/products to list and filter products.
    http.get('/api/products', async ({ request }) => {
        await delay(300);
        const url = new URL(request.url);
        const query = url.searchParams.get('q')?.toLowerCase();
        const category = url.searchParams.get('category');
        let filteredProducts = [...products];

        if (query) {
            filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(query));
        }
        if (category && category !== 'All' && category !== 'all') {
            filteredProducts = filteredProducts.filter(p => p.category === category);
        }
        return HttpResponse.json(filteredProducts);
    }),

    // Intercepts POST /api/products to create a new product.
    http.post('/api/products', async ({ request }) => {
        const newProductData = await request.json() as Omit<Product, 'id' | 'createdAt'>;
        
        const newProduct: Product = {
            id: products.length + 1,
            ...newProductData,
            createdAt: new Date().toISOString(),
        };

        products.push(newProduct);
        
        return HttpResponse.json(newProduct, { status: 201 });
    }),

    // Intercepts PUT /api/products/:id to update an existing product.
    http.put('/api/products/:id', async ({ request, params }) => {
        const { id } = params;
        const updatedProductData = await request.json() as Partial<Omit<Product, 'id' | 'createdAt'>>;
        
        const productIndex = products.findIndex(p => p.id === Number(id));

        if (productIndex === -1) {
            return new HttpResponse(null, { status: 404 });
        }

        products[productIndex] = {
            ...products[productIndex],
            ...updatedProductData,
        };

        return HttpResponse.json(products[productIndex]);
    }),
];