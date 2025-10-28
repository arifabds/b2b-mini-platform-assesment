import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Product } from '../../types';
import { useState } from 'react';
import { LoaderCircle, X } from 'lucide-react';
import ReactDOM from 'react-dom';

export const productCategories = ['Rings', 'Necklaces', 'Earrings', 'Bracelets'] as const;

interface ProductFormProps {
    productToEdit?: Product | null;
    onSubmitSuccess: (mode: 'created' | 'edited') => void;
    onSubmitError: (message: string) => void;
    onCancel: () => void;
}

// Zod validation schema for product form fields
const productSchema = z.object({
    name: z.string().min(1, 'Product name is required.'),
    category: z.enum(productCategories, {
        message: "Please select a category."
    }),
    price: z.coerce.number().min(0.01, 'Price must be greater than 0.'),
    stock: z.coerce.number().int('Stock must be a whole number.').nonnegative('Stock cannot be negative.'),
});

type ProductFormFields = z.infer<typeof productSchema>;

export default function ProductForm({  productToEdit, onSubmitSuccess, onSubmitError, onCancel }: ProductFormProps) {
    const [apiError, setApiError] = useState<string | null>(null);
    const isEditMode = !!productToEdit;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: productToEdit?.name || '',
            category: productToEdit?.category,
            price: productToEdit?.price,
            stock: productToEdit?.stock,
        },
    });

    // Handle form submission for both create and edit modes
    const onSubmit = async (data: ProductFormFields) => {
        setApiError(null);
        try {
            const url = isEditMode ? `/api/products/${productToEdit.id}` : '/api/products';
            const method = isEditMode ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.message || `Failed to ${isEditMode ? 'update' : 'create'} product.`);
            }
            onSubmitSuccess(isEditMode ? 'edited' : 'created');
        } catch (error) {
            const errorMessage = (error as Error).message;
            setApiError(errorMessage);
            onSubmitError(errorMessage);
        }
    };

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    // Modal form rendered via React portal
    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md border border-transparent dark:border-gray-700 relative animate-fade-in-up">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{isEditMode ? 'Edit Product' : 'Create New Product'}</h2>
                    <button onClick={onCancel} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                            <input type="text" id="name" {...register('name')} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-offset-gray-800 transition-all duration-200" />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                            <select id="category" {...register('category')} defaultValue="" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-offset-gray-800 transition-all duration-200">
                                <option value="" disabled>Select a category</option>
                                {productCategories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (£)</label>
                                <input type="number" id="price" {...register('price')} step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-offset-gray-800 transition-all duration-200" />
                                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock</label>
                                <input type="number" id="stock" {...register('stock')} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-offset-gray-800 transition-all duration-200" />
                                {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
                            </div>
                        </div>

                        {apiError && <p className="text-red-500 text-sm text-center mt-2">{apiError}</p>}
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={onCancel} disabled={isSubmitting} className="px-4 py-2 rounded-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 disabled:opacity-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[120px]">
                            {isSubmitting ? (
                                <LoaderCircle className="h-5 w-5 animate-spin" />
                            ) : (
                                'Save Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        modalRoot
    );
}