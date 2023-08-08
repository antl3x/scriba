import {
  EditorSelection,
  EditorState,
  Prec,
  TransactionSpec
} from '@codemirror/state'
import { keymap } from '@codemirror/view'

import { StateEffect_of_TEXT_SUGGESTION_WAS_MADE } from './@state-effects'
import { StateField_of_TextSuggestion } from './@state-fields'

/* -------------------------------------------------------------------------- */
/*                           Keymap_to_AcceptFullText                         */
/* -------------------------------------------------------------------------- */

export const Keymap_to_AcceptFullText = (key = 'Tab') => {
  return Prec.highest(
    keymap.of([
      {
        key,
        run: view => {
          const { currentText } = view.state.field(StateField_of_TextSuggestion)

          // If there is no suggestion, do nothing and let the default AcceptFullKeymap handle it
          if (!currentText) {
            return false
          }

          view.dispatch({
            ...__insertSuggestedText(
              view.state,
              currentText,
              view.state.selection.main.head,
              view.state.selection.main.head
            )
          })
          return true
        }
      }
    ])
  )

  /* -------------------------- __insertSuggestedText -------------------------- */
  /**
   * Inserts the whole suggestion
   */
  function __insertSuggestedText(
    state: EditorState,
    text: string,
    from: number,
    to: number
  ): TransactionSpec {
    return {
      ...state.changeByRange(range => {
        if (range == state.selection.main)
          return {
            changes: { from: from, to: to, insert: text },
            range: EditorSelection.cursor(from + text.length)
          }
        const len = to - from
        if (
          !range.empty ||
          (len &&
            state.sliceDoc(range.from - len, range.from) !=
              state.sliceDoc(from, to))
        )
          return { range }
        return {
          changes: { from: range.from - len, to: range.from, insert: text },
          range: EditorSelection.cursor(range.from - len + text.length)
        }
      }),
      userEvent: 'input.complete'
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                           Keymap_to_AcceptWordByWord                        */
/* -------------------------------------------------------------------------- */

export const Keymap_to_AcceptWordByWord = (key = 'Control-ArrowRight') => {
  return Prec.highest(
    keymap.of([
      {
        key,
        run: view => {
          const { currentText } = view.state.field(StateField_of_TextSuggestion)

          // If there is no suggestion, do nothing and let the default MainKeymap handle it
          if (!currentText) {
            return false
          }

          // suggestedText is current suggestion less the first word
          const newCurrentSuggest = currentText.split(' ').slice(1).join(' ')

          view.dispatch({
            ...__insertSuggestedWord(
              view.state,
              currentText,
              view.state.selection.main.head,
              view.state.selection.main.head
            ),
            effects: StateEffect_of_TEXT_SUGGESTION_WAS_MADE.of({
              suggestedTexts: [newCurrentSuggest],
              doc: view.state.doc
            })
          })

          return true
        }
      }
    ])
  )
  /* -------------------------- __insertSuggestedWord ------------------------- */
  /**
   * Inserts the first word of the suggestion
   */
  function __insertSuggestedWord(
    state: EditorState,
    text: string,
    from: number,
    to: number
  ): TransactionSpec {
    return {
      ...state.changeByRange(range => {
        // get first word of text and if previous suggestion character
        // is a space we append a space
        const word =
          text.split(' ')[0] + (text[text.length - 1] == ' ' ? '' : ' ')

        if (range == state.selection.main)
          return {
            changes: { from: from, to: to, insert: word },
            range: EditorSelection.cursor(from + word.length)
          }
        const len = to - from
        if (
          !range.empty ||
          (len &&
            state.sliceDoc(range.from - len, range.from) !=
              state.sliceDoc(from, to))
        )
          return { range }
        return {
          changes: { from: range.from - len, to: range.from, insert: word },
          range: EditorSelection.cursor(range.from - len + word.length)
        }
      }),
      userEvent: 'input.complete'
    }
  }
}
