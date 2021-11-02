module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false,
  theme: {
    screens: {
      '2xl': { max: '1535px' },
      xl: { max: '1279px' },
      lg: { max: '1023px' },
      md: { max: '767px' },
      sm: { max: '639px' },
      xs: { max: '413px' },
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('tailwindcss-safe-area')],
};
