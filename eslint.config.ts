import { FlatCompat } from '@eslint/eslintrc';
import type { Linter } from 'eslint';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig: Linter.FlatConfig[] = [
  // Spread out any base extends you need
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

export default eslintConfig;
