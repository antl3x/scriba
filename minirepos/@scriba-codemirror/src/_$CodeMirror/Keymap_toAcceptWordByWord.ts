import {
  EditorSelection,
  EditorState,
  Prec,
  TransactionSpec,
} from '@codemirror/state';
import { Keymap } from '@codemirror/view';

import { StateField } from './StateField_ofMain';
import { StateEffect } from './StateEffect_ofMain';

/* -------------------------------------------------------------------------- */
/*                           Keymap_toAcceptWordByWord                        */
/* -------------------------------------------------------------------------- */

export const Keymap_toAcceptWordByWord = Prec.highest(
  Keymap.of([
    {
      key: 'Control-ArrowRight',
      run: (view) => {
        const suggestionText = view.state.field(StateField)?.suggestedText;

        // If there is no suggestion, do nothing and let the default MainKeymap handle it
        if (!suggestionText) {
          return false;
        }

        // suggestedText is current suggestion less the first word
        const suggestedText = suggestionText.split(' ').slice(1).join(' ');

        view.dispatch({
          ...__insertSuggestedWord(
            view.state,
            suggestionText,
            view.state.selection.main.head,
            view.state.selection.main.head
          ),
          effects: StateEffect.of({
            suggestedText: suggestedText,
            doc: view.state.doc,
          }),
        });

        return true;
      },
    },
  ])
);

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
    ...state.changeByRange((range) => {
      // get first word of text and if previous suggestion character
      // is a space we append a space
      const word =
        text.split(' ')[0] + (text[text.length - 1] == ' ' ? '' : ' ');

      if (range == state.selection.main)
        return {
          changes: { from: from, to: to, insert: word },
          range: EditorSelection.cursor(from + word.length),
        };
      const len = to - from;
      if (
        !range.empty ||
        (len &&
          state.sliceDoc(range.from - len, range.from) !=
            state.sliceDoc(from, to))
      )
        return { range };
      return {
        changes: { from: range.from - len, to: range.from, insert: word },
        range: EditorSelection.cursor(range.from - len + word.length),
      };
    }),
    userEvent: 'input.complete',
  };
}
