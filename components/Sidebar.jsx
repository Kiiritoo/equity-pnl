'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Calendar,
    List,
    Import,
    Moon,
    Sun,
    Clock,
    LogOut,
    Globe
} from 'lucide-react';
import { useTrades, TIME_ZONES, COMMON_CURRENCIES } from '@/context/TradeContext';

const Sidebar = ({ onImportClick, mobileOpen, setMobileOpen }) => {
    const {
        logout,
        currency,
        updateSettings,
        timeZone,
        theme,
        user
    } = useTrades();
    const pathname = usePathname();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <Calendar size={20} />, label: 'PnL Calendar', path: '/calendar' },
        { icon: <List size={20} />, label: 'Trade List', path: '/trades' },
    ];

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        updateSettings({ theme: newTheme });
    };

    return (
        <>
            <div className={`sidebar-overlay ${mobileOpen ? 'active' : ''}`} onClick={() => setMobileOpen(false)}></div>
            <aside className={`app-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-container">
                        <div className="logo-icon">ET</div>
                        <span className="logo-text">Equity Tracker</span>
                    </div>
                </div>

                <div className="user-profile" style={{ padding: '0 20px', marginBottom: '24px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Active Account</div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px' }}>{user?.username || user?.email || 'Trader'}</div>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`nav-item ${pathname === item.path ? 'active' : ''}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                    <button className="nav-item" onClick={() => { onImportClick(); setMobileOpen(false); }}>
                        <Import size={20} />
                        <span>Import Trades</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="settings-group">
                        <div className="settings-label">
                            <Globe size={16} />
                            <span>Currency</span>
                        </div>
                        <select
                            className="sidebar-select"
                            value={currency}
                            onChange={(e) => updateSettings({ currency: e.target.value })}
                        >
                            {COMMON_CURRENCIES.map(curr => (
                                <option key={curr.code} value={curr.code}>{curr.code} ({curr.symbol})</option>
                            ))}
                        </select>
                    </div>

                    <div className="settings-group">
                        <div className="settings-label">
                            <Clock size={16} />
                            <span>Time Zone</span>
                        </div>
                        <select
                            className="sidebar-select"
                            value={timeZone}
                            onChange={(e) => updateSettings({ timeZone: e.target.value })}
                        >
                            {TIME_ZONES.map(tz => (
                                <option key={tz.value} value={tz.value}>{tz.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="sidebar-actions">
                        <button className="theme-toggle" onClick={toggleTheme}>
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                        </button>
                        <button className="logout-btn" onClick={logout}>
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
