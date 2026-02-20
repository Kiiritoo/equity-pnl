import '../styles/global.css';
import '../styles/layout.css';
import { Inter } from 'next/font/google';
import { TradeProvider } from '@/context/TradeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Equity Tracker',
    description: 'Track your trading performance with ease',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <TradeProvider>
                    {children}
                </TradeProvider>
            </body>
        </html>
    );
}
