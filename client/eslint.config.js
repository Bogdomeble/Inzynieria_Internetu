// client/eslint.config.js

import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import reactPlugin from 'eslint-plugin-react';


export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],

        plugins: {
            '@typescript-eslint': tseslint.plugin,
            'react-hooks': reactHooksPlugin,
            'react-refresh': reactRefreshPlugin,
            'react': reactPlugin, // Dodaj główny plugin Reacta
        },

        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommendedTypeChecked,
        ],

        rules: {
            ...reactHooksPlugin.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
            'react-refresh/only-export-components': 'warn',
        },

        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            globals: {
                ...globals.browser,
            },
            parser: tseslint.parser,
            parserOptions: {
                project: ['./tsconfig.app.json', './tsconfig.node.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
]);