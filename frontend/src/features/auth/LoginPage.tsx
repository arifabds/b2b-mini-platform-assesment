import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../lib/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { KeyRound, LoaderCircle } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z.string().min(1, { message: 'Password cannot be empty.' }),
});

type LoginFormFields = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [apiError, setApiError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormFields>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit: SubmitHandler<LoginFormFields> = async (data) => {
        setApiError(null);
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Login failed. Please try again.');
            }

            login(result.user, result.token);
            navigate('/dashboard', { replace: true });

        } catch (error) {
            setApiError((error as Error).message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4 transition-colors duration-300">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-sm border border-transparent dark:border-gray-700">
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-indigo-100 dark:bg-indigo-500/20 p-3 rounded-full mb-4">
                        <KeyRound className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
                        B2B Platform Login
                    </h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                {...register('email')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-offset-gray-800 transition-all duration-200"
                                placeholder="admin@example.com"
                                disabled={isSubmitting}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                {...register('password')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-offset-gray-800 transition-all duration-200"
                                placeholder="••••••••"
                                disabled={isSubmitting}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        </div>
                    </div>

                    {apiError && (
                        <p className="text-red-500 text-sm mt-4 text-center">{apiError}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full mt-6 bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <LoaderCircle className="h-5 w-5 animate-spin" />
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}