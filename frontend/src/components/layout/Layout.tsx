import { useState, useCallback, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        return localStorage.getItem('sidebarCollapsed') === 'true';
    });

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', String(isSidebarCollapsed));
    }, [isSidebarCollapsed]);

    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prev => !prev);
    }, []);

    const toggleSidebarCollapsed = useCallback(() => {
        setIsSidebarCollapsed(prev => !prev);
    }, []);

    return (
        <div className="h-screen flex bg-gray-100 dark:bg-gray-900">
            <Sidebar
                isMobileOpen={isMobileMenuOpen}
                isCollapsed={isSidebarCollapsed}
                onCloseMobileMenu={toggleMobileMenu}
                onToggleCollapse={toggleSidebarCollapsed}
            />

            <div
                className={`
          flex-1 flex flex-col overflow-hidden
          transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}
        `}
            >
                <Header
                    onMobileMenuToggle={toggleMobileMenu}
                />

                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}