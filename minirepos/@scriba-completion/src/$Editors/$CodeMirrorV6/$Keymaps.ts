import {
  EditorSelection,
  EditorState,
  Prec,
  TransactionSpec
} from '@codemirror/state'
import { keymap } from '@codemirror/view'

import {
  useStateEffect_of_FULL_TEXT_WAS_ACCEPTED,
  useStateEffect_of_WORD_WAS_ACCEPTED
} from './$StateEffects'
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

          view.dispatch({
            ..._insertSuggestion(
              view.state,
              currentText,
              view.state.selection.main.head,
              view.state.selection.main.head,
              'wordByWord'
            )
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
  const suggestion = __createSuggestion(text, type)
  const effectToDispatch = __determineEffectToDispatch(
    type,
    suggestion,
    state,
    text
  )

  return {
    ...state.changeByRange(() => __getChangesAndRange(from, to, suggestion)),
    effects: effectToDispatch
  }
}

/* -------------------------- __getChangesAndRange -------------------------- */

function __getChangesAndRange(from: number, to: number, suggestion: string) {
  return {
    changes: { from: from, to: to, insert: suggestion },
    range: EditorSelection.range(
      from + suggestion.length,
      to + suggestion.length
    )
  }
}

/* ----------------------- __determineEffectToDispatch ---------------------- */

function __determineEffectToDispatch(
  type: 'wordByWord' | 'full',
  suggestion: string,
  state: EditorState,
  text: string
) {
  return type == 'wordByWord'
    ? useStateEffect_of_WORD_WAS_ACCEPTED.of({
        acceptedWord: suggestion,
        doc: state.doc,
        newSuggestedTexts: [text.split(' ').slice(1).join(' ')]
      })
    : useStateEffect_of_FULL_TEXT_WAS_ACCEPTED.of({
        acceptedFullText: suggestion,
        doc: state.doc
      })
}

/* -------------------------- __createSuggestion -------------------------- */

function __createSuggestion(text: string, type: 'wordByWord' | 'full'): string {
  return type == 'full'
    ? text
    : text.split(' ')[0] + (text[text.length - 1] == ' ' ? '' : ' ')
}
