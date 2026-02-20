import React, { createContext, useState, useEffect, useContext } from 'react';
import { parseExnessCSV } from '../utils/parsers/exness';
import { format as formatDateFns } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const TradeContext = createContext();

export const useTrades = () => useContext(TradeContext);

// Predefined common currencies. We'll support any ISO code via Intl.NumberFormat.
const COMMON_CURRENCIES = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

export const TradeProvider = ({ children }) => {
    const [trades, setTrades] = useState([]);
    const [initialBalance, setInitialBalance] = useState(0);
    const [currency, setCurrency] = useState('USD');
    const [timeZone, setTimeZone] = useState('Asia/Jakarta');
    const [theme, setTheme] = useState('light'); // Default to light
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Load from local storage on mount
        const savedTrades = localStorage.getItem('pnLTracker_trades');
        const savedBalance = localStorage.getItem('pnLTracker_initialBalance');
        const savedCurrency = localStorage.getItem('pnLTracker_currency');
        const savedTimeZone = localStorage.getItem('pnLTracker_timeZone');
        const savedTheme = localStorage.getItem('pnLTracker_theme');

        if (savedTrades) {
            try {
                const parsedTrades = JSON.parse(savedTrades).map(t => ({
                    ...t,
                    openTime: new Date(t.openTime),
                    closeTime: new Date(t.closeTime)
                }));
                setTrades(parsedTrades);
            } catch (e) {
                console.error("Failed to parse saved trades", e);
            }
        }

        if (savedBalance) setInitialBalance(parseFloat(savedBalance));
        if (savedCurrency) setCurrency(savedCurrency);
        if (savedTimeZone) setTimeZone(savedTimeZone);
        if (savedTheme) setTheme(savedTheme);

        setLoading(false);
    }, []);

    useEffect(() => {
        localStorage.setItem('pnLTracker_initialBalance', initialBalance.toString());
    }, [initialBalance]);

    useEffect(() => {
        localStorage.setItem('pnLTracker_currency', currency);
    }, [currency]);

    useEffect(() => {
        localStorage.setItem('pnLTracker_timeZone', timeZone);
    }, [timeZone]);

    useEffect(() => {
        localStorage.setItem('pnLTracker_theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const saveTrades = (newTrades) => {
        setTrades(newTrades);
        localStorage.setItem('pnLTracker_trades', JSON.stringify(newTrades));
    };

    const updateInitialBalance = (amount) => {
        setInitialBalance(amount);
    };

    const setCurrencyAndSave = (newCurrency) => {
        setCurrency(newCurrency);
    };

    const setTimeZoneAndSave = (newTimeZone) => {
        setTimeZone(newTimeZone);
    };

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    // Helper to format currency values
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
            // Fallback for custom or unsupported currency codes
            return `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    };

    // Helper to format dates according to selected Time Zone
    const formatDate = (date, formatStr = 'yyyy-MM-dd HH:mm') => {
        if (!date) return '';
        if (timeZone === 'Local') {
            return formatDateFns(date, formatStr);
        }
        const zonedDate = toZonedTime(date, timeZone);
        return formatDateFns(zonedDate, formatStr);
    };

    const importExnessTrades = async (file) => {
        setLoading(true);
        setError(null);
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const csvContent = e.target.result;
                    const parsedTrades = await parseExnessCSV(csvContent);

                    setTrades(prev => {
                        const newTrades = [...prev];
                        parsedTrades.forEach(trade => {
                            if (!newTrades.some(t => t.id === trade.id)) {
                                newTrades.push(trade);
                            }
                        });
                        newTrades.sort((a, b) => b.closeTime - a.closeTime);

                        saveTrades(newTrades);
                        return newTrades;
                    });
                } catch (err) {
                    setError("Failed to parse CSV. Ensure it is a valid Exness export.");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            reader.readAsText(file);
        } catch (err) {
            setError("Failed to read file.");
            setLoading(false);
        }
    };

    const deleteTrade = (id) => {
        const newTrades = trades.filter(t => t.id !== id);
        saveTrades(newTrades);
    };

    const deleteAllTrades = () => {
        setTrades([]);
        localStorage.removeItem('pnLTracker_trades');
    };

    const clearTrades = () => {
        setTrades([]);
        setInitialBalance(0);
        localStorage.removeItem('pnLTracker_trades');
        localStorage.removeItem('pnLTracker_initialBalance');
    };

    return (
        <TradeContext.Provider value={{
            trades,
            initialBalance,
            currency,
            timeZone,
            theme,
            loading,
            error,
            importExnessTrades,
            deleteTrade,
            deleteAllTrades,
            clearTrades,
            updateInitialBalance,
            setCurrency: setCurrencyAndSave,
            setTimeZone: setTimeZoneAndSave,
            toggleTheme,
            formatDate,
            formatCurrency,
            COMMON_CURRENCIES
        }}>
            {children}
        </TradeContext.Provider>
    );
};
