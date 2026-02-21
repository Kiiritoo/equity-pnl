import { startOfMonth, endOfMonth, isWithinInterval, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz'; // Dependency re-check

const getDateKey = (date, timeZone) => {
    if (timeZone && timeZone !== 'Local') {
        const zonedDate = toZonedTime(date, timeZone);
        return format(zonedDate, 'yyyy-MM-dd');
    }
    return format(date, 'yyyy-MM-dd');
}

export const calculateStats = (trades) => {
    if (!trades || trades.length === 0) {
        return {
            totalNetProfit: 0,
            winRate: 0,
            profitFactor: 0,
            totalTrades: 0,
            winningTrades: 0,
            losingTrades: 0,
            averageWin: 0,
            averageLoss: 0,
            maxDrawdown: 0 // Placeholder or implementation needed
        };
    }

    let totalNetProfit = 0;
    let grossProfit = 0;
    let grossLoss = 0;
    let winningTrades = 0;
    let losingTrades = 0;

    trades.forEach(trade => {
        const pnl = trade.netProfit || 0;
        totalNetProfit += pnl;

        if (pnl > 0) {
            winningTrades++;
            grossProfit += pnl;
        } else if (pnl < 0) {
            losingTrades++;
            grossLoss += Math.abs(pnl);
        }
    });

    const totalTrades = trades.length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : (grossProfit > 0 ? Infinity : 0);

    const averageWin = winningTrades > 0 ? grossProfit / winningTrades : 0;
    const averageLoss = losingTrades > 0 ? grossLoss / losingTrades : 0;

    return {
        totalNetProfit,
        winRate,
        profitFactor,
        totalTrades,
        winningTrades,
        losingTrades,
        averageWin,
        averageLoss: -averageLoss,
        maxDrawdown: 0 // Simplified for now
    };
};

export const getDailyPnL = (trades, timeZone) => {
    const dailyMap = {};

    trades.forEach(trade => {
        const dateKey = getDateKey(new Date(trade.closeTime), timeZone);
        if (!dailyMap[dateKey]) {
            dailyMap[dateKey] = 0;
        }
        dailyMap[dateKey] += trade.netProfit;
    });

    return dailyMap;
};

export const calculateEquityCurve = (trades, withdrawals, initialBalance, timeZone) => {
    const dailyTradePnL = new Map();
    trades.forEach(trade => {
        const date = getDateKey(new Date(trade.closeTime), timeZone);
        dailyTradePnL.set(date, (dailyTradePnL.get(date) || 0) + (trade.netProfit || 0));
    });

    const dailyWithdrawals = new Map();
    withdrawals.forEach(w => {
        const date = getDateKey(new Date(w.date), timeZone);
        dailyWithdrawals.set(date, (dailyWithdrawals.get(date) || 0) + (w.amount || 0));
    });

    const allDates = new Set([...dailyTradePnL.keys(), ...dailyWithdrawals.keys()]);
    const sortedDates = Array.from(allDates).sort();

    let currentBalance = initialBalance;
    const equityCurve = [];

    sortedDates.forEach(date => {
        const pnl = dailyTradePnL.get(date) || 0;
        const withdrawal = dailyWithdrawals.get(date) || 0;

        currentBalance += pnl - withdrawal;

        equityCurve.push({
            date,
            balance: parseFloat(currentBalance.toFixed(2)),
            dailyProfit: parseFloat(pnl.toFixed(2)),
            withdrawal: parseFloat(withdrawal.toFixed(2))
        });
    });

    return equityCurve;
};

/**
 * Calculates detailed daily performance including PnL and percentage returns.
 * Returns a map of date strings to performance objects.
 */
export const getDailyPerformance = (trades, withdrawals, initialBalance, timeZone) => {
    const dailyPnLMap = new Map();
    trades.forEach(trade => {
        const date = getDateKey(new Date(trade.closeTime), timeZone);
        dailyPnLMap.set(date, (dailyPnLMap.get(date) || 0) + (trade.netProfit || 0));
    });

    const dailyWithdrawalMap = new Map();
    withdrawals.forEach(w => {
        const date = getDateKey(new Date(w.date), timeZone);
        dailyWithdrawalMap.set(date, (dailyWithdrawalMap.get(date) || 0) + (w.amount || 0));
    });

    const allDates = new Set([...dailyPnLMap.keys(), ...dailyWithdrawalMap.keys()]);
    const sortedDates = Array.from(allDates).sort();

    const performanceMap = {};
    let runningBalance = initialBalance;

    sortedDates.forEach(date => {
        const dailyPnL = dailyPnLMap.get(date) || 0;
        const dailyWithdrawal = dailyWithdrawalMap.get(date) || 0;
        const startOfDayBalance = runningBalance;

        // Percentage return relative to trading pnl only
        const percentage = startOfDayBalance !== 0 ? (dailyPnL / startOfDayBalance) * 100 : 0;

        runningBalance += dailyPnL - dailyWithdrawal;

        performanceMap[date] = {
            pnl: parseFloat(dailyPnL.toFixed(2)),
            withdrawal: parseFloat(dailyWithdrawal.toFixed(2)),
            percentage: parseFloat(percentage.toFixed(2)),
            endBalance: parseFloat(runningBalance.toFixed(2))
        };
    });

    return performanceMap;
};

export const calculateWithdrawalStats = (withdrawals) => {
    if (!withdrawals || withdrawals.length === 0) {
        return {
            totalWithdrawn: 0,
            withdrawalCount: 0,
            averageWithdrawal: 0,
            lastWithdrawalDate: null
        };
    }

    const totalWithdrawn = withdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
    const sorted = [...withdrawals].sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
        totalWithdrawn,
        withdrawalCount: withdrawals.length,
        averageWithdrawal: totalWithdrawn / withdrawals.length,
        lastWithdrawalDate: sorted[0].date
    };
};
