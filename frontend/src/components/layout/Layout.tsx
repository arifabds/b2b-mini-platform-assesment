import { useState, useCallback, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        return localStorage.getItem('sidebarCollapsed') === 'true';
    });

    // Persist sidebar collapsed state to localStorage
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

            {/* Main content area with responsive sidebar spacing */}
            <div
                className={`
          flex-1 flex flex-col overflow-hidden
          transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'md:ml-24' : 'md:ml-28'}
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