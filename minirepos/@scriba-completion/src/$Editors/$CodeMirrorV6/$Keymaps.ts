import {
  EditorSelection,
  EditorState,
  Prec,
  TransactionSpec
} from '@codemirror/state'
import { keymap } from '@codemirror/view'

import { useStateEffect_of_TEXT_SUGGESTION_WAS_MADE } from './$StateEffects'
import { useStateField_of_TextSuggestion } from './$StateFields'

/* -------------------------------------------------------------------------- */
/*                           useKeymap_to_AcceptFullText                         */
/* -------------------------------------------------------------------------- */

export const useKeymap_to_AcceptFullText = (key = 'Tab') => {
  return Prec.highest(
    keymap.of([
      {
        key,
        run: view => {
          const { currentText } = view.state.field(
            useStateField_of_TextSuggestion
          )

          // If there is no suggestion, do nothing and let the default AcceptFullKeymap handle it
          if (!currentText) {
            return false
          }

          view.dispatch({
            ..._insertSuggestion(
              view.state,
              currentText,
              view.state.selection.main.head,
              view.state.selection.main.head,
              'full'
            )
          })
          return true
        }
      }
    ])
  )
}

/* -------------------------------------------------------------------------- */
/*                           useKeymap_to_AcceptWordByWord                        */
/* -------------------------------------------------------------------------- */

export const useKeymap_to_AcceptWordByWord = (key = 'Control-ArrowRight') => {
  return Prec.highest(
    keymap.of([
      {
        key,
        run: view => {
          const { currentText } = view.state.field(
            useStateField_of_TextSuggestion
          )

          // If there is no suggestion, do nothing and let the default MainKeymap handle it
          if (!currentText) {
            return false
          }

          // suggestedText is current suggestion less the first word
          const newCurrentSuggest = currentText.split(' ').slice(1).join(' ')

          view.dispatch({
            ..._insertSuggestion(
              view.state,
              currentText,
              view.state.selection.main.head,
              view.state.selection.main.head,
              'wordByWord'
            ),
            effects: useStateEffect_of_TEXT_SUGGESTION_WAS_MADE.of({
              suggestedTexts: [newCurrentSuggest],
              doc: view.state.doc
            })
          })

          return true
        }
      }
    ])
  )
}

/* -------------------------- _insertSuggestion ------------------------- */
/**
 * Inserts the first word of the suggestion
 */
function _insertSuggestion(
  state: EditorState,
  text: string,
  from: number,
  to: number,
  type: 'wordByWord' | 'full'
): TransactionSpec {
  const suggestion =
    type == 'full'
      ? text
      : text.split(' ')[0] + (text[text.length - 1] == ' ' ? '' : ' ')

  return {
    ...state.changeByRange(range => {
      if (range == state.selection.main) {
        return {
          changes: { from: from, to: to, insert: suggestion },
          range: EditorSelection.cursor(from + suggestion.length)
        }
      }

      const len = to - from
      if (len > 0) {
        return {
          changes: { from: from, to: to, insert: suggestion },
          range: EditorSelection.range(
            from + suggestion.length,
            to + suggestion.length
          )
        }
      }

      return {
        changes: { from: from, to: to, insert: suggestion },
        range: EditorSelection.cursor(from + suggestion.length)
      }
    }),
    effects: useStateEffect_of_TEXT_SUGGESTION_WAS_MADE.of({
      suggestedTexts: [text],
      doc: state.doc
    })
  }
}
