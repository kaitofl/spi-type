import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'スピタイプ軸ノート｜26の軸パターン',
  description: 'あなたのスピリチュアル観を16タイプに。診断の土台になる、わかりやすい二択軸のアイデア集。',
  openGraph: {
    title: 'スピタイプ軸ノート｜26の軸パターン',
    description: 'スピの軸のパターンを、26候補からわかりやすく整理。',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'スピタイプ診断' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'スピタイプ軸ノート｜26の軸パターン',
    description: 'スピの軸のパターンを、26候補からわかりやすく整理。',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body className={geist.variable}>{children}</body></html>;
}
