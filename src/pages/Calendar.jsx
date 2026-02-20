import React, { useState, useMemo } from 'react';
import { useTrades } from '../context/TradeContext';
import { getDailyPnL } from '../utils/pnlEngine';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DayDetailsModal from '../components/DayDetailsModal';
import '../styles/index.css';

const Calendar = () => {
    const { trades, loading, currency, timeZone, formatCurrency } = useTrades();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Memoize daily PnL map for quick lookup
    const dailyPnLMap = useMemo(() => {
        const dailyData = getDailyPnL(trades, timeZone);
        const map = {};
        dailyData.forEach(day => {
            map[day.date] = day;
        });
        return map;
    }, [trades, timeZone]);

    const daysInMonth = useMemo(() => {
        return eachDayOfInterval({
            start: startOfMonth(currentMonth),
            end: endOfMonth(currentMonth)
        });
    }, [currentMonth]);

    const handlePrevMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
    const handleNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));

    const handleDayClick = (date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const selectedDayTrades = useMemo(() => {
        if (!selectedDate) return [];
        const dateStr = format(selectedDate, 'yyyy-MM-dd');

        return trades.filter(t => {
            const tradeCloseTime = new Date(t.closeTime);
            let tradeDateFormatted;

            if (timeZone && timeZone !== 'Local') {
                tradeDateFormatted = formatInTimeZone(tradeCloseTime, timeZone, 'yyyy-MM-dd');
            } else {
                tradeDateFormatted = format(tradeCloseTime, 'yyyy-MM-dd');
            }

            return tradeDateFormatted === dateStr;
        }).sort((a, b) => new Date(b.closeTime) - new Date(a.closeTime));
    }, [selectedDate, trades, timeZone]);

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading calendar...</div>;

    const startDay = startOfMonth(currentMonth).getDay();
    const emptySlots = Array(startDay).fill(null);

    return (
        <div className="calendar-page">
            <DayDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                date={selectedDate}
                trades={selectedDayTrades}
            />

            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 className="page-title">PnL Calendar</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'var(--bg-secondary)', padding: '8px 16px', borderRadius: 'var(--radius-lg)' }}>
                    <button onClick={handlePrevMonth} style={{ color: 'var(--text-primary)', cursor: 'pointer' }}><ChevronLeft /></button>
                    <span style={{ fontSize: '18px', fontWeight: '600' }}>{format(currentMonth, 'MMMM yyyy')}</span>
                    <button onClick={handleNextMonth} style={{ color: 'var(--text-primary)', cursor: 'pointer' }}><ChevronRight /></button>
                </div>
            </div>

            <div className="calendar-grid-header" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '12px',
                textAlign: 'center',
                marginBottom: '12px',
                color: 'var(--text-secondary)',
                fontWeight: '500'
            }}>
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>

            <div className="calendar-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '12px',
                backgroundColor: 'var(--bg-secondary)',
                padding: '24px',
                borderRadius: 'var(--radius-lg)'
            }}>
                {emptySlots.map((_, index) => (
                    <div key={`empty-${index}`} style={{ aspectRatio: '1/1' }}></div>
                ))}

                {daysInMonth.map(day => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const data = dailyPnLMap[dateStr];
                    const pnl = data ? data.pnl : 0;
                    const tradesCount = data ? data.trades : 0;

                    let bg = 'var(--bg-primary)';
                    let color = 'var(--text-secondary)';
                    let cursor = 'default';

                    if (data) {
                        cursor = 'pointer';
                        if (pnl > 0) {
                            bg = 'rgba(14, 203, 129, 0.15)';
                            color = 'var(--success)';
                        } else if (pnl < 0) {
                            bg = 'rgba(246, 70, 93, 0.15)';
                            color = 'var(--danger)';
                        } else {
                            bg = 'var(--bg-tertiary)';
                            color = 'var(--text-primary)';
                        }
                    }

                    return (
                        <div key={dateStr} style={{
                            aspectRatio: '1/1',
                            backgroundColor: bg,
                            borderRadius: 'var(--radius-md)',
                            padding: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            cursor: cursor,
                            border: isSameDay(day, new Date()) ? '1px solid var(--accent-primary)' : '1px solid transparent',
                            transition: 'transform 0.2s',
                        }}
                            className={data ? "calendar-day hover-scale" : "calendar-day"}
                            onClick={() => data && handleDayClick(day)}
                        >
                            <div style={{ alignSelf: 'flex-end', fontSize: '12px', color: 'var(--text-muted)' }}>
                                {format(day, 'd')}
                            </div>
                            {data && (
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontSize: '11px', fontWeight: '700', color: color }}>
                                        {pnl > 0 ? '+' : ''}{formatCurrency(pnl, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace('-', '')}
                                    </div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                        {tradesCount} trd
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
