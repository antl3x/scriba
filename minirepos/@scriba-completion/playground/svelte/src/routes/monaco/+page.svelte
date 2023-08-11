<script lang="ts">
	import loader from '@monaco-editor/loader';
	import { onDestroy, onMount } from 'svelte';
	import type * as TMonaco from 'monaco-editor/esm/vs/editor/editor.api';
	import * as Monaco from 'monaco-editor';
	import { useInlineCompletionsProvider } from '@scriba/completion/$Editors/$Monaco';
	import { useScriba } from '@scriba/completion/$LLM/$Providers';
	import { usePrompt_from_ScribaCodeCompletion } from '@scriba/completion/$LLM/$Prompts';
	import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
	import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
	import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
	import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
	import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

	let editor: TMonaco.editor.IStandaloneCodeEditor;
	let monaco: typeof Monaco;
	let editorContainer: HTMLElement;

	onMount(async () => {
		// @ts-ignore
		self.MonacoEnvironment = {
			getWorker: function (_moduleId: any, label: string) {
				if (label === 'json') {
					return new jsonWorker();
				}
				if (label === 'css' || label === 'scss' || label === 'less') {
					return new cssWorker();
				}
				if (label === 'html' || label === 'handlebars' || label === 'razor') {
					return new htmlWorker();
				}
				if (label === 'typescript' || label === 'javascript') {
					return new tsWorker();
				}
				return new editorWorker();
			}
		};
		const monacoEditor = await import('monaco-editor');
		loader.config({ monaco: Monaco });

		monaco = await loader.init();

		// Your monaco instance is ready, let's display some code!
		const editor = monaco.editor.create(editorContainer);
		const model = monaco.editor.createModel(
			"console.log('Hello from Monaco! (the editor, not the city...)')",
			undefined,
			// Give monaco a hint which syntax highlighting to use
			monaco.Uri.file('sample.js')
		);
		editor.setModel(model);
		monaco.languages.registerInlineCompletionsProvider(
			'javascript',
			useInlineCompletionsProvider({
				llmPrompt: usePrompt_from_ScribaCodeCompletion({
					provider: useScriba({
						authUserJWT: 'public'
					})
				})
			})
		);
	});

	onDestroy(() => {
		monaco?.editor.getModels().forEach((model) => model.dispose());
	});
</script>

<div>
	<div class="container" bind:this={editorContainer} />
</div>

<style>
	.container {
		width: 100%;
		height: 600px;
	}
</style>
