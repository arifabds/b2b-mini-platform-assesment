import { Link } from 'react-router-dom';
import { Home, Frown } from 'lucide-react';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4 text-center animate-fade-in">
            <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-2xl shadow-2xl border border-transparent dark:border-gray-700">
                <Frown className="h-20 w-20 text-indigo-400 mx-auto mb-6" strokeWidth={1.5} />

                <h1 className="text-6xl sm:text-7xl font-bold text-indigo-600 dark:text-indigo-400">404</h1>

                <p className="mt-4 text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    Page Not Found
                </p>

                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Sorry, the page you are looking for does not exist.
                </p>

                <Link
                    to="/dashboard"
                    className="mt-8 inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-transform duration-200 hover:scale-105"
                >
                    <Home size={18} />
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
}