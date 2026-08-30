import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'スピタイプ診断｜運命の信じ方、16タイプ。',
  description: '恋愛、推し、バイト、偶然。12問で“運の信じ方”を16体のキャラクターに。',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'スピタイプ診断',
    description: '運命の信じ方、16タイプ。',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'スピタイプ診断' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'スピタイプ診断',
    description: '運命の信じ方、16タイプ。',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body className={geist.variable}>{children}</body></html>;
}
