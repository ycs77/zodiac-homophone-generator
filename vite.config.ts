import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { HeadlessUiResolver } from 'unplugin-vue-components/resolvers'
import Pages from 'vite-plugin-pages'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

export default defineConfig({
  plugins: [
    Vue(),
    AutoImport({
      imports: [
        'vue',
        {
          'vue-router': ['useRoute', 'useRouter'],
          '@vueuse/core': [],
        },
      ],
      dirs: ['src/composables'],
      dts: 'src/shims/auto-imports.d.ts',
    }),
    Components({
      resolvers: [
        HeadlessUiResolver(),
        IconsResolver({ prefix: '' }),
      ],
      dts: 'src/shims/components.d.ts',
    }),
    Pages(),
    Icons(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
