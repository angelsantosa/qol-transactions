import path from 'node:path';
import { defineConfig } from '@tanstack/start/config';

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./app'),
      },
    },
  },
});
