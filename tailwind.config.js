/* eslint-disable import/no-extraneous-dependencies, global-require */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      '3xl': { max: '1920px' },
      '2xl': { max: '1599px' },
      xl: { max: '1279px' },
      lg: { max: '1023px' },
      md: { max: '767px' },
      sm: { max: '639px' },
      xs: { max: '413px' },
    },
    colors: {
      inherit: 'inherit',
      current: 'currentColor',
      transparent: 'transparent',
      black: '#1a1a1a',
      white: '#ffffff',
      primary: {
        1: '#00e699',
        2: '#00cc88',
      },
      secondary: {
        1: '#ff4c79',
        2: '#f0f075',
        3: '#ffa64c',
        4: '#fbd0d7',
        5: '#aa99ff',
        6: '#d9eef2',
        7: '#259df4',
      },
      gray: {
        1: '#262626',
        2: '#404040',
        3: '#b3b3b3',
        4: '#e5e5e5',
        5: '#fafafa',
        6: '#f9f9f9',
      },
    },
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', ...defaultTheme.fontFamily.sans],
        mono: ['IBM Plex Mono', ...defaultTheme.fontFamily.mono],
      },
      fontSize: {
        sm: [defaultTheme.fontSize.sm[0], defaultTheme.lineHeight.none],
        base: [defaultTheme.fontSize.base[0], defaultTheme.lineHeight.none],
        lg: [defaultTheme.fontSize.lg[0], defaultTheme.lineHeight.none],
        xl: [defaultTheme.fontSize.xl[0], defaultTheme.lineHeight.normal],
        '2xl': [defaultTheme.fontSize['2xl'][0], defaultTheme.lineHeight.normal],
        '3xl': [defaultTheme.fontSize['3xl'][0], defaultTheme.lineHeight.normal],
        '4xl': ['2.5rem', defaultTheme.lineHeight.none],
        '5xl': [defaultTheme.fontSize['5xl'][0], defaultTheme.lineHeight.tight],
        '6xl': ['4rem', '1.125'],
        '7xl': ['5rem', '1.125'],
        '8xl': ['6.5rem', '1.125'],
      },
      keyframes: (theme) => ({
        'text-blink': {
          '0%': {
            color: theme('colors.black'),
            textShadow: `-1px -1px 0 ${theme('colors.gray.1')}, 1px -1px 0 ${theme(
              'colors.gray.1'
            )}, -1px 1px 0 ${theme('colors.gray.1')}, 1px 1px 0 ${theme('colors.gray.1')}`,
          },
          '25%': {
            color: 'currentColor',
            textShadow:
              '-1px -1px 0 transparent, 1px -1px 0 transparent, -1px 1px 0 transparent, 1px 1px 0 transparent',
          },
          '50%': {
            color: theme('colors.black'),
            textShadow: `-1px -1px 0 ${theme('colors.gray.1')}, 1px -1px 0 ${theme(
              'colors.gray.1'
            )}, -1px 1px 0 ${theme('colors.gray.1')}, 1px 1px 0 ${theme('colors.gray.1')}`,
          },
          '100%': {
            color: 'currentColor',
            textShadow:
              '-1px -1px 0 transparent, 1px -1px 0 transparent, -1px 1px 0 transparent, 1px 1px 0 transparent',
          },
        },
      }),
      animation: {
        'text-blink': 'text-blink 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      typography: () => ({
        DEFAULT: {
          css: {
            h2: {
              fontWeight: 600,
            },
            a: {
              fontWeight: 600,
            },
          },
        },
      }),
    },
  },
  plugins: [require('tailwindcss-safe-area'), require('@tailwindcss/typography')],
};
