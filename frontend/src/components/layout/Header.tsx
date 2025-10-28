import { Menu } from 'lucide-react';

interface HeaderProps {
    onMobileMenuToggle: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
    return (
        <header className="sticky top-0 z-20 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-md border-b border-indigo-200/20 dark:border-gray-700/30 shadow-sm">
            <div className="px-4 md:px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMobileMenuToggle}
                        className="md:hidden p-2.5 rounded-xl text-indigo-600 hover:bg-indigo-100/80 dark:text-indigo-400 dark:hover:bg-indigo-500/20 transition-all duration-200 hover:scale-105"
                        aria-label="Open sidebar"
                    >
                        <Menu size={20} />
                    </button>
                    
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-sm">B2B</span>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 tracking-tight">Platform</h1>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2.5 px-4 py-2 bg-white/70 dark:bg-gray-700/70 rounded-xl border border-indigo-200/30 dark:border-gray-600/30 shadow-sm backdrop-blur-sm">
                        <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-sm"></div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Online</span>
                    </div>
                </div>
            </div>
        </header>
    );
}