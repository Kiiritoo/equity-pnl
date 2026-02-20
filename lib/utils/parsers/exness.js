import Papa from 'papaparse';
import { parse, parseISO } from 'date-fns';

export const parseExnessCSV = (csvContent) => {
    return new Promise((resolve, reject) => {
        Papa.parse(csvContent, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                try {
                    const trades = results.data
                        .filter(row => {
                            const type = row['Type'] || row['type'];
                            return type && (type.toLowerCase() === 'buy' || type.toLowerCase() === 'sell');
                        })
                        .map(row => {
                            // Normalize fields
                            const ticket = row['Order'] || row['Ticket'] || row['ticket'] || `${Date.now()}-${Math.random()}`;
                            const openTimeStr = row['Open Time'] || row['opening_time_utc'];
                            const closeTimeStr = row['Close Time'] || row['closing_time_utc'];
                            const symbol = row['Item'] || row['Symbol'] || row['symbol'];
                            const type = (row['Type'] || row['type']).toLowerCase();
                            const volume = parseFloat(row['Size'] || row['Volume'] || row['lots'] || 0);
                            const openPrice = parseFloat(row['Open Price'] || row['opening_price'] || 0);
                            const closePrice = parseFloat(row['Close Price'] || row['closing_price'] || 0);
                            const sl = parseFloat(row['S / L'] || row['stop_loss'] || 0);
                            const tp = parseFloat(row['T / P'] || row['take_profit'] || 0);

                            // Financials
                            const profit = parseFloat(row['Profit'] || row['profit_idr'] || 0);
                            const swap = parseFloat(row['Swap'] || row['swap_idr'] || 0);
                            const commission = parseFloat(row['Commission'] || row['commission_idr'] || 0);
                            const comment = row['Comment'] || row['close_reason'] || '';

                            // Date Parsing - Force UTC interpretation as per user request
                            let openTime, closeTime;
                            if (openTimeStr && openTimeStr.includes('T')) {
                                // For ISO strings, ensure 'Z' is present to force UTC
                                const isoOpen = openTimeStr.endsWith('Z') ? openTimeStr : `${openTimeStr}Z`;
                                const isoClose = closeTimeStr.endsWith('Z') ? closeTimeStr : `${closeTimeStr}Z`;
                                openTime = parseISO(isoOpen);
                                closeTime = parseISO(isoClose);
                            } else {
                                // For non-ISO strings (like 'yyyy.MM.dd HH:mm:ss'), 
                                // we treat them as UTC by adding ' +00' or similar if needed, 
                                // but a safer way is to use parse and then assume UTC.
                                // However, append ' +00' is very reliable for many formats.
                                try {
                                    openTime = parse(openTimeStr + ' +00', 'yyyy.MM.dd HH:mm:ss x', new Date());
                                    closeTime = parse(closeTimeStr + ' +00', 'yyyy.MM.dd HH:mm:ss x', new Date());
                                } catch (e) {
                                    // Extreme fallback
                                    openTime = parseISO(openTimeStr);
                                    closeTime = parseISO(closeTimeStr);
                                }
                            }

                            const netProfit = profit + swap + commission;

                            return {
                                ticket,
                                openTime,
                                closeTime,
                                symbol,
                                type,
                                volume,
                                openPrice,
                                closePrice,
                                sl,
                                tp,
                                commission,
                                swap,
                                grossProfit: profit,
                                netProfit,
                                comment
                            };
                        });

                    resolve(trades);
                } catch (error) {
                    console.error("CSV Parse Error", error);
                    reject(error);
                }
            },
            error: (error) => {
                reject(error);
            }
        });
    });
};
