import type { Product, Order, User } from '../types';

//Mock product values
export const products: Product[] = [
    { id: 1, name: 'Diamond Solitaire Ring (0.5 Carat)', category: 'Rings', price: 2499.99, stock: 15, createdAt: '2024-02-10T11:00:00Z' },
    { id: 2, name: 'Sapphire Drop Necklace (18k Gold)', category: 'Necklaces', price: 799.99, stock: 30, createdAt: '2024-03-22T15:30:00Z' },
    { id: 3, name: 'Emerald Cut Earrings', category: 'Earrings', price: 649.99, stock: 25, createdAt: '2024-04-05T09:20:00Z' },
    { id: 4, name: 'Gold Tennis Bracelet', category: 'Bracelets', price: 1899.99, stock: 10, createdAt: '2024-05-18T18:00:00Z' },
    { id: 5, name: 'Silver Tree of Life Necklace', category: 'Necklaces', price: 249.99, stock: 80, createdAt: '2024-06-25T14:10:00Z' },
    { id: 6, name: 'Pearl Stud Earrings', category: 'Earrings', price: 199.99, stock: 120, createdAt: '2024-07-30T10:00:00Z' },
    { id: 7, name: 'Men\'s Titanium Wedding Band', category: 'Rings', price: 159.99, stock: 200, createdAt: '2024-08-15T12:45:00Z' },
    { id: 8, name: 'Rose Gold Charm Bracelet', category: 'Bracelets', price: 349.99, stock: 60, createdAt: '2024-09-01T16:55:00Z' },
];

//Mock order values
export const orders: Order[] = [
    {
        id: 'ORD-001',
        customerName: 'Gemstone Boutique',
        orderDate: '2025-10-20T10:00:00Z',
        status: 'Delivered',
        totalAmount: 3149.98,
        items: [
            { productId: 1, productName: 'Diamond Solitaire Ring (0.5 Carat)', quantity: 1, price: 2499.99 },
            { productId: 3, productName: 'Emerald Cut Earrings', quantity: 1, price: 649.99 }
        ]
    },
    {
        id: 'ORD-002',
        customerName: 'Everlasting Jewels',
        orderDate: '2025-10-22T14:30:00Z',
        status: 'Shipped',
        totalAmount: 499.98,
        items: [
            { productId: 5, productName: 'Silver Tree of Life Necklace', quantity: 2, price: 249.99 },
        ]
    },
    {
        id: 'ORD-003',
        customerName: 'The Diamond Palace',
        orderDate: '2025-10-25T09:15:00Z',
        status: 'Pending',
        totalAmount: 2249.97,
        items: [
            { productId: 4, productName: 'Gold Tennis Bracelet', quantity: 1, price: 1899.99 },
            { productId: 8, productName: 'Rose Gold Charm Bracelet', quantity: 1, price: 349.99 }
        ]
    },
    {
        id: 'ORD-004',
        customerName: 'Precious Metals Co.',
        orderDate: '2025-10-26T11:00:00Z',
        status: 'Cancelled',
        totalAmount: 799.99,
        items: [
            { productId: 2, productName: 'Sapphire Drop Necklace (18k Gold)', quantity: 1, price: 799.99 }
        ]
    },
    {
        id: 'ORD-005',
        customerName: 'Gemstone Boutique',
        orderDate: '2025-10-28T08:00:00Z',
        status: 'Pending',
        totalAmount: 479.97,
        items: [
            { productId: 7, productName: 'Men\'s Titanium Wedding Band', quantity: 3, price: 159.99 }
        ]
    }
];

export const user: User = {
    id: 'user-1',
    firstName: 'Admin',
    lastName: 'Jeweler',
    email: 'admin@example.com',
    password: 'password123',
};