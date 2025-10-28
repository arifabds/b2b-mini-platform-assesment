import { NavLink } from 'react-router-dom';
import { useAuth } from '../../lib/contexts/AuthContext';
import { LayoutDashboard, Package, ShoppingCart, Settings, X, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';

const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/products', label: 'Products', icon: Package },
    { to: '/orders', label: 'Orders', icon: ShoppingCart },
    { to: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
    isMobileOpen: boolean;
    isCollapsed: boolean;
    onCloseMobileMenu: () => void;
    onToggleCollapse: () => void;
}

export default function Sidebar({
    isMobileOpen,
    isCollapsed,
    onCloseMobileMenu,
    onToggleCollapse
}: SidebarProps) {
    const { user, logout } = useAuth();

    return (
        <>
            {/* Mobile overlay */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-60 z-30 md:hidden ${isMobileOpen ? 'block' : 'hidden'}`}
                onClick={onCloseMobileMenu}
            />

            <aside
                className={`
                    fixed top-0 left-0 h-full z-40 bg-slate-800 dark:bg-slate-900 text-white flex flex-col
                    border-r border-slate-700 dark:border-slate-600
                    transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'w-24' : 'w-64'}
                    md:relative md:translate-x-0
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Header Section */}
                <div className="flex flex-col border-b border-slate-600 dark:border-slate-500">
                    {/* User Info */}
                    <div className="flex items-center justify-center h-16 px-3">
                        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                            {user?.firstName.charAt(0)}
                        </div>
                        {!isCollapsed && (
                            <div className="ml-3 flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {user?.firstName} {user?.lastName}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Expand/Collapse Button */}
                    <div className="flex justify-center pb-3">
                        <button
                            onClick={onToggleCollapse}
                            className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg text-slate-300 dark:text-slate-400 hover:bg-slate-600 dark:hover:bg-slate-700 hover:text-white transition-colors duration-200"
                            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                        </button>
                        <button 
                            onClick={onCloseMobileMenu} 
                            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-slate-300 dark:text-slate-400 hover:bg-slate-600 dark:hover:bg-slate-700 hover:text-white transition-colors duration-200"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <NavLink
                                key={link.label}
                                to={link.to}
                                onClick={onCloseMobileMenu}
                                title={isCollapsed ? link.label : undefined}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 py-3 px-3 mx-2 rounded-lg font-medium transition-all duration-200
                                    ${isCollapsed ? 'justify-center' : ''}
                                    ${isActive
                                        ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg'
                                        : 'text-slate-300 dark:text-slate-400 hover:bg-slate-600 dark:hover:bg-slate-700 hover:text-white'
                                    }`
                                }
                            >
                                <Icon size={20} className="flex-shrink-0" />
                                {!isCollapsed && (
                                    <span className="text-sm whitespace-nowrap">
                                        {link.label}
                                    </span>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Logout Section */}
                <div className="border-t border-slate-600 dark:border-slate-500 p-3">
                    <button
                        onClick={logout}
                        title="Logout"
                        className={`
                            flex items-center gap-3 w-full py-3 px-3 rounded-lg font-medium text-red-400 dark:text-red-300
                            hover:bg-red-500/20 dark:hover:bg-red-500/30 hover:text-red-300 dark:hover:text-red-200 transition-all duration-200
                            ${isCollapsed ? 'justify-center' : ''}
                        `}
                    >
                        <LogOut size={20} className="flex-shrink-0" />
                        {!isCollapsed && (
                            <span className="text-sm whitespace-nowrap">
                                Logout
                            </span>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
}