import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	optimizeDeps: {
		exclude: [
			"@codemirror/language",
			"svelte-codemirror-editor",
			"@codemirror/lang-javascript",
			 "@codemirror/lang-python",
			 "@codemirror/theme-one-dark",
			 "@codemirror/state",
		]
		
	  },
	plugins: [sveltekit()]
});
