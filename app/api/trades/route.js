import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const payload = await getAuthUser();
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const trades = await prisma.trade.findMany({
            where: { userId: payload.userId },
            orderBy: { closeTime: 'desc' },
        });

        return NextResponse.json({ trades });
    } catch (error) {
        console.error('Fetch trades error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const payload = await getAuthUser();
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { trades: tradesData } = await request.json();

        if (!Array.isArray(tradesData)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        // Bulk insert trades with duplicate skipping
        const trades = await prisma.trade.createMany({
            data: tradesData.map(t => ({
                ticket: t.ticket?.toString(),
                openTime: new Date(t.openTime),
                closeTime: new Date(t.closeTime),
                symbol: t.symbol,
                type: t.type,
                volume: parseFloat(t.volume),
                openPrice: parseFloat(t.openPrice),
                closePrice: parseFloat(t.closePrice),
                netProfit: parseFloat(t.netProfit),
                userId: payload.userId,
            })),
            skipDuplicates: true,
        });

        return NextResponse.json({ message: 'Trades imported successfully', count: trades.count });
    } catch (error) {
        console.error('Import trades error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const payload = await getAuthUser();
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const all = searchParams.get('all');

        if (all === 'true') {
            await prisma.trade.deleteMany({
                where: { userId: payload.userId },
            });
            return NextResponse.json({ message: 'All trades deleted' });
        }

        if (id) {
            await prisma.trade.delete({
                where: { id, userId: payload.userId },
            });
            return NextResponse.json({ message: 'Trade deleted successfully' });
        }

        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    } catch (error) {
        console.error('Delete trade error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
