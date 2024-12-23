import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

export default defineConfig({
  plugins: [
    Vue(),
    Tailwindcss(),
    AutoImport({
      imports: [
        'vue',
        {
          'vue-router': ['useRoute', 'useRouter'],
          '@vueuse/core': ['useLocalStorage'],
        },
      ],
      dirs: ['src/composables', 'src/utils'],
      dts: 'src/shims/auto-imports.d.ts',
    }),
    Components({
      resolvers: [
        IconsResolver({ prefix: '' }),
      ],
      dts: 'src/shims/components.d.ts',
    }),
    Icons(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/phaser')) {
            return 'phaser'
          } else if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
  },
})
