import { useState, useEffect } from 'react';
import type { Product } from '../../types';
import ProductForm from './ProductForm';
import { LoaderCircle, AlertTriangle, Plus, Search, Edit } from 'lucide-react';

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
        const handler = setTimeout(() => { setDebouncedSearchTerm(searchTerm); }, 300);
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
            setError(null);
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
        return (
            <div className="bg-red-100 dark:bg-red-500/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md" role="alert">
                <div className="flex items-center">
                    <AlertTriangle className="h-6 w-6 mr-3" />
                    <div>
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Products</h1>
                <button
                    onClick={handleAddNewProduct}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors"
                >
                    <Plus size={18} />
                    <span>Add New Product</span>
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-transparent dark:border-gray-700 flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <label htmlFor="search" className="sr-only">Search Products</label>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        id="search"
                        placeholder="Search by product name..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-offset-gray-800 transition-all duration-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    id="category"
                    aria-label="Filter by Category"
                    className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-offset-gray-800 transition-all duration-200"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {productCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-transparent dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <LoaderCircle className="h-10 w-10 animate-spin text-indigo-500" />
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">Product</th>
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">Category</th>
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider text-right">Price</th>
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider text-center">Stock</th>
                                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="p-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 font-medium">{product.name}</td>
                                            <td className="p-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{product.category}</td>
                                            <td className="p-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                                                {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(product.price)}
                                            </td>
                                            <td className="p-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">{product.stock}</td>
                                            <td className="p-4 whitespace-nowrap text-sm text-center">
                                                <button
                                                    onClick={() => handleEditProduct(product)}
                                                    className="p-2 rounded-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                                                    title={`Edit ${product.name}`}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center p-8 text-gray-500 dark:text-gray-400">
                                            No products found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
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