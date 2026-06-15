// @ts-check

import antfu from '@antfu/eslint-config'
import tailwindcss from 'eslint-plugin-better-tailwindcss'

export default antfu(
  {
    formatters: true,
    svelte: true,
    rules: {
      'ts/no-redeclare': 'off',
      'style/quote-props': 'off',
    },
  },
  tailwindcss.configs.recommended,
  {
    settings: {
      'better-tailwindcss': {
        entryPoint: './src/routes/layout.css',
      },
    },
    rules: {
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
    },
  },
)
