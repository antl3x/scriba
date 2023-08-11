import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import pkg from './package.json'

export default defineConfig({
  build: {
    sourcemap: false,
    lib: {
      formats: ['esm', 'cjs'],
      entry: [resolve(new URL('./src/index.ts', import.meta.url).pathname)]
    },
    rollupOptions: {
      external: Object.keys(pkg.peerDependencies || {}),
      output: {
        dir: 'dist',
        preserveModules: true,
        preserveModulesRoot: 'src',
        sanitizeFileName: i => i
      }
    }
  },
  resolve: {
    alias: {
      _$Shared_: resolve(new URL('./src/_$Shared_', import.meta.url).pathname)
    }
  },
  plugins: [dts()]
})
