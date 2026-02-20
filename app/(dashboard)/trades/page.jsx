'use client';

import React, { useState } from 'react';
import {
    Trash2,
    ArrowUpRight,
    ArrowDownLeft,
    Calendar as CalendarIcon,
    AlertCircle,
    ChevronDown,
    Filter
} from 'lucide-react';
import { useTrades } from '@/context/TradeContext';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function TradeList() {
    const {
        trades,
        loading,
        formatCurrency,
        formatDate,
        setTrades
    } = useTrades();

    const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
    const [tradeToDelete, setTradeToDelete] = useState(null);

    const handleDeleteAll = async () => {
        const res = await fetch('/api/trades?all=true', { method: 'DELETE' });
        if (res.ok) {
            setTrades([]);
            setIsDeleteAllOpen(false);
        }
    };

    const handleDeleteTrade = async () => {
        if (!tradeToDelete) return;
        const res = await fetch(`/api/trades?id=${tradeToDelete}`, { method: 'DELETE' });
        if (res.ok) {
            setTrades(prev => prev.filter(t => t.id !== tradeToDelete));
            setTradeToDelete(null);
        }
    };

    if (loading) return <div className="loading-state">Loading trades...</div>;

    return (
        <div className="trade-list-page">
            <ConfirmDialog
                isOpen={isDeleteAllOpen}
                onClose={() => setIsDeleteAllOpen(false)}
                onConfirm={handleDeleteAll}
                title="Delete All Trades"
                message="Are you sure you want to permanently delete your entire trading history? This cannot be undone."
            />

            <ConfirmDialog
                isOpen={!!tradeToDelete}
                onClose={() => setTradeToDelete(null)}
                onConfirm={handleDeleteTrade}
                title="Delete Trade"
                message="Are you sure you want to delete this specific trade record?"
            />

            <div className="dashboard-header">
                <div>
                    <h1 className="page-title">Trade History</h1>
                    <p className="page-subtitle">{trades.length} records found in total</p>
                </div>
                <div className="dashboard-actions">
                    <button className="btn btn-secondary">
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                    <button
                        className="btn btn-outline-danger"
                        onClick={() => setIsDeleteAllOpen(true)}
                        disabled={trades.length === 0}
                    >
                        <Trash2 size={18} />
                        <span>Clear All</span>
                    </button>
                </div>
            </div>

            <div className="table-container card">
                {trades.length === 0 ? (
                    <div className="empty-state">
                        <AlertCircle size={48} />
                        <h3>No trades found</h3>
                        <p>Import your Exness CSV to see your trading performance records.</p>
                    </div>
                ) : (
                    <table className="trade-table">
                        <thead>
                            <tr>
                                <th>Symbol <ChevronDown size={14} /></th>
                                <th>Type</th>
                                <th>Volume</th>
                                <th>Open Price</th>
                                <th>Close Price</th>
                                <th>Close Time</th>
                                <th>Net Profit</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trades.map((trade) => (
                                <tr key={trade.id}>
                                    <td className="symbol-cell">{trade.symbol}</td>
                                    <td>
                                        <div className={`type-badge ${trade.type}`}>
                                            {trade.type === 'buy' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                                            {trade.type.toUpperCase()}
                                        </div>
                                    </td>
                                    <td className="mono">{trade.volume.toFixed(2)}</td>
                                    <td className="mono">{trade.openPrice.toFixed(5)}</td>
                                    <td className="mono">{trade.closePrice.toFixed(5)}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <CalendarIcon size={14} />
                                            {formatDate(trade.closeTime)}
                                        </div>
                                    </td>
                                    <td className={`profit-cell ${trade.netProfit >= 0 ? 'success' : 'danger'}`}>
                                        {trade.netProfit >= 0 ? '+' : ''}{formatCurrency(trade.netProfit)}
                                    </td>
                                    <td>
                                        <button
                                            className="icon-btn delete"
                                            onClick={() => setTradeToDelete(trade.id)}
                                            title="Delete Record"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
