import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PerformanceOptimizations from '../components/PerformanceOptimizations';
import '../styles/globals.css';
import '../styles/custom.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Resource Collection',
  description: 'A collection of valuable resources',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Header />
        <div id="main-content">
          {children}
        </div>
        <Footer />
        <PerformanceOptimizations />
      </body>
    </html>
  );
}
