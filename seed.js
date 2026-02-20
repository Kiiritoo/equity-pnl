import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const email = 'michakleb8@gmail.com';
    const username = 'Michael';
    const password = 'gbzky9vk';

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            username,
        },
        create: {
            email,
            username,
            password: hashedPassword,
            initialBalance: 0,
            currency: 'USD',
            timeZone: 'UTC',
            theme: 'light',
        },
    });

    console.log('User seeded:', user.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
