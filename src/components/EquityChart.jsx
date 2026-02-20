import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { useTrades } from '../context/TradeContext';

const EquityChart = ({ data }) => {
    const { formatCurrency } = useTrades();

    if (!data || data.length === 0) {
        return (
            <div style={{
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)'
            }}>
                No data available for chart
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '4px' }}>{label}</p>
                    <p style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                        Balance: {formatCurrency(payload[0].value)}
                    </p>
                    {payload[0].payload.dailyProfit !== undefined && (
                        <p style={{
                            color: payload[0].payload.dailyProfit >= 0 ? 'var(--success)' : 'var(--danger)',
                            fontSize: '12px',
                            marginTop: '4px'
                        }}>
                            Daily: {payload[0].payload.dailyProfit >= 0 ? '+' : ''}
                            {formatCurrency(payload[0].payload.dailyProfit).replace('-', '')}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            height: '400px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <h2 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>Equity Growth</h2>
            <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="var(--text-secondary)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={30}
                        />
                        <YAxis
                            stroke="var(--text-secondary)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => formatCurrency(value, {
                                notation: "compact",
                                compactDisplay: "short",
                                maximumFractionDigits: 1
                            })}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="balance"
                            stroke="var(--accent-primary)"
                            fillOpacity={1}
                            fill="url(#colorBalance)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default EquityChart;
