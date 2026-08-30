import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'スピタイプ診断｜12の質問でわかる、あなたの運命観',
  description: '運・偶然・未来をどう捉える？12の質問から、あなたのスピリチュアル観を16タイプで診断します。',
  openGraph: {
    title: 'スピタイプ診断',
    description: '12の質問でわかる、あなたの運命観。',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'スピタイプ診断' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'スピタイプ診断',
    description: '12の質問でわかる、あなたの運命観。',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body className={geist.variable}>{children}</body></html>;
}
