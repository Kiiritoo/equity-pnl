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
    List
} from 'lucide-react';
import { useTrades } from '@/context/TradeContext';
import { calculateStats, getDailyPnL, calculateEquityCurve } from '@/lib/utils/pnlEngine';
import EquityChart from '@/components/EquityChart';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function Dashboard() {
    const {
        trades,
        initialBalance,
        updateSettings,
        timeZone,
        formatCurrency,
        setTrades
    } = useTrades();

    const [isEditingBalance, setIsEditingBalance] = useState(false);
    const [tempBalance, setTempBalance] = useState(initialBalance);
    const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

    const stats = useMemo(() => calculateStats(trades, initialBalance), [trades, initialBalance]);
    const equityData = useMemo(() => calculateEquityCurve(trades, initialBalance, timeZone), [trades, initialBalance, timeZone]);

    const handleSaveBalance = () => {
        updateSettings({ initialBalance: parseFloat(tempBalance) });
        setIsEditingBalance(false);
    };

    const handleResetData = async () => {
        const res = await fetch('/api/trades?all=true', { method: 'DELETE' });
        if (res.ok) {
            setTrades([]);
            setIsResetConfirmOpen(false);
        }
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
                message="Are you sure you want to delete all trades and reset your progress? This action cannot be undone."
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
        </div>
    );
}
