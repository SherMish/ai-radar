import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LoginModal } from "@/components/auth/login-modal";
import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { Session } from "next-auth";
import { Providers } from '@/components/providers/providers';
import Script from 'next/script'
import { GA_TRACKING_ID } from '@/lib/gtag'
import { AnalyticsProvider } from '@/components/providers/analytics-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'AI-Radar',
    template: '%s | AI-Radar',
  },
  description: 'Find and review AI tools',
  icons: {
    icon: [
      {
        url: '/favicon.png',
        sizes: 'any',
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {GA_TRACKING_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={inter.className}>
        <Providers>
          <AnalyticsProvider />
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <LoginModal />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}