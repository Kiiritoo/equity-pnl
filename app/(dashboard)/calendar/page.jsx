'use client';

import React, { useState, useMemo } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    eachDayOfInterval,
    isToday,
    parse
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { useTrades } from '@/context/TradeContext';
import { getDailyPerformance } from '@/lib/utils/pnlEngine';
import DayDetailsModal from '@/components/DayDetailsModal';

export default function Calendar() {
    const { trades, initialBalance, timeZone, formatCurrency } = useTrades();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const performanceData = useMemo(() =>
        getDailyPerformance(trades, initialBalance, timeZone),
        [trades, initialBalance, timeZone]);

    // Monthly summary calculation
    const monthlySummary = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);

        let monthPnL = 0;
        let bestDay = -Infinity;
        let worstDay = Infinity;

        // Equity at start of month
        // Find the last performance data point before this month
        const sortedDates = Object.keys(performanceData).sort();
        const monthStartStr = format(monthStart, 'yyyy-MM-dd');

        let balanceAtStartOfMonth = initialBalance;

        sortedDates.forEach(date => {
            if (date < monthStartStr) {
                balanceAtStartOfMonth = performanceData[date].endBalance;
            }
            if (date >= monthStartStr && date <= format(monthEnd, 'yyyy-MM-dd')) {
                const day = performanceData[date];
                monthPnL += day.pnl;
                if (day.percentage > bestDay) bestDay = day.percentage;
                if (day.percentage < worstDay) worstDay = day.percentage;
            }
        });

        const monthReturn = balanceAtStartOfMonth !== 0 ? (monthPnL / balanceAtStartOfMonth) * 100 : 0;

        return {
            totalPnL: monthPnL,
            returnPercentage: monthReturn,
            bestDay: bestDay === -Infinity ? 0 : bestDay,
            worstDay: worstDay === Infinity ? 0 : worstDay
        };
    }, [currentMonth, performanceData, initialBalance]);

    const renderHeader = () => {
        return (
            <div className="calendar-header">
                <div className="current-month">
                    <CalendarIcon size={24} className="success" style={{ opacity: 0.8 }} />
                    <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
                </div>
                <div className="calendar-controls">
                    <button className="btn btn-secondary" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                        <ChevronLeft size={20} />
                    </button>
                    <button className="btn btn-secondary" onClick={() => setCurrentMonth(new Date())}>Current</button>
                    <button className="btn btn-secondary" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        );
    };

    const renderSummary = () => (
        <div className="calendar-summary">
            <div className="summary-card">
                <span className="label">Monthly PnL</span>
                <span className={`value ${monthlySummary.totalPnL >= 0 ? 'profit' : 'loss'}`}>
                    {monthlySummary.totalPnL >= 0 ? '+' : ''}{formatCurrency(monthlySummary.totalPnL)}
                </span>
            </div>
            <div className="summary-card">
                <span className="label">Monthly Return</span>
                <span className={`value ${monthlySummary.returnPercentage >= 0 ? 'profit' : 'loss'}`}>
                    {monthlySummary.returnPercentage >= 0 ? '+' : ''}{monthlySummary.returnPercentage.toFixed(2)}%
                </span>
            </div>
            <div className="summary-card">
                <span className="label">Best Day</span>
                <span className="value profit">
                    <TrendingUp size={14} style={{ marginRight: '4px' }} />
                    {monthlySummary.bestDay.toFixed(2)}%
                </span>
            </div>
            <div className="summary-card">
                <span className="label">Worst Day</span>
                <span className="value loss">
                    <TrendingDown size={14} style={{ marginRight: '4px' }} />
                    {monthlySummary.worstDay.toFixed(2)}%
                </span>
            </div>
        </div>
    );

    const renderDays = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className="calendar-days">
                {days.map(day => <div key={day} className="day-name">{day}</div>)}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
        const rows = [];
        let days = [];

        calendarDays.forEach((day, i) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayPerf = performanceData[dateStr];

            const tradesOnDayCount = trades.filter(t =>
                format(new Date(t.closeTime), 'yyyy-MM-dd') === dateStr
            ).length;

            const dayClasses = [
                'calendar-cell',
                !isSameMonth(day, monthStart) ? 'disabled' : '',
                isToday(day) ? 'today' : '',
                dayPerf?.pnl > 0 ? 'profit' : dayPerf?.pnl < 0 ? 'loss' : ''
            ].join(' ');

            days.push(
                <div
                    key={day.toString()}
                    className={dayClasses}
                    onClick={() => tradesOnDayCount > 0 && setSelectedDate(day)}
                >
                    <span className="day-number">{format(day, 'd')}</span>

                    {dayPerf && dayPerf.pnl !== 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div className="day-pnl">
                                {dayPerf.pnl > 0 ? '+' : ''}{formatCurrency(dayPerf.pnl, { maximumFractionDigits: 0 })}
                            </div>
                            <div className={`day-percentage ${dayPerf.percentage >= 0 ? 'profit' : 'loss'}`}>
                                {dayPerf.percentage >= 0 ? '+' : ''}{dayPerf.percentage.toFixed(2)}%
                            </div>
                        </div>
                    )}

                    {tradesOnDayCount > 0 && (
                        <div className="trade-count">
                            {tradesOnDayCount} {tradesOnDayCount === 1 ? 'trade' : 'trades'}
                        </div>
                    )}
                </div>
            );

            if ((i + 1) % 7 === 0) {
                rows.push(<div key={day.toString()} className="calendar-row">{days}</div>);
                days = [];
            }
        });

        return <div className="calendar-body">{rows}</div>;
    };

    const renderLegend = () => (
        <div className="calendar-legend">
            <div className="legend-item"><span className="dot profit"></span> Profitable Day</div>
            <div className="legend-item"><span className="dot loss"></span> Loss Day</div>
            <div className="legend-item"><span className="dot today"></span> Today</div>
            <div className="legend-item" style={{ marginLeft: 'auto' }}><Info size={14} /> Click on a day with trades for details</div>
        </div>
    );

    return (
        <div className="calendar-page">
            <div className="header">
                <div>
                    <h1 className="page-title">Performance Calendar</h1>
                    <p className="page-subtitle">Growth tracking and daily return analysis</p>
                </div>
            </div>

            {renderSummary()}

            <div className="calendar-container">
                {renderHeader()}
                {renderDays()}
                {renderCells()}
            </div>
            {renderLegend()}

            {selectedDate && (
                <DayDetailsModal
                    isOpen={!!selectedDate}
                    onClose={() => setSelectedDate(null)}
                    date={selectedDate}
                    trades={trades.filter(t => format(new Date(t.closeTime), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))}
                />
            )}
        </div>
    );
}
