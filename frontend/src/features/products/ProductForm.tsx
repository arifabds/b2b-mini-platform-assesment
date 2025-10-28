import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Product } from '../../types';
import { useState } from 'react';

export const productCategories = ['Rings', 'Necklaces', 'Earrings', 'Bracelets'] as const;

interface ProductFormProps {
    productToEdit?: Product | null;
    onSubmitSuccess: () => void;
    onCancel: () => void;
}

const productSchema = z.object({
    name: z.string().min(1, 'Product name is required.'),
    category: z.enum(productCategories),
    price: z.coerce.number().min(0.01, 'Price must be greater than 0.'),
    stock: z.coerce.number().int('Stock must be a whole number.').nonnegative('Stock cannot be negative.'),
});

type ProductFormFields = z.infer<typeof productSchema>;

export default function ProductForm({ productToEdit, onSubmitSuccess, onCancel }: ProductFormProps) {
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
            onSubmitSuccess();
        } catch (error) {
            setApiError((error as Error).message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit Product' : 'Create New Product'}</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                            <input type="text" id="name" {...register('name')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
                            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                            <select id="category" {...register('category')} defaultValue="" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500">
                                <option value="" disabled>Select a category</option>
                                {productCategories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (£)</label>
                                <input type="number" id="price" {...register('price')} step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
                                {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                                <input type="number" id="stock" {...register('stock')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
                                {errors.stock && <p className="text-red-600 text-sm mt-1">{errors.stock.message}</p>}
                            </div>
                        </div>

                        {apiError && <p className="text-red-600 text-sm text-center">{apiError}</p>}
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={onCancel} disabled={isSubmitting} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-indigo-400">
                            {isSubmitting ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}