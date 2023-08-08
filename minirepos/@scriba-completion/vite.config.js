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
        preserveModulesRoot: 'src'
      }
    }
  },
  plugins: [dts()],
  resolve: {
    alias: {
      '@editors': [resolve(new URL('./src/@editors', import.meta.url).pathname)]
    }
  }
})
