import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import NotificationSystem from '@/app/components/ui/NotificationSystem';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ScholFi',
  description: 'Decentralized betting platform for students',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <AuthProvider>
            <NotificationSystem />
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
