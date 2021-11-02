module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['airbnb', 'airbnb/hooks', 'airbnb/whitespace', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'no-unused-vars': 'error',
    'no-shadow': 'off',
    'react/prop-types': 'error',
    'react/no-array-index-key': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-danger': 'off',
    'react/jsx-sort-props': [
      'error',
      {
        callbacksLast: true,
        shorthandLast: true,
        noSortAlphabetically: true,
      },
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '.storybook/**',
          'src/components/**/*.stories.js',
          'src/components/**/*.stories.jsx',
          'gatsby-config.js',
          'gatsby-node.js',
          'gatsby-ssr.js',
        ],
      },
    ],
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],
    'jsx-a11y/label-has-for': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },
};
