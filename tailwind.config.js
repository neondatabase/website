/* eslint-disable import/no-extraneous-dependencies, global-require */
const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      '3xl': { max: '1920px' },
      '2xl': { max: '1599px' },
      xl: { max: '1279px' },
      lt: { max: '1127px' },
      lg: { max: '1023px' },
      md: { max: '767px' },
      sm: { max: '639px' },
      xs: { max: '413px' },
    },
    colors: {
      inherit: 'inherit',
      current: 'currentColor',
      transparent: 'transparent',
      black: {
        DEFAULT: '#1a1a1a',
        new: '#0c0d0d',
        full: '#000000',
      },
      white: '#ffffff',
      primary: {
        1: '#00E599',
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
        8: '#0055ff',
        9: '#ade0eb',
      },
      gray: {
        1: '#262626',
        2: '#404040',
        3: '#595959',
        4: '#808080',
        5: '#b3b3b3',
        6: '#cccccc',
        7: '#e5e5e5',
        8: '#f2f2f2',
        9: '#FAFAFA',
      },
      'gray-new': {
        8: '#131415',
        10: '#18191B',
        15: '#242628',
        20: '#303236',
        30: '#494B50',
        40: '#61646B',
        50: '#797D86',
        60: '#94979E',
        70: '#AFB1B6',
        80: '#C9CBCF',
        90: '#E4E5E7',
        94: '#EFEFF0',
        95: '#F2F2F3',
        98: '#FAFAFA',
      },
      yellow: {
        70: '#F0F075',
      },
      green: {
        45: '#00E599',
      },
      blue: {
        80: '#ADE0EB',
      },
      brown: {
        70: '#F0B375',
      },
      pink: {
        90: '#FFCCE5',
      },
      purple: {
        70: '#B8ADEB',
      },
      code: {
        'green-1': '#078345',
        'green-2': '#47D18C',
        'blue-1': '#206CDF',
        'blue-2': '#66A3FF',
        'red-1': '#DA0B51',
        'red-2': '#F6558C',
        'orange-1': '#FF9500',
        'orange-2': '#FFBF66',
        'gray-1': '#B3B3B3',
        'gray-2': '#808080',
        'brown-1': '#A86624',
        'brown-2': '#BA8C5E',
      },
      pricing: {
        black: '#0c0d0d',
        primary: {
          1: '#00e599',
          3: 'rgb(0,229,153,0.4)',
          4: 'rgba(19,236,182,0.1)',
        },
      },
    },
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', 'IBM Plex Sans Fallback', ...defaultTheme.fontFamily.sans],
        'sans-inter': ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        mono: ['IBM Plex Mono', 'IBM Plex Mono Fallback', ...defaultTheme.fontFamily.mono],
      },
      fontSize: {
        xs: [defaultTheme.fontSize.xs[0]],
        sm: [defaultTheme.fontSize.sm[0]],
        base: [defaultTheme.fontSize.base[0]],
        lg: [defaultTheme.fontSize.lg[0]],
        xl: [defaultTheme.fontSize.xl[0]],
        '2xl': [defaultTheme.fontSize['2xl'][0]],
        '3xl': [defaultTheme.fontSize['3xl'][0]],
        '4xl': ['2.5rem'],
        '5xl': [defaultTheme.fontSize['5xl'][0]],
        '6xl': ['4rem'],
        '7xl': ['5rem'],
        '8xl': ['6.5rem'],
      },
      lineHeight: {
        dense: '1.125',
      },
      letterSpacing: {
        tighter: '-0.04em',
        'extra-tight': '-0.02em',
        wider: '0.04em',
      },
      boxShadow: {
        tooltip: '0px 2px 20px rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: () => ({
        'button-overlay': 'linear-gradient(0deg, rgba(12,13,13,0) 0%, rgba(12,13,13,1) 100%);',
        'community-light':
          'radial-gradient(100% 2244.95% at 100% 100%, rgba(217, 238, 242, 0.5) 0%, rgba(217, 238, 242, 0.1) 70.08%);',
        'community-dark':
          'radial-gradient(100% 2244.95% at 100% 100%, #262626 0%, rgba(38, 38, 38, 0.1) 63.96%);',
        'subscribe-sm':
          'linear-gradient(160deg, rgba(173, 224, 235, 0.00) 23%, rgba(173, 224, 235, 0.45) 50%, rgba(173, 224, 235, 0.00) 77%);',
        'pricing-table-featured-column':
          'linear-gradient(180deg, rgba(19, 20, 21, 0.40) 92.77%, rgba(19, 20, 21, 0.00) 100%);',
        'home-bento-regions-border':
          'radial-gradient(42.03% 56.98% at 0% 100%, #847A9D 0%, rgba(132, 122, 157, 0) 89.37%),' +
          'radial-gradient(20.73% 29.17% at 24.37% 100%, #545C8D 0%, rgba(84, 92, 141, 0) 89.37%),' +
          'radial-gradient(22.14% 53.65% at 68.28% 0%, #545C8D 0%, rgba(84, 92, 141, 0) 95.75%),' +
          'radial-gradient(12.86% 25.51% at 100% 30.86%, #2A2D32 0%, rgba(42, 45, 50, 0) 100%),' +
          'radial-gradient(12.81% 27.6% at 37.08% 0%, #2A2D32 0%, rgba(42, 45, 50, 0) 100%),' +
          'linear-gradient(0deg, #181818, #181818)',
        'home-bento-api-and-cli-border':
          'radial-gradient(26.24% 29.12% at 66.81% 0%, #24272C 0%, rgba(36, 39, 44, 0) 100%),' +
          'radial-gradient(35.43% 29.25% at 100% 62.63%, #24272C 0%, rgba(36, 39, 44, 0) 100%),' +
          'radial-gradient(39.25% 39.33% at 0% 3.24%, #EFF4F4 0%, #78E8E1 8.96%, #3ABC96 18.57%, #24624F 41.92%, rgba(36, 98, 79, 0) 100%),' +
          'linear-gradient(0deg, #171717, #171717)',
        'home-bento-timer-border':
          'radial-gradient(7.07% 9.37% at 64.68% 0%, #2559B9 0%, rgba(37, 89, 185, 0) 100%),' +
          'radial-gradient(19.61% 26.58% at 73.83% 0%, rgba(231, 232, 236, 0.9) 0%, rgba(231, 232, 236, 0) 60.81%),' +
          'radial-gradient(21.49% 21.49% at 33.94% 0%, #293244 0%, rgba(41, 50, 68, 0) 100%),' +
          'radial-gradient(41.6% 38.11% at 0% 58.25%, #121212 0%, rgba(18, 18, 18, 0) 100%),' +
          'radial-gradient(32.34% 44.6% at 100% 86.35%, #121212 0%, rgba(18, 18, 18, 0) 100%),' +
          'linear-gradient(0deg, #191919, #191919)',
      }),
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
        loading: {
          '0%': {
            opacity: 1,
          },
          '50%': {
            opacity: 0.5,
          },
          '100%': {
            opacity: 1,
          },
        },
        fadeInOverlay: {
          '0%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          },
        },
        fadeOutOverlay: {
          '0%': {
            opacity: 1,
          },
          '100%': {
            opacity: 0,
          },
        },
        dialogShow: {
          '0%': {
            opacity: 0,
            transform: 'translateY(-2%) scale(.96)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0) scale(1)',
          },
        },
        dialogHide: {
          '0%': {
            opacity: 1,
            transform: 'translateY(0) scale(1)',
          },
          '100%': {
            opacity: 0,
            transform: 'translateY(-2%) scale(.96)',
          },
        },
      }),
      animation: {
        'text-blink': 'text-blink 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in-overlay': 'fadeInOverlay 0.2s',
        'fade-out-overlay': 'fadeOutOverlay 0.2s',
        'dialog-show': 'dialogShow 0.3s cubic-bezier(.16,1,.3,1)',
        'dialog-hide': 'dialogHide 0.3s cubic-bezier(.16,1,.3,1)',
        loading: 'loading 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
  plugins: [
    require('tailwindcss-safe-area'),
    require('@tailwindcss/typography'),
    require('@headlessui/tailwindcss'),
    require('tailwindcss/plugin')(({ addVariant }) => {
      addVariant('search-cancel', '&::-webkit-search-cancel-button');
    }),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'border-image': (value) => ({
            background: `${value.replaceAll(/(, ?[a-z]+-gradient)/g, ' border-box$1')} border-box`,
          }),
        },
        { values: theme('backgroundImage') }
      );
    }),
  ],
};
