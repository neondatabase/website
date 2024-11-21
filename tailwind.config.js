/* eslint-disable import/no-extraneous-dependencies, global-require */
const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      '3xl': { max: '1919px' },
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
        pure: '#000000',
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
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        title: ['var(--font-esbuild)', ...defaultTheme.fontFamily.sans],
        mono: ['IBM Plex Mono', 'IBM Plex Mono Fallback', ...defaultTheme.fontFamily.mono],
        'ibm-plex-sans': [
          'IBM Plex Sans',
          'IBM Plex Sans Fallback',
          ...defaultTheme.fontFamily.sans,
        ],
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
        social: 'inset 0px -2px 10px rgba(255, 255, 255, 0.15)',
        contact: '0px 4px 10px 0px rgba(0, 0, 0, .5), 0px 4px 30px 0px rgba(0, 0, 0, .5)',
      },
      backgroundImage: ({ theme }) => ({
        'button-overlay': 'linear-gradient(0deg, rgba(12,13,13,0) 0%, rgba(12,13,13,1) 100%);',
        'community-light':
          'radial-gradient(100% 2244.95% at 100% 100%, rgba(217, 238, 242, 0.5) 0%, rgba(217, 238, 242, 0.1) 70.08%);',
        'community-dark':
          'radial-gradient(100% 2244.95% at 100% 100%, #262626 0%, rgba(38, 38, 38, 0.1) 63.96%);',
        'subscribe-sm':
          'linear-gradient(160deg, rgba(173, 224, 235, 0) 23%, rgba(173, 224, 235, 0.45) 50%, rgba(173, 224, 235, 0) 77%);',
        'pricing-table-featured-column':
          'linear-gradient(180deg, rgba(19, 20, 21, 0.80) 93%, rgba(19, 20, 21, 0) 100%);',
        'home-lightning-title':
          'radial-gradient(30.52% 57.36% at 67.98% 84.29%, #070707 8.6%, #525252 44.72%, #A7A7A7 69.37%, #FFFFFF 100%)',
        'home-lightning-title-xl':
          'radial-gradient(149px 165px at 73.95% 81%, transparent, transparent 51%, white), linear-gradient(180deg, white, white 47%, transparent 47%, transparent)',
        'home-lightning-title-lg':
          'radial-gradient(149px 165px at 78.95% 77%, transparent, transparent 57%, white 74%, white), linear-gradient(180deg, white, white 47%, transparent 47%, transparent)',
        'home-lightning-title-md':
          'radial-gradient(16% 40% at 72% 78.29%, #070707 7%, #525252 40.72%, #A7A7A7 78.37%, #FFFFFF 100%)',
        'home-lightning-title-sm':
          'radial-gradient(26.52% 69.36% at 261px 80%, #070707 8.6%, #525252 39.72%, #A7A7A7 73.37%, #FFFFFF 100%)',
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
        'home-trusted-github-card':
          'radial-gradient(32.79% 54.55% at 67.38% 0%, #18604C 0%, rgba(24, 96, 76, 0) 91.3%),' +
          'linear-gradient(208.46deg, #161818 8.65%, #141414 84.9%)',
        'home-trusted-digit-card':
          'radial-gradient(73.81% 84.98% at 1.56% 0%, #A1ACC4 0%, #8594B3 19.86%, rgba(133, 148, 179, 0) 100%),' +
          'linear-gradient(140.09deg, #6B768C 9.16%, #1C1C1C 46.69%),' +
          'radial-gradient(21.81% 24.47% at 1.09% 1.16%, #FFFFFF 0%, rgba(255, 255, 255, 0) 63.02%)',
        'home-trusted-soc-card':
          'radial-gradient(46.96% 46.96% at 0% 3.24%, #C7D3FF 0%, #7995F7 8.96%, #4E5F9C 26.83%, rgba(78, 95, 156, 0) 100%),' +
          'radial-gradient(57.03% 30.65% at 100% 36.84%, #191C27 0%, rgba(25, 28, 39, 0) 100%),' +
          'linear-gradient(0deg, #141416, #141416)',
        'home-trusted-soc-card-md':
          'radial-gradient(18.96% 17.96% at 13% -1%, #C7D3FF 0%, #7995F7 8.96%, #4E5F9C 26.83%, rgba(78, 95, 156, 0) 100%),' +
          'radial-gradient(57.03% 30.65% at 100% 36.84%, #191C27 0%, rgba(25, 28, 39, 0) 100%),' +
          'linear-gradient(0deg, #141416, #141416)',
        'variable-list-icon-bg': 'linear-gradient(220deg, #272A35 8%, #16181D 70%)',
        'variable-list-icon-border': 'linear-gradient(224deg, #FFF 2.43%, rgba(255, 255, 255, 0))',
        'variable-value-1': 'linear-gradient(220deg, #FFFFFF 22%, #41BAB9 142%)',
        'variable-value-2': 'linear-gradient(73deg, #EFEFEF 13%, #89E0EA 61%, #7F95EB 93%)',
        'variable-value-3':
          'linear-gradient(90deg, rgba(255, 255, 255, 0.60), rgba(255, 255, 255, 0.50))',
        'variable-value-text': 'linear-gradient(90deg, #797D86 0%, #A4B7E2 100%)',
        'azure-form-bg': 'linear-gradient(127deg, #0F0F10 0%, #070708 81.66%)',
        'azure-form-bg-top':
          'linear-gradient(152deg, #3FDFFF 28.7%, #2B49E3 41.01%, rgba(78, 97, 198, 0) 77.16%)',
        'azure-form-bg-bottom':
          'radial-gradient(49.98% 51.52% at 52.26% -7.36%, #3DFFFF 12.54%, rgba(51, 147, 147, 0) 94.44%),' +
          'linear-gradient(143deg, #42B2F2 -8.71%, #29DEDE 0.6%, rgba(69, 127, 239, 0) 95.22%)',
        'azure-form-border':
          'radial-gradient(60.96% 60.55% at 0% 0%, rgba(100, 144, 185, 0.50) 0%, rgba(90, 109, 141, 0.50) 46%, rgba(90, 109, 141, 0) 80%),' +
          'radial-gradient(64.38% 53.06% at 100% 100%, rgba(100, 158, 185, 0.50) 0%, rgba(90, 109, 141, 0.50) 46%, rgba(90, 109, 141, 0) 80%),' +
          'linear-gradient(0deg, #242628, #242628)',
        'azure-form-input-1':
          'linear-gradient(93deg, rgba(47, 66, 96, 0.80) -2.17%, rgba(30, 34, 52, 0.80) 18.83%, rgba(24, 25, 27, 0.80) 57.17%)',
        'azure-form-input-2':
          'linear-gradient(100deg, rgba(33, 39, 58, 0.80) -6.09%, rgba(24, 25, 27, 0.80) 27.66%)',
        'azure-form-input-3':
          'linear-gradient(276deg, rgba(32, 48, 55, 0.80) 2.61%, rgba(24, 25, 27, 0.80) 32.96%)',
        // for deploy page
        'color-picker-variant-1': 'linear-gradient(225deg, #4CFFFF 31.6%, #00E660 74.65%);',
        'color-picker-variant-2': 'linear-gradient(225deg, #BDF471 35.94%, #00CC33 100%);',
        'color-picker-variant-3': 'linear-gradient(225deg, #FF66FF 13.02%, #421CFF 92.19%);',
        'color-picker-variant-4': 'linear-gradient(226.74deg, #E8EFFC 28.6%, #99B3E6 80.81%);',
        'ticket-text-variant-0':
          'linear-gradient(215.67deg, #FFFFFF 41.51%, rgba(255, 255, 255, 0.5) 79.11%);',
        'ticket-text-variant-1': 'linear-gradient(215.67deg, #ffffff 41.51%, #66ffcc 79.11%)',
        'ticket-text-variant-2': 'linear-gradient(215.67deg, #ffffff 41.51%, #e6ff66 79.11%)',
        'ticket-text-variant-3': 'linear-gradient(215.67deg, #ffffff 41.51%, #ff99dd 79.11%)',
        'ticket-text-variant-4': 'linear-gradient(215.67deg, #ffffff 41.51%, #ccccff 79.11%)',
        'ticket-back-variant-1': `radial-gradient(transparent 0%, ${theme(
          'colors.black.pure'
        )} 72%), linear-gradient(225deg, #00d1ff 0%, rgba(51, 255, 187, 0.2) 100%)`,
        'ticket-back-variant-2': `radial-gradient(transparent 0%, ${theme(
          'colors.black.pure'
        )} 72%), linear-gradient(225deg, rgba(51, 255, 187, 0.6) 0%, rgba(230, 255, 102, 0.4) 100%)`,
        'ticket-back-variant-3': `radial-gradient(transparent 0%, ${theme(
          'colors.black.pure'
        )} 72%), linear-gradient(225deg, #7266ff 28.65%, #ff99dd 100%)`,
        'ticket-back-variant-4': `radial-gradient(transparent 0%, ${theme(
          'colors.black.pure'
        )} 72%), linear-gradient(225deg, #ccccff 28.65%, rgba(204, 204, 255, 0.4) 100%)`,
        'ticket-border-variant-0': `linear-gradient(0deg, transparent 10%, rgba(255, 255, 255, 0.2) 48%, rgba(255, 255, 255, 0.2) 52%, transparent 90%), linear-gradient(90deg, ${theme(
          'colors.black.pure'
        )} 0%, rgba(255, 255, 255, 0.2) 35%, rgba(255, 255, 255, 0.2) 65%, ${theme(
          'colors.black.pure'
        )} 100%)`,
        'ticket-border-variant-1': `linear-gradient(0deg, transparent 10%, #00d1ff 48%, #00d1ff 52%, transparent 90%), linear-gradient(90deg, ${theme(
          'colors.black.pure'
        )} 0%, #00d1ff 35%, #00d1ff 65%, ${theme('colors.black.pure')} 100%)`,
        'ticket-border-variant-2': `linear-gradient(0deg, transparent 10%, #33ffbb 48%, #33ffbb 52%, transparent 90%), linear-gradient(90deg, ${theme(
          'colors.black.pure'
        )} 0%, #33ffbb 35%, #33ffbb 65%, ${theme('colors.black.pure')} 100%)`,
        'ticket-border-variant-3': `linear-gradient(0deg, transparent 10%, #7266ff 48%, #7266ff 52%, transparent 90%), linear-gradient(90deg, ${theme(
          'colors.black.pure'
        )} 0%, #7266ff 35%, #7266ff 65%, ${theme('colors.black.pure')} 100%)`,
        'ticket-border-variant-4': `linear-gradient(0deg, transparent 10%, #ccccff 48%, #ccccff 52%, transparent 90%), linear-gradient(90deg, ${theme(
          'colors.black.pure'
        )} 0%, #ccccff 35%, #ccccff 65%, ${theme('colors.black.pure')} 100%)`,
        'ticket-flare-variant-1':
          'linear-gradient(106deg, transparent 30%, rgba(51, 255, 187, 0.8) 60%, transparent 60%)',
        'ticket-flare-variant-2':
          'linear-gradient(106deg, transparent 30%, rgba(189, 244, 113, 0.8) 60%, transparent 60%)',
        'ticket-flare-variant-3':
          'linear-gradient(106deg, transparent 30%, rgba(255, 153, 221, 0.8) 60%, transparent 60%)',
        'ticket-flare-variant-4':
          'linear-gradient(106deg, transparent 30%, rgba(204, 204, 255, 0.8) 60%, transparent 60%)',
        'live-video':
          'linear-gradient(103.37deg, rgba(255, 255, 255, 0.05) 12.69%, rgba(255, 255, 255, 0.11) 43.45%, rgba(255, 255, 255, 0) 93.31%)',
      }),
      keyframes: (theme) => ({
        'text-blink': {
          '0%': {
            color: theme('colors.black.pure'),
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
            color: theme('colors.black.pure'),
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
        logoMove: {
          '0%': {
            transform: 'translateY(0)',
          },
          '100%': {
            transform: 'translateY(-3%)',
          },
        },
      }),
      animation: {
        'text-blink': 'text-blink 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in-overlay': 'fadeInOverlay 0.2s',
        'fade-out-overlay': 'fadeOutOverlay 0.2s',
        'dialog-show': 'dialogShow 0.3s cubic-bezier(.16,1,.3,1)',
        'dialog-hide': 'dialogHide 0.3s cubic-bezier(.16,1,.3,1)',
        'logo-move': 'logoMove 1s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate',
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
            border: '1px solid transparent',
            background: `${value.replaceAll(/(, ?[a-z]+-gradient)/g, ' border-box$1')} border-box`,
            mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
          }),
        },
        { values: theme('backgroundImage') }
      );
    }),
  ],
};
