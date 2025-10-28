import { useState, useEffect } from 'react';
import type { Product } from '../../types';
import ProductForm from './ProductForm';

const productCategories = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets'];

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);


    const [isFormOpen, setIsFormOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);


    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (debouncedSearchTerm) params.append('q', debouncedSearchTerm);
            if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);

            const response = await fetch(`/api/products?${params.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch products');
            const data: Product[] = await response.json();
            setProducts(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [debouncedSearchTerm, selectedCategory]);


    const handleAddNewProduct = () => {
        setProductToEdit(null); 
        setIsFormOpen(true);    
    };

    const handleEditProduct = (product: Product) => {
        setProductToEdit(product); 
        setIsFormOpen(true);       
    };

    const handleFormCancel = () => {
        setIsFormOpen(false);      
        setProductToEdit(null); 
    };

    const handleFormSuccess = () => {
        setIsFormOpen(false);      
        setProductToEdit(null);  
        fetchProducts();           
    };


    if (error) {
        return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Products</h1>
                <button
                    onClick={handleAddNewProduct}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700"
                >
                    + Add New Product
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                    <label htmlFor="search" className="sr-only">Search Products</label>
                    <input
                        type="text"
                        id="search"
                        placeholder="Search by product name..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-1/4">
                    <label htmlFor="category" className="sr-only">Filter by Category</label>
                    <select
                        id="category"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {productCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                {loading ? (
                     <div className="text-center p-8">Loading products...</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Product Name</th>
                                <th className="p-4 font-semibold text-gray-600">Category</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">Price</th>
                                <th className="p-4 font-semibold text-gray-600 text-center">Stock</th>
                                <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product.id} className="border-t hover:bg-gray-50">
                                        <td className="p-4 text-sm text-gray-800 font-medium">{product.name}</td>
                                        <td className="p-4 text-sm text-gray-600">{product.category}</td>
                                        <td className="p-4 text-sm text-gray-800 text-right">
                                            {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(product.price)}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600 text-center">{product.stock}</td>
                                        <td className="p-4 text-sm text-center">
                                            <button
                                                onClick={() => handleEditProduct(product)}
                                                className="text-indigo-600 hover:text-indigo-900 font-medium"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center p-8 text-gray-500">
                                        No products found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {isFormOpen && (
                <ProductForm
                    productToEdit={productToEdit}
                    onSubmitSuccess={handleFormSuccess}
                    onCancel={handleFormCancel}
                />
            )}
        </div>
    );
}