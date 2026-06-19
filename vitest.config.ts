import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      env: {
        VITE_API_BASE_URL: 'http://localhost:3000',
        VITE_ENABLE_MSW: 'false',
      },
      css: true,
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      exclude: ['node_modules', 'dist', 'e2e', '.idea', '.git'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        exclude: [
          'node_modules/',
          'src/test/',
          'src/**/*.d.ts',
          'src/**/*.config.*',
          'src/main.tsx',
          'src/routeTree.gen.ts',
          'src/shared/api/generated/**',
        ],
      },
    },
  }),
);
