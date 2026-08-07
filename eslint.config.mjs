import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// eslint-config-next is still eslintrc-format, so FlatCompat bridges it into
// ESLint 9's flat config. This replaces `next lint`, which Next 15 deprecated
// and Next 16 removes.
const compat = new FlatCompat({ baseDirectory: __dirname })

const config = [
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'next-env.d.ts'],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      '@next/next/no-img-element': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    // Build scripts are plain CommonJS Node — they never go through the bundler,
    // and package.json has no "type": "module", so require() is correct here.
    files: ['scripts/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { __dirname: 'readonly', process: 'readonly', require: 'readonly' },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]

export default config
