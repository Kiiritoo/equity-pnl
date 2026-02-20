import React, { useMemo, useState, useEffect } from 'react';
import { DollarSign, Percent, TrendingUp, Activity, RotateCcw } from 'lucide-react';
import { useTrades } from '../context/TradeContext';
import { calculateStats, getDailyPnL, calculateEquityCurve } from '../utils/pnlEngine';
import ConfirmDialog from '../components/ConfirmDialog';
import EquityChart from '../components/EquityChart';
import '../styles/index.css';

const StatCard = ({ title, value, icon: Icon, subtext, color }) => (
    <div style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>{title}</span>
            <div style={{ padding: '8px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)' }}>
                <Icon size={18} color={color || 'var(--accent-primary)'} />
            </div>
        </div>
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            {value}
        </div>
        {subtext && (
            <div style={{
                fontSize: '13px',
                color: 'var(--text-muted)'
            }}>
                {subtext}
            </div>
        )}
    </div>
);

const Dashboard = () => {
    const { trades, loading, initialBalance, updateInitialBalance, clearTrades, currency, timeZone, formatCurrency, formatDate } = useTrades();
    const [isEditingBalance, setIsEditingBalance] = useState(false);
    const [tempBalance, setTempBalance] = useState(initialBalance);
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

    const stats = useMemo(() => calculateStats(trades), [trades]);
    const dailyPnL = useMemo(() => getDailyPnL(trades, timeZone).slice(0, 5), [trades, timeZone]);
    const equityData = useMemo(() => calculateEquityCurve(trades, initialBalance, timeZone), [trades, initialBalance, timeZone]);

    useEffect(() => {
        setTempBalance(initialBalance);
    }, [initialBalance]);

    const handleBalanceSubmit = () => {
        updateInitialBalance(parseFloat(tempBalance) || 0);
        setIsEditingBalance(false);
    };

    const handleResetConfirm = () => {
        clearTrades();
        setIsResetDialogOpen(false);
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading dashboard data...</div>;
    }

    const currentBalance = initialBalance + stats.totalPnL;

    return (
        <div className="dashboard">
            <ConfirmDialog
                isOpen={isResetDialogOpen}
                title="Reset All Data"
                message="Are you sure you want to delete all trades and reset your settings? This action cannot be undone."
                confirmText="Reset Data"
                isDestructive={true}
                onConfirm={handleResetConfirm}
                onCancel={() => setIsResetDialogOpen(false)}
            />

            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 className="page-title">Overview</h1>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button
                        onClick={() => setIsResetDialogOpen(true)}
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
                            cursor: 'pointer',
                            backgroundColor: 'transparent'
                        }}
                    >
                        <RotateCcw size={14} /> Reset Data
                    </button>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '24px',
                marginTop: '12px'
            }}>
                <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '24px',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Current Balance</span>
                        <div style={{ padding: '8px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)' }}>
                            <DollarSign size={18} color="var(--accent-primary)" />
                        </div>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                        {formatCurrency(currentBalance)}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Initial:
                        {isEditingBalance ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <input
                                    type="number"
                                    value={tempBalance}
                                    onChange={(e) => setTempBalance(e.target.value)}
                                    style={{
                                        width: '100px',
                                        backgroundColor: 'var(--bg-tertiary)',
                                        border: '1px solid var(--border-color)',
                                        color: 'var(--text-primary)',
                                        padding: '4px',
                                        borderRadius: '4px'
                                    }}
                                />
                                <button onClick={handleBalanceSubmit} style={{ color: 'var(--success)', fontSize: '12px', cursor: 'pointer' }}>Save</button>
                            </div>
                        ) : (
                            <span
                                onClick={() => setIsEditingBalance(true)}
                                style={{ borderBottom: '1px dashed var(--text-muted)', cursor: 'pointer' }}
                                title="Click to edit initial balance"
                            >
                                {formatCurrency(initialBalance)}
                            </span>
                        )}
                    </div>
                </div>

                <StatCard
                    title="Total Net PnL"
                    value={`${stats.totalPnL >= 0 ? '+' : ''}${formatCurrency(stats.totalPnL).replace('-', '')}`}
                    icon={DollarSign}
                    color={stats.totalPnL >= 0 ? 'var(--success)' : 'var(--danger)'}
                    subtext={`${stats.totalTrades} total trades processed`}
                />
                <StatCard
                    title="Win Rate"
                    value={`${stats.winRate.toFixed(1)}%`}
                    icon={Percent}
                    subtext={`${stats.wins} wins / ${stats.losses} losses`}
                />
                <StatCard
                    title="Profit Factor"
                    value={stats.profitFactor.toFixed(2)}
                    icon={TrendingUp}
                    subtext={`Avg Win: ${formatCurrency(stats.averageWin)}`}
                />
            </div>

            <div style={{ marginTop: '24px' }}>
                <EquityChart data={equityData} />
            </div>

            <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Recent Daily Performance</h2>
                    </div>

                    {dailyPnL.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', padding: '20px 0' }}>No trade data available. Import a CSV file to get started.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {dailyPnL.map((day) => (
                                <div key={day.date} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '12px 16px',
                                    backgroundColor: 'var(--bg-primary)',
                                    borderRadius: 'var(--radius-md)',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: '500' }}>{formatDate(new Date(day.date), 'MMMM d, yyyy')}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{day.trades} trades</div>
                                    </div>
                                    <div style={{
                                        fontWeight: '600',
                                        color: day.pnl >= 0 ? 'var(--success)' : 'var(--danger)'
                                    }}>
                                        {day.pnl >= 0 ? '+' : ''}{formatCurrency(day.pnl).replace('-', '')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Quick Stats</h2>
                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Best Trade</span>
                            <span style={{ color: 'var(--success)', fontWeight: '500' }}>+{formatCurrency(stats.bestTrade)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Worst Trade</span>
                            <span style={{ color: 'var(--danger)', fontWeight: '500' }}>{stats.worstTrade < 0 ? '-' : ''}{formatCurrency(Math.abs(stats.worstTrade))}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Avg Loss</span>
                            <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>-{formatCurrency(stats.averageLoss).replace('-', '')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
