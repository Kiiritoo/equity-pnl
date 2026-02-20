import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, List, Upload, Sun, Moon, Globe, DollarSign, X } from 'lucide-react';
import { useTrades } from '../context/TradeContext';
import '../styles/layout.css';

const TIMEZONES = [
    { value: 'Pacific/Honolulu', label: '(UTC-10) Honolulu' },
    { value: 'America/Anchorage', label: '(UTC-09) Anchorage' },
    { value: 'America/Los_Angeles', label: '(UTC-08) Los Angeles' },
    { value: 'America/Phoenix', label: '(UTC-07) Phoenix' },
    { value: 'America/Denver', label: '(UTC-07) Denver' },
    { value: 'America/Chicago', label: '(UTC-06) Chicago' },
    { value: 'America/New_York', label: '(UTC-05) New York' },
    { value: 'America/Sao_Paulo', label: '(UTC-03) Sao Paulo' },
    { value: 'UTC', label: '(UTC+00) UTC / London' },
    { value: 'Europe/Paris', label: '(UTC+01) Paris / Berlin' },
    { value: 'Europe/Istanbul', label: '(UTC+03) Istanbul' },
    { value: 'Asia/Dubai', label: '(UTC+04) Dubai' },
    { value: 'Asia/Kolkata', label: '(UTC+05:30) Mumbai' },
    { value: 'Asia/Bangkok', label: '(UTC+07) Bangkok' },
    { value: 'Asia/Jakarta', label: '(UTC+07) Jakarta' },
    { value: 'Asia/Singapore', label: '(UTC+08) Singapore' },
    { value: 'Asia/Tokyo', label: '(UTC+09) Tokyo' },
    { value: 'Australia/Sydney', label: '(UTC+10) Sydney' },
    { value: 'Pacific/Auckland', label: '(UTC+12) Auckland' },
    { value: 'Local', label: 'Local Time' }
];

const Sidebar = ({ onImportClick, isOpen, onClose }) => {
    const { timeZone, setTimeZone, theme, toggleTheme, currency, setCurrency, COMMON_CURRENCIES } = useTrades();

    return (
        <div className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
            <div className="sidebar-header">
                <div className="logo">
                    <span style={{ color: 'var(--accent-primary)' }}>Equity</span>Tracker
                </div>
                <button className="mobile-close" onClick={onClose}>
                    <X size={24} />
                </button>
            </div>

            <nav className="nav-links">
                <NavLink
                    to="/"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    onClick={onClose}
                >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/calendar"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    onClick={onClose}
                >
                    <Calendar size={20} />
                    <span>PnL Calendar</span>
                </NavLink>

                <NavLink
                    to="/trades"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    onClick={onClose}
                >
                    <List size={20} />
                    <span>Trade List</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <div className="selector-group">
                    <div className="selector-item">
                        <Globe size={16} />
                        <select
                            value={timeZone}
                            onChange={(e) => setTimeZone(e.target.value)}
                        >
                            {TIMEZONES.map(tz => (
                                <option key={tz.value} value={tz.value}>{tz.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="selector-item">
                        <DollarSign size={16} />
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            {COMMON_CURRENCIES.map(c => (
                                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>

                <button className="import-btn" onClick={() => { onImportClick(); onClose(); }}>
                    <Upload size={20} />
                    <span>Import CSV</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
