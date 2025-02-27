import { configDefaults, defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    setupFiles: ['@vitest/web-worker'],
    exclude: [...configDefaults.exclude],
    coverage: {
      exclude: [
        'src/api/',
        'src/pages/theme/',
        'src/schema',
        'src/data/',
        'src/services',
        'src/types',
        'src/store',
        'src/assets/',
        '**/*.config.*',
        '**/*.d.ts',
      ],
      include: ['src/**/*.ts'],
    },
  },
});
