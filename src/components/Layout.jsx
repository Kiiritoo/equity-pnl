import React, { useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useTrades } from '../context/TradeContext';
import Sidebar from './Sidebar';
import '../styles/layout.css';

const Layout = () => {
    const { importExnessTrades, error } = useTrades();
    const fileInputRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleImportClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            await importExnessTrades(file);
            event.target.value = ''; // Reset input
        }
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="app-container">
            {/* Mobile Header */}
            <header className="mobile-header">
                <div className="logo">
                    <span style={{ color: 'var(--accent-primary)' }}>Equity</span>Tracker
                </div>
                <button className="hamburger" onClick={toggleSidebar}>
                    <Menu size={24} />
                </button>
            </header>

            <Sidebar
                onImportClick={handleImportClick}
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
            />

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 90
                    }}
                    onClick={closeSidebar}
                />
            )}

            <main className="main-content">
                {error && (
                    <div style={{
                        backgroundColor: 'rgba(246, 70, 93, 0.1)',
                        color: 'var(--danger)',
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '16px'
                    }}>
                        {error}
                    </div>
                )}
                <Outlet />
            </main>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default Layout;
