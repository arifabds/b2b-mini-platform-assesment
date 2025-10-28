import { Menu } from 'lucide-react';

interface HeaderProps {
    onMobileMenuToggle: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
    return (
        <header className="sticky top-0 z-20 bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700">
            <div className="px-4 md:px-6 h-16 flex items-center justify-between">
                <button
                    onClick={onMobileMenuToggle}
                    className="md:hidden p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                    aria-label="Open sidebar"
                >
                    <Menu size={24} />
                </button>

                <div />
            </div>
        </header>
    );
}