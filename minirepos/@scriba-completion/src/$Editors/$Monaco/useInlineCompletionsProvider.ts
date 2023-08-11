import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { useGetLinesContext } from './_$Utils_'
import { ILLMPrompt } from '$LLM/$Prompts/$Types'
import { ILLMProvider } from '$LLM/$Providers/$Types'
import { useSleep } from '_$Shared_/_$Utils_'

/* -------------------------------------------------------------------------- */
/*                        useInlineCompletionsProvider                        */
/* -------------------------------------------------------------------------- */

type useInlineCompletionsProvider = (i: {
  llmPrompt: ILLMPrompt<ILLMProvider<unknown>>
}) => Monaco.languages.InlineCompletionsProvider

/**
 * This is the `InlineCompletionsProvider` that is used by Monaco.
 *
 * It is responsible for providing suggestions to the editor.
 * You must register this provider with Monaco in order for suggestions to appear.
 *
 * @example
 * monaco.languages.registerInlineCompletionsProvider('javascript', useInlineCompletionsProvider({ llmPrompt }))
 *
 * @see https://microsoft.github.io/monaco-editor/api/interfaces/monaco.languages.inlinecompletionsprovider.html
 */
export const useInlineCompletionsProvider: useInlineCompletionsProvider = ({
  llmPrompt
}) => {
  let suggestionSlotEmpty = true

  const provideInlineCompletions: Monaco.languages.InlineCompletionsProvider['provideInlineCompletions'] =
    async (model, position, _, token) => {
      try {
        await useSleep(50)
        suggestionSlotEmpty = true

        // we early-return in the following cases:
        if (
          token.isCancellationRequested ||
          !suggestionSlotEmpty ||
          !model.getValue()
        ) {
          return
        }

        const linesContext = useGetLinesContext({ model, position })

        // If there is no content after the cursor, we should provide left-to-right suggestions.
        const isLeftToRight =
          !linesContext.currentLineAfterContent ||
          linesContext.linesAfter.length === 0

        // decide which fetch function to use
        const fetchFn = isLeftToRight
          ? llmPrompt.fetchLeftToRightSuggestions
          : llmPrompt.fetchFillInTheMiddleSuggestions

        const suggestions = await fetchFn({
          linesContext
        })

        // early-return if no suggestions
        if (!suggestions) return

        const result: Monaco.languages.InlineCompletions = {
          enableForwardStability: true,
          items: [
            {
              range: {
                startColumn: 1,
                startLineNumber: position.lineNumber,
                endColumn: position.column,
                endLineNumber: position.lineNumber
              },
              insertText: linesContext.currentLineBeforeContent + suggestions[0]
            }
          ],
          commands: []
        }

        // we update the suggestionSlotEmpty to false so that we can provide new suggestions
        suggestionSlotEmpty = false

        return result
      } catch (error) {
        console.log('Something went wrong when fetching suggestions', error)
        return
      }
    }

  /* -------------------------- freeInlineCompletions ------------------------- */

  const freeInlineCompletions: Monaco.languages.InlineCompletionsProvider['freeInlineCompletions'] =
    () => {
      // we update the suggestionSlotEmpty to true so that we can provide new suggestions
      suggestionSlotEmpty = true
    }

  return {
    provideInlineCompletions,
    freeInlineCompletions
  }
}
