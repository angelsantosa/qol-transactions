import path from 'node:path';
import { defineConfig } from '@tanstack/start/config';
import { cloudflare } from 'unenv';

export default defineConfig({
  server: {
    preset: 'cloudflare-pages',
    unenv: cloudflare,
  },
  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./app'),
      },
    },
  },
});
