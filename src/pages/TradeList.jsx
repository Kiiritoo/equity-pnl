import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import { Trash2 } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import '../styles/index.css';

const TradeList = () => {
    const { trades, loading, deleteTrade, deleteAllTrades, currency, formatDate, formatCurrency } = useTrades();
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

    if (trades.length === 0) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <h2>No trades found</h2>
                <p>Import a CSV file to see your trade history.</p>
            </div>
        );
    }

    const handleDeleteClick = (id) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            deleteTrade(deleteId);
            setDeleteId(null);
        }
    };

    const handleConfirmDeleteAll = () => {
        deleteAllTrades();
        setIsDeleteAllOpen(false);
    };

    return (
        <div className="trade-list">
            <ConfirmDialog
                isOpen={!!deleteId}
                title="Delete Trade"
                message="Are you sure you want to delete this trade record?"
                confirmText="Delete"
                isDestructive={true}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteId(null)}
            />

            <ConfirmDialog
                isOpen={isDeleteAllOpen}
                title="Delete All Trades"
                message="Are you sure you want to delete ALL trade records? This action cannot be undone."
                confirmText="Delete All"
                isDestructive={true}
                onConfirm={handleConfirmDeleteAll}
                onCancel={() => setIsDeleteAllOpen(false)}
            />

            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 className="page-title">Trade History</h1>
                <button
                    onClick={() => setIsDeleteAllOpen(true)}
                    style={{
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--danger)',
                        color: 'var(--danger)',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'transparent',
                        cursor: 'pointer'
                    }}
                >
                    <Trash2 size={14} /> Delete All
                </button>
            </div>

            <div style={{
                overflowX: 'auto',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '12px' }}>Open Time</th>
                            <th style={{ padding: '12px' }}>Close Time</th>
                            <th style={{ padding: '12px' }}>Symbol</th>
                            <th style={{ padding: '12px' }}>Type</th>
                            <th style={{ padding: '12px' }}>Vol</th>
                            <th style={{ padding: '12px' }}>Open</th>
                            <th style={{ padding: '12px' }}>Close</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Net Profit</th>
                            <th style={{ padding: '12px', textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trades.map((trade) => (
                            <tr key={trade.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '14px' }}>
                                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                                    {formatDate(trade.openTime, 'yyyy-MM-dd HH:mm:ss')}
                                </td>
                                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                                    {formatDate(trade.closeTime, 'yyyy-MM-dd HH:mm:ss')}
                                </td>
                                <td style={{ padding: '12px', fontWeight: '500' }}>{trade.symbol}</td>
                                <td style={{
                                    padding: '12px',
                                    textTransform: 'uppercase',
                                    color: trade.type === 'buy' ? 'var(--success)' : 'var(--danger)',
                                    fontWeight: '600',
                                    fontSize: '12px'
                                }}>
                                    {trade.type}
                                </td>
                                <td style={{ padding: '12px' }}>{trade.volume}</td>
                                <td style={{ padding: '12px' }}>{trade.openPrice}</td>
                                <td style={{ padding: '12px' }}>{trade.closePrice}</td>
                                <td style={{
                                    padding: '12px',
                                    textAlign: 'right',
                                    fontWeight: '600',
                                    color: trade.netProfit >= 0 ? 'var(--success)' : 'var(--danger)'
                                }}>
                                    {trade.netProfit >= 0 ? '+' : ''}{formatCurrency(trade.netProfit).replace('-', '')}
                                </td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <button
                                        onClick={() => handleDeleteClick(trade.id)}
                                        style={{ color: 'var(--text-secondary)', transition: 'color 0.2s', cursor: 'pointer' }}
                                        title="Delete trade"
                                    >
                                        <Trash2 size={16} className="item-hover-danger" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TradeList;
