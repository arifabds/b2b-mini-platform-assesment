import { useTheme } from '../../lib/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function SettingsPage() {
    const { theme, toggleTheme } = useTheme();

    // Settings page with theme toggle functionality
    return (
        <div className="space-y-6 md:space-y-8">
            <div className="animate-fade-in-down">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Settings</h1>
            </div>


            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-transparent dark:border-gray-700 animate-fade-in-up">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Appearance</h2>

                {/* Theme toggle switch with animated icons */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-gray-600 dark:text-gray-400">
                            Current Theme
                        </p>
                        <p className="font-bold capitalize text-gray-800 dark:text-gray-200 text-lg">
                            {theme}
                        </p>
                    </div>

                    <button
                        onClick={toggleTheme}
                        className="relative inline-flex items-center h-8 w-16 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                        aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                    >
                        <span className="sr-only">Switch Theme</span>
                        <span
                            className={`
                                absolute left-1 transition-transform duration-300 ease-in-out
                                ${theme === 'dark' ? 'translate-x-8' : 'translate-x-0'}
                            `}
                        >
                            {theme === 'light' ? (
                                <div className="h-6 w-6 flex items-center justify-center bg-white rounded-full shadow-md">
                                    <Moon className="h-4 w-4 text-gray-600" />
                                </div>
                            ) : (
                                <div className="h-6 w-6 flex items-center justify-center bg-gray-800 rounded-full shadow-md">
                                    <Sun className="h-4 w-4 text-yellow-400" />
                                </div>
                            )}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}