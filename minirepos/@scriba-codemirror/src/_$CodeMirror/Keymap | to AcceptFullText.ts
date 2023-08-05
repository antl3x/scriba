import {
  EditorSelection,
  EditorState,
  Prec,
  TransactionSpec
} from '@codemirror/state'
import { keymap } from '@codemirror/view'

import { StateField_of_TextSuggestion } from './StateField | of TextSuggestion'

/* -------------------------------------------------------------------------- */
/*                           Keymap_to_AcceptFullText                         */
/* -------------------------------------------------------------------------- */

export const Keymap_to_AcceptFullText = Prec.highest(
  keymap.of([
    {
      key: 'Tab',
      run: view => {
        const suggestionText = view.state.field(
          StateField_of_TextSuggestion
        )?.suggestedText

        // If there is no suggestion, do nothing and let the default AcceptFullKeymap handle it
        if (!suggestionText) {
          return false
        }

        view.dispatch({
          ...__insertSuggestedText(
            view.state,
            suggestionText,
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
