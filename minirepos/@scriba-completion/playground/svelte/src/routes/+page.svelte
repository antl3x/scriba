<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { javascript } from '@codemirror/lang-javascript';
	import { useScriba } from '@scriba/completion/$LLM/$Providers';
	import { usePrompt_from_ScribaCodeCompletion } from '@scriba/completion/$LLM/$Prompts';
	import * as fromCMV6 from '@scriba/completion/$Editors/$CodeMirrorV6';

	let value = '';
</script>

<CodeMirror
	bind:value
	lang={javascript()}
	extensions={[
		fromCMV6.fromKeymaps.useKeymap_to_AcceptFullText(),
		fromCMV6.fromKeymaps.useKeymap_to_AcceptWordByWord(),
		fromCMV6.fromViewPlugins.useViewPlugin_of_Main(),
		fromCMV6.fromViewPlugins.useViewPlugin_of_SuggestionRendering(),
		fromCMV6.fromStateFields.useStateField_of_LinesContext,
		fromCMV6.fromStateFields.useStateField_of_TextSuggestion,
		fromCMV6.fromFacets.useFacet_of_LLMPrompt.of(
			usePrompt_from_ScribaCodeCompletion({
				provider: useScriba({
					authUserJWT: 'public'
				})
			})
		)
	]}
/>
