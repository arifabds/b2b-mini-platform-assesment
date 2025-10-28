import { NavLink } from 'react-router-dom';

const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/products', label: 'Products' },
    { to: '/orders', label: 'Orders' },
    { to: '/settings', label: 'Settings' },
];

export default function Sidebar() {
    return (
        <div className="w-64 bg-gray-900 text-white flex flex-col">
            <div className="p-6 text-2xl font-bold text-white">
                B2B Panel
            </div>
            <nav className="flex-1 px-4 py-2 space-y-2">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.label}
                        to={link.to}
                        className={({ isActive }) =>
                            `block px-4 py-2 rounded-lg transition-colors duration-200 ${
                                isActive
                                    ? 'bg-indigo-600 text-white font-semibold'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}