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

export const calculateEquityCurve = (trades, initialBalance, timeZone) => {
    if (!trades || trades.length === 0) return [];

    // Sort trades by close time ascending to calculate cumulative balance
    const sortedTrades = [...trades].sort((a, b) => a.closeTime - b.closeTime);

    let currentBalance = initialBalance;
    const equityCurve = [];

    // Add initial point? Maybe not needed if we want clean graph.
    // If needed:
    /*
    if (sortedTrades.length > 0) {
         const firstDate = getDateKey(sortedTrades[0].openTime, timeZone);
         equityCurve.push({ date: firstDate, balance: initialBalance, dailyProfit: 0 });
    }
    */

    // Accumulate PnL
    // We want a daily equity curve, or trade-by-trade? 
    // Trade-by-trade is more accurate but might be too noisy. 
    // Let's do daily cumulative for smoother graph.

    const dailyMap = new Map();

    sortedTrades.forEach(trade => {
        const date = getDateKey(trade.closeTime, timeZone);
        if (!dailyMap.has(date)) {
            dailyMap.set(date, 0);
        }
        dailyMap.set(date, dailyMap.get(date) + trade.netProfit);
    });

    // Convert map to sorted array
    const sortedDates = Array.from(dailyMap.keys()).sort();

    sortedDates.forEach(date => {
        const dailyProfit = dailyMap.get(date);
        currentBalance += dailyProfit;
        equityCurve.push({
            date,
            balance: parseFloat(currentBalance.toFixed(2)),
            dailyProfit: parseFloat(dailyProfit.toFixed(2))
        });
    });

    return equityCurve;
};

/**
 * Calculates detailed daily performance including PnL and percentage returns.
 * Returns a map of date strings to performance objects.
 */
export const getDailyPerformance = (trades, initialBalance, timeZone) => {
    if (!trades || trades.length === 0) return {};

    const sortedTrades = [...trades].sort((a, b) => a.closeTime - b.closeTime);
    const dailyMap = new Map();

    sortedTrades.forEach(trade => {
        const date = getDateKey(new Date(trade.closeTime), timeZone);
        if (!dailyMap.has(date)) {
            dailyMap.set(date, 0);
        }
        dailyMap.set(date, dailyMap.get(date) + trade.netProfit);
    });

    const sortedDates = Array.from(dailyMap.keys()).sort();
    const performanceMap = {};
    let runningBalance = initialBalance;

    sortedDates.forEach(date => {
        const dailyPnL = dailyMap.get(date);
        const startOfDayBalance = runningBalance;

        // Calculate percentage return relative to the balance at the start of that day
        // Avoid division by zero
        const percentage = startOfDayBalance !== 0 ? (dailyPnL / startOfDayBalance) * 100 : 0;

        runningBalance += dailyPnL;

        performanceMap[date] = {
            pnl: parseFloat(dailyPnL.toFixed(2)),
            percentage: parseFloat(percentage.toFixed(2)),
            endBalance: parseFloat(runningBalance.toFixed(2))
        };
    });

    return performanceMap;
};
