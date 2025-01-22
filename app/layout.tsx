import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SessionProvider } from '@/components/providers/session-provider';
import { LoginModalProvider } from '@/components/providers/login-modal-provider';
import { LoginModal } from "@/components/auth/login-modal";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI-Radar - Discover and Review AI Tools',
  description: 'Find, review, and compare the best AI tools and services.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <LoginModalProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <LoginModal />
          </LoginModalProvider>
        </SessionProvider>
      </body>
    </html>
  );
}