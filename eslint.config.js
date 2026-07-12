// @ts-check

import antfu from '@antfu/eslint-config'
import tailwindcss from 'eslint-plugin-better-tailwindcss'
import reactHooks from 'eslint-plugin-react-hooks'

export default antfu(
  {
    formatters: true,
    react: true,
    rules: {
      'ts/no-redeclare': 'off',
      'style/quote-props': 'off',
      'style/jsx-quotes': ['error', 'prefer-single'],
      'react-refresh/only-export-components': 'off',
    },
  },
  reactHooks.configs.flat['recommended-latest'],
  tailwindcss.configs.recommended,
  {
    settings: {
      'better-tailwindcss': {
        entryPoint: './src/routes/layout.css',
      },
    },
    rules: {
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
      'better-tailwindcss/enforce-consistent-class-order': 'off',
    },
  },
  {
    ignores: ['src/routeTree.gen.ts'],
  },
)
