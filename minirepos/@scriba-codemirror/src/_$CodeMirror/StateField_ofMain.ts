import * as $CMS from '@codemirror/state';

import { StateEffect_ofMain } from './StateEffect_ofMain';

/* -------------------------------------------------------------------------- */
/*                                 StateField_ofMain                                 */
/* -------------------------------------------------------------------------- */

export const StateField_ofMain = $CMS.StateField.define<{
  suggestedText: null | string;
}>({
  /* --------------------------------- create --------------------------------- */
  create() {
    return { suggestedText: null };
  },

  /* --------------------------------- update --------------------------------- */
  update(__, tx) {
    const suggestionEffect = tx.effects.find((e) => e.is(StateEffect_ofMain));

    if (
      tx.state.doc &&
      suggestionEffect
      // &&      tx.state.doc == suggestionEffect.value.doc
    ) {
      return { suggestedText: suggestionEffect.value.suggestedText };
    }

    return { suggestedText: null };
  },
});
