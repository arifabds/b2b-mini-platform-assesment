import { NavLink } from 'react-router-dom';
import { useAuth } from '../../lib/contexts/AuthContext';
import { LayoutDashboard, Package, ShoppingCart, Settings, X, ChevronsLeft, LogOut } from 'lucide-react';

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
            <div
                className={`fixed inset-0 bg-black bg-opacity-60 z-30 md:hidden ${isMobileOpen ? 'block' : 'hidden'}`}
                onClick={onCloseMobileMenu}
            ></div>

            <aside
                className={`
          fixed top-0 left-0 h-full z-40 bg-gray-900 text-white flex flex-col
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-24' : 'w-64'}
          md:relative md:translate-x-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700 flex-shrink-0">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                            {user?.firstName.charAt(0)}
                        </div>
                        <span className={`ml-3 font-medium text-white whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                            {user?.firstName} {user?.lastName}
                        </span>
                    </div>

                    <div className="flex items-center">
                        <button
                            onClick={onToggleCollapse}
                            className={`hidden md:block p-2 rounded-full text-gray-300 hover:bg-gray-700 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : 'rotate-0'}`}
                            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            <ChevronsLeft size={24} />
                        </button>
                        <button onClick={onCloseMobileMenu} className="md:hidden p-1 rounded-full hover:bg-gray-700">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <NavLink
                                key={link.label}
                                to={link.to}
                                onClick={onCloseMobileMenu}
                                title={isCollapsed ? link.label : undefined}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 py-3 rounded-lg font-medium transition-colors duration-200
                   ${isCollapsed ? 'px-4 justify-center' : 'px-4'}
                   ${isActive
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`
                                }
                            >
                                <Icon size={24} className="flex-shrink-0" />
                                <span className={`whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                                    {link.label}
                                </span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="px-3 py-4 border-t border-gray-700 flex-shrink-0">
                    <button
                        onClick={logout}
                        title="Logout"
                        className={`flex items-center gap-4 w-full py-3 rounded-lg font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors duration-200
                      ${isCollapsed ? 'px-4 justify-center' : 'px-4'}`}
                    >
                        <LogOut size={24} className="flex-shrink-0" />
                        <span className={`whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                            Logout
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
}