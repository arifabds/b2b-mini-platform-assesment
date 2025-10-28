import { productCategories } from '../features/products/ProductForm'; 

export interface Product {
    id: number;
    name: string;
    category: typeof productCategories[number]; 
    price: number;
    stock: number;
    createdAt: string;
}

export interface Order {
    id: string;
    customerName: string;
    orderDate: string;
    status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
    totalAmount: number;
    items: {
        productId: number;
        productName: string;
        quantity: number;
        price: number;
    }[];
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
}