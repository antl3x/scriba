import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  WidgetType
} from '@codemirror/view'

import { useFacet_of_LLMPrompt } from './$Facets'
import {
  useStateEffect_of_FULL_TEXT_WAS_ACCEPTED,
  useStateEffect_of_TEXT_SUGGESTION_WAS_MADE,
  useStateEffect_of_WORD_WAS_ACCEPTED
} from './$StateEffects'
import { useStateField_of_TextSuggestion } from './$StateFields'
import { useGetLinesContext } from './$_Utils_'

/* -------------------------------------------------------------------------- */
/*                               useViewPlugin_of_Main                        */
/* -------------------------------------------------------------------------- */

export const useViewPlugin_of_Main = () => {
  return ViewPlugin.fromClass(
    class Plugin {
      async update(update: ViewUpdate) {
        const doc = update.state.doc
        const llmPrompt = update.state.facet(useFacet_of_LLMPrompt)[0]

        const hasEffect = update.transactions.find(tx =>
          tx.effects.find(
            e =>
              e.is(useStateEffect_of_TEXT_SUGGESTION_WAS_MADE) ||
              e.is(useStateEffect_of_WORD_WAS_ACCEPTED) ||
              e.is(useStateEffect_of_FULL_TEXT_WAS_ACCEPTED)
          )
        )

        // Only fetch if the document has changed
        // and no previous suggestion is present
        if (!update.docChanged || hasEffect) {
          return
        }

        const linesContext = useGetLinesContext({ state: update.state })

        // If there is no content after the cursor, we should provide left-to-right suggestions.
        const isLeftToRight =
          !linesContext.currentLineAfterContent ||
          linesContext.linesAfter.length === 0

        // decide which fetch function to use
        const fetchFn = isLeftToRight
          ? llmPrompt.fetchLeftToRightSuggestions
          : llmPrompt.fetchFillInTheMiddleSuggestions

        const suggestedTexts = await fetchFn({
          linesContext
        })

        // we early-return if no suggestions were found
        if (!suggestedTexts) return

        // Fetch the suggestion
        update.view.dispatch({
          effects: useStateEffect_of_TEXT_SUGGESTION_WAS_MADE.of({
            suggestedTexts,
            doc
          })
        })
      }
    }
  )
}

/* -------------------------------------------------------------------------- */
/*                      useViewPlugin_of_SuggestionRendering                  */
/* -------------------------------------------------------------------------- */

export const useViewPlugin_of_SuggestionRendering = () => {
  /* -------------------------------- _GhostTextWidget ------------------------------- */

  class _GhostTextWidget extends WidgetType {
    suggestedText: string
    constructor(suggestedText: string) {
      super()
      this.suggestedText = suggestedText
    }
    toDOM() {
      const div = document.createElement('span')
      div.style.opacity = '0.4'
      div.className = 'cm-inline-text-suggestion'
      div.textContent = this.suggestedText
      return div
    }
  }

  return ViewPlugin.fromClass(
    class Plugin {
      decorations: DecorationSet
      constructor() {
        this.decorations = Decoration.none
      }

      update(update: ViewUpdate) {
        const { currentText } = update.state.field(
          useStateField_of_TextSuggestion
        )
        if (!currentText) {
          this.decorations = Decoration.none
          return
        }

        this.decorations = _GhostTextDecorations(update.view, currentText)
      }
    },
    {
      decorations: v => v.decorations
    }
  )
  /* ------------------------------ _GhostTextDecorations ----------------------------- */

  /**
   * Provides a suggestion for the next word
   */
  function _GhostTextDecorations(view: EditorView, prefix: string) {
    const pos = view.state.selection.main.head
    const widgets = []
    const w = Decoration.widget({
      widget: new _GhostTextWidget(prefix),
      side: 1
    })
    widgets.push(w.range(pos))
    return Decoration.set(widgets)
  }
}
