import { ViewPlugin, ViewUpdate } from '@codemirror/view'

import * as _$Utils from '_$Utils'
import * as $SuggestionService from '_$Suggestion'
import { useSettingsStore } from '$Main/_$SettingsStore'

import { Store_ofThe_Editor } from './[ _use ] Store | ofThe Editor'
import { StateEffect_of_TEXT_SUGGESTION_WAS_MADE } from './StateEffect | of TEXT_SUGGESTION_WAS_MADE'
import { StateField_of_TextSuggestion } from './StateField | of TextSuggestion'

/* -------------------------------------------------------------------------- */
/*                               ViewPlugin_of_Main                           */
/* -------------------------------------------------------------------------- */

export const ViewPlugin_of_Main = () => {
  return ViewPlugin.fromClass(
    class Plugin {
      async update(update: ViewUpdate) {
        const doc = update.state.doc

        // Only fetch if the document has changed
        // and no previous suggestion is present
        if (
          !update.docChanged ||
          !!update.state.field(StateField_of_TextSuggestion)?.suggestedText
        ) {
          return
        }

        // Define which fetch function based on the model name
        const fetchFn = _$Utils._$Store
          .useGet(useSettingsStore)
          ?.modelName.includes('code-')
          ? $SuggestionService._useFetchCodeSuggestion
          : $SuggestionService._useFetchTextSuggestion

        // Update state with the change
        Store_ofThe_Editor.set({
          '<cause>': 'DOCUMENT_WAS_CHANGED',
          ..._$Utils.useGetLinesContext({ update })
        })

        // Fetch the suggestion
        update.view.dispatch({
          effects: StateEffect_of_TEXT_SUGGESTION_WAS_MADE.of({
            suggestedText: (await fetchFn()).value,
            doc
          })
        })
      }
    }
  )
}
