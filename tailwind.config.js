/* eslint-disable import/no-extraneous-dependencies */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false,
  theme: {
    screens: {
      '3xl': { max: '1919px' },
      '2xl': { max: '1599px' },
      xl: { max: '1279px' },
      lg: { max: '1023px' },
      md: { max: '767px' },
      sm: { max: '639px' },
      xs: { max: '413px' },
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
        '6xl': ['4rem', '1.125'],
        '7xl': ['5rem', '1.125'],
        '8xl': ['6.5rem', '1.125'],
      },
      colors: {
        black: '#1a1a1a',
        white: '#ffffff',
        primary: {
          1: '#00e699',
        },
        secondary: {
          1: '#ff4c79',
          2: '#f0f075',
          3: '#ffa64c',
          4: '#fbd0d7',
          5: '#aa99ff',
          6: '#d9eef2',
        },
        gray: {
          1: '#262626',
          2: '#404040',
          3: '#cccccc',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('tailwindcss-safe-area')],
};
