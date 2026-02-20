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
            totalPnL: 0,
            winRate: 0,
            profitFactor: 0,
            totalTrades: 0,
            wins: 0,
            losses: 0,
            averageWin: 0,
            averageLoss: 0,
            bestTrade: 0,
            worstTrade: 0
        };
    }

    let totalPnL = 0;
    let grossProfit = 0;
    let grossLoss = 0;
    let wins = 0;
    let losses = 0;
    let bestTrade = -Infinity;
    let worstTrade = Infinity;

    trades.forEach(trade => {
        const pnl = trade.netProfit;
        totalPnL += pnl;

        if (pnl > 0) {
            wins++;
            grossProfit += pnl;
            if (pnl > bestTrade) bestTrade = pnl;
        } else {
            losses++; // Even break-even is usually not a "loss", but < 0 is loss. Exactly 0 is neutral.
            if (pnl < 0) {
                grossLoss += Math.abs(pnl);
                if (pnl < worstTrade) worstTrade = pnl;
            }
        }
    });

    // Treat 0 PnL as neither win nor loss in win rate? Or loss? Usually loss or ignore. 
    // Let's treat > 0 as win, <= 0 as loss for simplicity, or strictly <0.
    // Standard: Win Rate = Wins / Total.

    const totalTrades = trades.length;
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : (grossProfit > 0 ? Infinity : 0);

    const averageWin = wins > 0 ? grossProfit / wins : 0;
    const averageLoss = losses > 0 ? grossLoss / losses : 0; // Average of absolute losses

    return {
        totalPnL,
        winRate,
        profitFactor,
        totalTrades,
        wins,
        losses,
        averageWin,
        averageLoss: -averageLoss, // Return as negative number
        bestTrade: bestTrade === -Infinity ? 0 : bestTrade,
        worstTrade: worstTrade === Infinity ? 0 : worstTrade
    };
};

export const getDailyPnL = (trades, timeZone) => {
    const dailyMap = {};

    trades.forEach(trade => {
        const dateKey = getDateKey(trade.closeTime, timeZone);
        if (!dailyMap[dateKey]) {
            dailyMap[dateKey] = {
                date: dateKey,
                pnl: 0,
                trades: 0,
                wins: 0
            };
        }
        dailyMap[dateKey].pnl += trade.netProfit;
        dailyMap[dateKey].trades += 1;
        if (trade.netProfit > 0) dailyMap[dateKey].wins += 1;
    });

    return Object.values(dailyMap).sort((a, b) => new Date(b.date) - new Date(a.date));
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
