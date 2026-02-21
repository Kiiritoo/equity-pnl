'use client';

import React, { useState, useMemo } from 'react';
import {
    TrendingUp,
    TrendingDown,
    BarChart3,
    PieChart as PieChartIcon,
    RotateCcw,
    Edit2,
    Check,
    X,
    List,
    Wallet
} from 'lucide-react';
import { useTrades } from '@/context/TradeContext';
import { calculateStats, getDailyPnL, calculateEquityCurve, calculateWithdrawalStats } from '@/lib/utils/pnlEngine';
import EquityChart from '@/components/EquityChart';
import ConfirmDialog from '@/components/ConfirmDialog';
import WithdrawalModal from '@/components/WithdrawalModal';
import { format } from 'date-fns';

export default function Dashboard() {
    const {
        trades,
        withdrawals,
        initialBalance,
        updateSettings,
        timeZone,
        formatCurrency,
        setTrades,
        setWithdrawals,
        updateWithdrawal,
        deleteWithdrawal
    } = useTrades();

    const [isEditingBalance, setIsEditingBalance] = useState(false);
    const [tempBalance, setTempBalance] = useState(initialBalance);
    const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingWithdrawal, setEditingWithdrawal] = useState(null);

    const stats = useMemo(() => calculateStats(trades, initialBalance), [trades, initialBalance]);
    const withdrawalStats = useMemo(() => calculateWithdrawalStats(withdrawals), [withdrawals]);
    const equityData = useMemo(() => calculateEquityCurve(trades, withdrawals, initialBalance, timeZone), [trades, withdrawals, initialBalance, timeZone]);

    const handleSaveBalance = () => {
        updateSettings({ initialBalance: parseFloat(tempBalance) });
        setIsEditingBalance(false);
    };

    const handleResetData = async () => {
        const res = await fetch('/api/trades?all=true', { method: 'DELETE' });
        if (res.ok) {
            setTrades([]);
            setWithdrawals([]);
            setIsResetConfirmOpen(false);
        }
    };

    const handleEditWithdrawal = (withdrawal) => {
        setEditingWithdrawal(withdrawal);
        setIsEditModalOpen(true);
    };

    const StatCard = ({ title, value, icon, trend, subValue }) => (
        <div className="stat-card">
            <div className="stat-card-header">
                <span className="stat-card-title">{title}</span>
                <span className="stat-card-icon">{icon}</span>
            </div>
            <div className="stat-card-value">{value}</div>
            <div className="stat-card-footer">
                {trend && (
                    <span className={`stat-card-trend ${trend > 0 ? 'up' : 'down'}`}>
                        {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {Math.abs(trend).toFixed(2)}%
                    </span>
                )}
                <span className="stat-card-subtext">{subValue}</span>
            </div>
        </div>
    );

    return (
        <div className="dashboard-page">
            <ConfirmDialog
                isOpen={isResetConfirmOpen}
                onClose={() => setIsResetConfirmOpen(false)}
                onConfirm={handleResetData}
                title="Reset All Data"
                message="Are you sure you want to delete all trades and withdrawals? This action will reset your progress completely and cannot be undone."
            />

            <WithdrawalModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingWithdrawal(null);
                }}
                onEdit={updateWithdrawal}
                initialData={editingWithdrawal}
            />

            <div className="dashboard-header">
                <div>
                    <h1 className="page-title">Trading Dashboard</h1>
                    <p className="page-subtitle">Overview of your performance and equity growth</p>
                </div>
                <div className="dashboard-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setIsResetConfirmOpen(true)}
                    >
                        <RotateCcw size={18} />
                        <span>Reset Data</span>
                    </button>
                    <div className="balance-editor">
                        {isEditingBalance ? (
                            <div className="edit-balance-form">
                                <input
                                    type="number"
                                    value={tempBalance}
                                    onChange={(e) => setTempBalance(e.target.value)}
                                    className="balance-input"
                                    autoFocus
                                />
                                <button className="icon-btn success" onClick={handleSaveBalance}><Check size={18} /></button>
                                <button className="icon-btn danger" onClick={() => setIsEditingBalance(false)}><X size={18} /></button>
                            </div>
                        ) : (
                            <div className="display-balance" onClick={() => { setTempBalance(initialBalance); setIsEditingBalance(true); }}>
                                <span className="label">Initial Balance:</span>
                                <span className="value">{formatCurrency(initialBalance)}</span>
                                <Edit2 size={14} className="edit-icon" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard
                    title="Total Net Profit"
                    value={formatCurrency(stats.totalNetProfit)}
                    icon={<BarChart3 size={20} />}
                    trend={initialBalance > 0 ? (stats.totalNetProfit / initialBalance) * 100 : 0}
                    subValue="Overall performance"
                />
                <StatCard
                    title="Win Rate"
                    value={`${stats.winRate.toFixed(2)}%`}
                    icon={<PieChartIcon size={20} />}
                    subValue={`${stats.winningTrades} winning trades`}
                />
                <StatCard
                    title="Profit Factor"
                    value={stats.profitFactor.toFixed(2)}
                    icon={<TrendingUp size={20} />}
                    subValue="Gross Profit / Gross Loss"
                />
                <StatCard
                    title="Total Trades"
                    value={stats.totalTrades}
                    icon={<List size={20} />}
                    subValue="Execution frequency"
                />
                <StatCard
                    title="Total Withdrawn"
                    value={formatCurrency(withdrawalStats.totalWithdrawn)}
                    icon={<Wallet size={20} />}
                    subValue={`${withdrawalStats.withdrawalCount} transactions`}
                />
            </div>

            <div className="dashboard-charts">
                <EquityChart data={equityData} />
                <div className="secondary-stats">
                    <div className="stat-item">
                        <span className="label">Max Drawdown</span>
                        <span className="value danger">{formatCurrency(stats.maxDrawdown)}</span>
                    </div>
                    <div className="stat-item">
                        <span className="label">Average Win</span>
                        <span className="value success">{formatCurrency(stats.averageWin)}</span>
                    </div>
                    <div className="stat-item">
                        <span className="label">Average Loss</span>
                        <span className="value danger">{formatCurrency(stats.averageLoss)}</span>
                    </div>
                    <div className="stat-item">
                        <span className="label">Winning Ratio</span>
                        <span className="value">{stats.winningTrades}:{stats.losingTrades}</span>
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginTop: '32px', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Withdrawal History</h2>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{withdrawals.length} transactions</span>
                </div>
                {withdrawals.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'var(--bg-tertiary)' }}>
                                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Date</th>
                                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Amount</th>
                                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Note</th>
                                    <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {withdrawals.map((w) => (
                                    <tr key={w.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '12px 24px', fontSize: '14px' }}>{format(new Date(w.date), 'MMM d, yyyy')}</td>
                                        <td style={{ padding: '12px 24px', fontSize: '14px', fontWeight: '700', color: 'var(--danger)' }}>-{formatCurrency(w.amount)}</td>
                                        <td style={{ padding: '12px 24px', fontSize: '13px', color: 'var(--text-secondary)' }}>{w.note || '-'}</td>
                                        <td style={{ padding: '12px 24px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button className="icon-btn" onClick={() => handleEditWithdrawal(w)} title="Edit"><Edit2 size={16} /></button>
                                                <button className="icon-btn danger" onClick={() => deleteWithdrawal(w.id)} title="Delete"><X size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                        No withdrawals recorded yet.
                    </div>
                )}
            </div>
        </div>
    );
}
