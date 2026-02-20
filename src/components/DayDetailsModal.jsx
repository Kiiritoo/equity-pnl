import React from 'react';
import { X } from 'lucide-react';
import { useTrades } from '../context/TradeContext';

const DayDetailsModal = ({ isOpen, onClose, date, trades }) => {
    const { formatCurrency, formatDate } = useTrades();

    if (!isOpen) return null;

    const totalPnL = trades.reduce((sum, t) => sum + t.netProfit, 0);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }} onClick={e => e.stopPropagation()}>

                <div style={{
                    padding: '20px',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: '600' }}>
                            {date && formatDate(new Date(date), 'MMMM d, yyyy')}
                        </h2>
                        <span style={{
                            fontSize: '14px',
                            color: totalPnL >= 0 ? 'var(--success)' : 'var(--danger)',
                            fontWeight: '500'
                        }}>
                            Daily Total: {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL).replace('-', '')}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px',
                            borderRadius: '50%',
                            color: 'var(--text-secondary)',
                            backgroundColor: 'var(--bg-tertiary)',
                            cursor: 'pointer',
                            border: 'none'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div style={{ overflowY: 'auto', padding: '20px' }}>
                    {trades.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No trades for this day.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {trades.map((trade) => (
                                <div key={trade.id} style={{
                                    backgroundColor: 'var(--bg-primary)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '16px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{trade.symbol}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <span>Open: {formatDate(new Date(trade.openTime), 'HH:mm:ss')}</span>
                                                    <span>Close: {formatDate(new Date(trade.closeTime), 'HH:mm:ss')}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{
                                            fontSize: '11px',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            backgroundColor: trade.type === 'buy' ? 'rgba(14, 203, 129, 0.1)' : 'rgba(246, 70, 93, 0.1)',
                                            color: trade.type === 'buy' ? 'var(--success)' : 'var(--danger)'
                                        }}>
                                            {trade.type}
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                            Vol: {trade.volume}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{
                                            fontWeight: '600',
                                            color: trade.netProfit >= 0 ? 'var(--success)' : 'var(--danger)'
                                        }}>
                                            {trade.netProfit >= 0 ? '+' : ''}{formatCurrency(trade.netProfit).replace('-', '')}
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                            {trade.closePrice}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DayDetailsModal;
