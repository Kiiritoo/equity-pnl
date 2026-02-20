'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format as formatDateFns } from 'date-fns';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

const TradeContext = createContext();

export const COMMON_CURRENCIES = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' }
];

export const TIME_ZONES = [
    { value: 'Asia/Jakarta', label: '(UTC+7) Jakarta' },
    { value: 'UTC', label: '(UTC+0) London / UTC' },
    { value: 'America/New_York', label: '(UTC-5) New York' },
    { value: 'Asia/Tokyo', label: '(UTC+9) Tokyo' },
    { value: 'Europe/Berlin', label: '(UTC+1) Berlin' },
    { value: 'Asia/Singapore', label: '(UTC+8) Singapore' },
    { value: 'Local', label: 'Local Time' }
];

export const TradeProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [trades, setTrades] = useState([]);
    const [initialBalance, setInitialBalance] = useState(0);
    const [currency, setCurrency] = useState('USD');
    const [timeZone, setTimeZone] = useState('UTC');
    const [theme, setTheme] = useState('light');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    setInitialBalance(data.user.initialBalance || 0);
                    setCurrency(data.user.currency || 'USD');
                    setTimeZone(data.user.timeZone || 'UTC');
                    setTheme(data.user.theme || 'light');
                    fetchTrades();
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error('Auth check failed:', err);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const fetchTrades = async () => {
        try {
            const res = await fetch('/api/trades');
            if (res.ok) {
                const data = await res.json();
                setTrades(data.trades);
            }
        } catch (err) {
            console.error('Fetch trades failed:', err);
        }
    };

    const logout = async () => {
        const res = await fetch('/api/auth/logout', { method: 'POST' });
        if (res.ok) {
            setUser(null);
            router.push('/login');
        }
    };

    const formatCurrency = (amount, options = {}) => {
        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                ...options
            }).format(amount);
        } catch (e) {
            return `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    };

    const formatDate = (date, formatStr = 'yyyy-MM-dd HH:mm') => {
        if (!date) return '';
        const d = new Date(date);
        if (timeZone === 'Local') {
            return formatDateFns(d, formatStr);
        }
        const zonedDate = toZonedTime(d, timeZone);
        return formatDateFns(zonedDate, formatStr);
    };

    const updateSettings = async (settings) => {
        try {
            const res = await fetch('/api/user/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                const data = await res.json();
                if (settings.initialBalance !== undefined) setInitialBalance(data.initialBalance);
                if (settings.currency !== undefined) setCurrency(data.currency);
                if (settings.timeZone !== undefined) setTimeZone(data.timeZone);
                if (settings.theme !== undefined) setTheme(data.theme);
            }
        } catch (err) {
            console.error('Update settings failed:', err);
        }
    };

    return (
        <TradeContext.Provider value={{
            user,
            trades,
            initialBalance,
            currency,
            timeZone,
            theme,
            loading,
            error,
            logout,
            fetchTrades,
            setTrades,
            updateSettings,
            formatDate,
            formatCurrency,
            COMMON_CURRENCIES,
            TIME_ZONES
        }}>
            {children}
        </TradeContext.Provider>
    );
};

export const useTrades = () => useContext(TradeContext);
