import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    sourcemap: false,
    lib: {
      formats: ['es', 'cjs'],
      entry: [resolve(__dirname, 'src/index.ts')],
    },
    rollupOptions: {
      external: ['@codemirror/state', '@codemirror/view'],
    },
  },
  plugins: [dts()],
  resolve: {
    alias: {
      '( Main )': resolve(__dirname, 'src/( Main )'),
      '( Utils )': resolve(__dirname, 'src/( Utils )'),
      '( CodeMirrorExtension )': resolve(
        __dirname,
        'src/( CodeMirrorExtension )'
      ),
      '( SuggestionService )': resolve(__dirname, 'src/( SuggestionService )'),
    },
  },
});
