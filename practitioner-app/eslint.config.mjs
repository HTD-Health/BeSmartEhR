import tanstackQuery from '@tanstack/eslint-plugin-query';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config({
    extends: [eslint.configs.recommended, tseslint.configs.recommended, tanstackQuery.configs['flat/recommended']],
    settings: {
        react: {
            version: 'detect'
        }
    },
    ignores: ['.react-router/**', '*.js', '*.mjs'],
    plugins: {
        '@typescript-eslint': typescriptEslint,
        react,
        'react-hooks': reactHooks,
        'unused-imports': unusedImports
    },
    rules: {
        radix: 'off',
        'no-debugger': 'warn',
        'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
        'no-restricted-exports': 'off',
        'react/jsx-no-useless-fragment': 'warn',
        'consistent-return': 'off',
        'no-underscore-dangle': 'off',
        'new-cap': 'off',
        'react/function-component-definition': [
            2,
            {
                namedComponents: 'arrow-function',
                unnamedComponents: 'arrow-function'
            }
        ],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-throw-literal': 'off',
        'react/require-default-props': 'off',
        'react/jsx-no-bind': 'off',
        'react/jsx-no-duplicate-props': [
            1,
            {
                ignoreCase: false
            }
        ],
        '@typescript-eslint/no-unused-vars': 'off',
        'import/prefer-default-export': 'off',
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'warn',
            {
                ignoreRestSiblings: true,
                vars: 'all',
                varsIgnorePattern: '^_',
                args: 'after-used',
                argsIgnorePattern: '^_'
            }
        ],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn'
    }
});
