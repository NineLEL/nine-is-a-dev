// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('swiper-')
        }
      },
      reactivityTransform: true
    })
  ],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['vue']
    }
  }
});
