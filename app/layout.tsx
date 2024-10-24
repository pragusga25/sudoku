import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import OgImage from '../public/banner.png';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sudoku Challenge: Easy, Medium & Hard',
  description:
    'Play a free Sudoku game with easy, medium, and hard levels. Improve your skills and enjoy brain-teasing fun!',
  metadataBase: new URL('https://sudoku.pragusga.com'),
  authors: [
    {
      name: 'Taufik Pragusga',
      url: 'https://pragusga.com',
    },
  ],
  abstract:
    'Play a free Sudoku game with easy, medium, and hard levels. Improve your skills and enjoy brain-teasing fun!',
  applicationName: 'QuizIslam',
  alternates: {
    canonical: 'https://sudoku.pragusga.com',
  },
  category: 'Game',
  openGraph: {
    type: 'website',
    emails: ['taufik@pragusga.com'],
    title: 'Sudoku Challenge: Easy, Medium & Hard',
    description:
      'Play a free Sudoku game with easy, medium, and hard levels. Improve your skills and enjoy brain-teasing fun!',
    siteName: 'QuizIslam',
    countryName: 'Indonesia',
    url: 'https://sudoku.pragusga.com',
    alternateLocale: 'id_ID',
    images: [
      {
        url: `${OgImage.src}`,
        width: 1200,
        height: 630,
        alt: 'Sudoku Challenge: Easy, Medium & Hard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pragusga',
    title: 'Sudoku Challenge: Easy, Medium & Hard',
    creator: '@pragusga',
    description:
      'Play a free Sudoku game with easy, medium, and hard levels. Improve your skills and enjoy brain-teasing fun!',
    images: [
      {
        url: `${OgImage.src}`,
        width: 1200,
        height: 630,
        alt: 'Sudoku Challenge: Easy, Medium & Hard',
      },
    ],
  },
  keywords: ['sudoku', 'game', 'puzzle', 'challenge', 'easy', 'medium', 'hard'],
  appLinks: {
    web: {
      url: 'https://sudoku.pragusga.com',
      should_fallback: false,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
