import { Plugin } from 'postcss';

const plugins: Plugin[] = [
  'postcss-import',
  'tailwindcss/nesting',
  'tailwindcss',
  'autoprefixer',
];

export default {
  plugins,
};
