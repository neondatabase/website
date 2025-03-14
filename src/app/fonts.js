import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const esbuild = localFont({
  src: '../fonts/esbuild/ESBuild-Medium.woff2',
  weight: '500',
  style: 'normal',
  display: 'swap',
  variable: '--font-esbuild',
});

export { inter, esbuild };
