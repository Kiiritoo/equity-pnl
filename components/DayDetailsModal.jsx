'use client';

import React from 'react';
import { X } from 'lucide-react';
import { useTrades } from '@/context/TradeContext';

const DayDetailsModal = ({ isOpen, onClose, date, trades }) => {
    const { formatCurrency, formatDate } = useTrades();

    if (!isOpen) return null;

    const totalPnL = trades.reduce((sum, t) => sum + t.netProfit, 0);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-header-info">
                        <h2>{date && formatDate(new Date(date), 'MMMM d, yyyy')}</h2>
                        <span className={`subtitle ${totalPnL >= 0 ? 'success' : 'danger'}`}>
                            Daily Total: {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
                        </span>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    {trades.length === 0 ? (
                        <p className="empty-message" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No trades for this day.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {trades.map((trade) => (
                                <div key={trade.id} className="day-trade-card">
                                    <div className="trade-info-main">
                                        <div className="trade-symbol-group">
                                            <div className="symbol">{trade.symbol}</div>
                                            <div className="trade-time-group">
                                                <span>Open: {formatDate(new Date(trade.openTime), 'HH:mm:ss')}</span>
                                                <span>Close: {formatDate(new Date(trade.closeTime), 'HH:mm:ss')}</span>
                                            </div>
                                        </div>
                                        <div className={`type-badge ${trade.type}`}>
                                            {trade.type}
                                        </div>
                                        <div className="mono" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                            Vol: {trade.volume}
                                        </div>
                                    </div>
                                    <div className="trade-profit-group">
                                        <div className={`pnl ${trade.netProfit >= 0 ? 'success' : 'danger'}`}>
                                            {trade.netProfit >= 0 ? '+' : ''}{formatCurrency(trade.netProfit)}
                                        </div>
                                        <div className="price mono">
                                            {trade.closePrice.toFixed(5)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default DayDetailsModal;
