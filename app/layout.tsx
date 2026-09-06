import type { Metadata } from 'next';
import './globals.css';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'スピタイプ診断｜あなたを映す、一枚の物語。',
  description: '偶然の受けとめ方、未来へのまなざし。12の問いから、あなたの信じ方を16のキャラクターで読み解きます。',
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
  return <html lang="ja"><body>{children}</body></html>;
}
