'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useTrades } from '@/context/TradeContext';
import Sidebar from '@/components/Sidebar';
import { parseExnessCSV } from '@/lib/utils/parsers/exness';

export default function DashboardLayout({ children }) {
    const { user, loading, setTrades, error } = useTrades();
    const router = useRouter();
    const fileInputRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const rawTrades = await parseExnessCSV(file);

            // Send to backend for persistence
            const res = await fetch('/api/trades', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trades: rawTrades })
            });

            if (res.ok) {
                // Refresh trades from server
                const tradesRes = await fetch('/api/trades');
                if (tradesRes.ok) {
                    const data = await tradesRes.json();
                    setTrades(data.trades);
                }
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to import trades');
            }
        } catch (err) {
            console.error('Import failed:', err);
            alert('Failed to parse CSV file');
        } finally {
            event.target.value = ''; // Reset input
        }
    };

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                Loading Equity Tracker...
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="app-container">
            {/* Mobile Header */}
            <header className="mobile-header">
                <div className="logo">
                    <span style={{ color: 'var(--accent-primary)' }}>ET</span> Equity Tracker
                </div>
                <button className="hamburger" onClick={() => setIsSidebarOpen(true)}>
                    <Menu size={24} />
                </button>
            </header>

            <Sidebar
                onImportClick={handleImportClick}
                mobileOpen={isSidebarOpen}
                setMobileOpen={setIsSidebarOpen}
            />

            <main className="main-content">
                {error && (
                    <div style={{
                        backgroundColor: 'rgba(246, 70, 93, 0.1)',
                        color: 'var(--danger)',
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '16px',
                        border: '1px solid rgba(246, 70, 93, 0.2)'
                    }}>
                        {error}
                    </div>
                )}
                {children}
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
}
