import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
    try {
        const payload = await getAuthUser();
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const withdrawals = await prisma.withdrawal.findMany({
            where: { userId: payload.userId },
            orderBy: { date: 'desc' },
        });

        return NextResponse.json({ withdrawals });
    } catch (error) {
        console.error('Fetch withdrawals error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const payload = await getAuthUser();
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { amount, date, note } = body;

        if (!amount || !date) {
            return NextResponse.json({ error: 'Amount and date are required' }, { status: 400 });
        }

        const withdrawal = await prisma.withdrawal.create({
            data: {
                amount: parseFloat(amount),
                date: new Date(date),
                note,
                userId: payload.userId,
            },
        });

        return NextResponse.json({ withdrawal });
    } catch (error) {
        console.error('Create withdrawal error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const payload = await getAuthUser();
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await prisma.withdrawal.delete({
            where: {
                id,
                userId: payload.userId,
            },
        });

        return NextResponse.json({ message: 'Withdrawal deleted successfully' });
    } catch (error) {
        console.error('Delete withdrawal error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const payload = await getAuthUser();
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, amount, date, note } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const withdrawal = await prisma.withdrawal.update({
            where: {
                id,
                userId: payload.userId,
            },
            data: {
                amount: amount !== undefined ? parseFloat(amount) : undefined,
                date: date ? new Date(date) : undefined,
                note: note !== undefined ? note : undefined,
            },
        });

        return NextResponse.json({ withdrawal });
    } catch (error) {
        console.error('Update withdrawal error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
