import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(request) {
    try {
        const payload = await getAuthUser();
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { initialBalance, currency, timeZone, theme } = body;

        const updatedUser = await prisma.user.update({
            where: { id: payload.userId },
            data: {
                ...(initialBalance !== undefined && { initialBalance: parseFloat(initialBalance) }),
                ...(currency && { currency }),
                ...(timeZone && { timeZone }),
                ...(theme && { theme }),
            },
        });

        return NextResponse.json({
            message: 'Settings updated successfully',
            initialBalance: updatedUser.initialBalance,
            currency: updatedUser.currency,
            timeZone: updatedUser.timeZone,
            theme: updatedUser.theme,
        });
    } catch (error) {
        console.error('Update settings error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
