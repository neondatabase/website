import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import prettierConfig from 'eslint-config-prettier/flat';
import cypressPlugin from 'eslint-plugin-cypress/flat';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  { ignores: ['eslint.config.mjs'] },

  includeIgnoreFile(path.resolve(__dirname, '.gitignore')),

  js.configs.recommended,

  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],

  reactHooks.configs['recommended-latest'],

  jsxA11y.flatConfigs.recommended,

  importPlugin.flatConfigs.recommended,

  {
    plugins: { '@next/next': nextPlugin },
    rules: { ...nextPlugin.configs.recommended.rules },
  },

  {
    ...cypressPlugin.configs.recommended,
    files: ['cypress/**/*.{js,jsx}'],
  },

  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        zaraz: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      'import/resolver': { node: { paths: ['src'] } },
      'import/internal-regex':
        '^(app|components|constants|contexts|hooks|icons|images|lib|styles|utils)/',
      react: { version: 'detect' },
    },
    rules: {
      'react/prop-types': 'error',
      'react/function-component-definition': 'off',
      'react/jsx-sort-props': 'off',
      'import/no-unresolved': 'off',
      'import/named': 'off',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'jsx-a11y/label-has-associated-control': ['error', { required: { some: ['nesting', 'id'] } }],
      // Suppress rules that produce false positives on marketing/docs site patterns
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/mouse-events-have-key-events': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/media-has-caption': 'off',
      'jsx-a11y/no-autofocus': 'off',
    },
  },

  {
    files: ['src/scripts/**/*.js'],
    rules: {
      'no-console': 'off',
      'no-restricted-syntax': 'off',
      'no-use-before-define': 'off',
      'no-await-in-loop': 'off',
      'no-continue': 'off',
    },
  },

  prettierConfig,
];
