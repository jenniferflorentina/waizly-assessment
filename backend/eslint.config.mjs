/* eslint-disable */
/* tslint:disable */
import { dirname } from 'path';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';

import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['**/.eslintrc.js'],
  },
  ...compat.extends(
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },

      parser: tsParser,
      ecmaVersion: 'latest', // Updated to latest ECMAScript version
      sourceType: 'module',

      parserOptions: {
        project: './tsconfig.json', // Ensure this path is correct relative to your ESLint config
        tsconfigRootDir: __dirname,
      },
    },

    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'prettier/prettier': 'error',
      'max-classes-per-file': 0,
      'class-methods-use-this': 0,
      'import/prefer-default-export': 0,
      'no-useless-escape': 'off', // Ignore unnecessary escape character
    },
  },
];
