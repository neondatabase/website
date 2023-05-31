import localFont from 'next/font/local';

export const ibm_plex_sans = localFont({
  src: [
    {
      path: './fonts/ibm-plex-sans/ibm-plex-sans-light.woff2',
      weight: '300',
      style: 'normal',
      display: 'swap',
      preload: false,
    },
    {
      path: './fonts/ibm-plex-sans/ibm-plex-sans-regular.woff2',
      weight: '400',
      style: 'normal',
      display: 'swap',
    },
    {
      path: './fonts/ibm-plex-sans/ibm-plex-sans-medium.woff2',
      weight: '500',
      style: 'normal',
      display: 'swap',
      preload: false,
    },
    {
      path: './fonts/ibm-plex-sans/ibm-plex-sans-semibold.woff2',
      weight: '600',
      style: 'normal',
      display: 'swap',
      preload: false,
    },
    {
      path: './fonts/ibm-plex-sans/ibm-plex-sans-bold.woff2',
      weight: '700',
      style: 'normal',
      display: 'swap',
    },
  ],
  variable: '--font-ibm-plex-sans',
});

export const ibm_plex_mono = localFont({
  src: [
    {
      path: './fonts/ibm-plex-mono/ibm-plex-mono-regular.woff2',
      weight: '400',
      style: 'normal',
      display: 'swap',
      preload: false,
    },
    {
      path: './fonts/ibm-plex-mono/ibm-plex-mono-bold.woff2',
      weight: '700',
      style: 'normal',
      display: 'swap',
      preload: false,
    },
  ],
  variable: '--font-ibm-plex-mono',
});
