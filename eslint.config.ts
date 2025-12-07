import { defineConfig, globalIgnores } from 'eslint/config';
import config from '@dword-design/eslint-config';

export default defineConfig([
  globalIgnores(['eslint.config.ts', 'eslint.lint-staged.config.ts', 'vite.config.ts', 'entry.ts']),
  config,
]);
