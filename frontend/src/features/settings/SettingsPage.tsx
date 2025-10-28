import { useTheme } from '../../lib/contexts/ThemeContext';

export default function SettingsPage() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Settings</h1>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Appearance</h2>
                <div className="flex items-center justify-between">
                    <p className="text-gray-600 dark:text-gray-400">
                        Current Theme: <span className="font-bold capitalize text-gray-800 dark:text-gray-200">{theme}</span>
                    </p>
                    <button
                        onClick={toggleTheme}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
                    </button>
                </div>
            </div>
        </div>
    );
}