import path from 'node:path';
import { defineConfig } from '@tanstack/start/config';

export default defineConfig({
  server: {
    preset: 'netlify',
  },
  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./app'),
      },
    },
  },
});
