<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { javascript } from '@codemirror/lang-javascript';
	import { Scriba } from '@scriba/completion/@llm/@providers';
	import { ScribaDefaultCodeSuggestionPrompt } from '@scriba/completion/@llm/@prompts';
	import * as CMV6 from '@scriba/completion/@editors/@codemirror-v6';

	let value = '';
</script>

<CodeMirror
	bind:value
	lang={javascript()}
	extensions={[
		CMV6.Keymaps.Keymap_to_AcceptFullText(),
		CMV6.Keymaps.Keymap_to_AcceptWordByWord(),
		CMV6.ViewPlugins.ViewPlugin_of_Main(),
		CMV6.ViewPlugins.ViewPlugin_of_SuggestionRendering(),
		CMV6.StateFields.StateField_of_LinesContext,
		CMV6.StateFields.StateField_of_TextSuggestion,
		CMV6.fromFacets.Facet_of_LLMPrompt.of(
			ScribaDefaultCodeSuggestionPrompt({
				provider: Scriba({
					authUserJWT: 'public'
				})
			})
		)
	]}
/>
