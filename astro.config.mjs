import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://alvin999.github.io',
  base: '/finer-fantasy',
  integrations: [react()]
});