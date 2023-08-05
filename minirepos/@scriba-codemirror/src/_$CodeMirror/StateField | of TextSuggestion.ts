import * as $CMS from '@codemirror/state'

import { StateEffect_of_TEXT_SUGGESTION_WAS_MADE } from './StateEffect | of TEXT_SUGGESTION_WAS_MADE'

/* -------------------------------------------------------------------------- */
/*                                 StateField_of_TextSuggestion               */
/* -------------------------------------------------------------------------- */

export const StateField_of_TextSuggestion = $CMS.StateField.define<{
  suggestedText: null | string
}>({
  /* --------------------------------- create --------------------------------- */
  create() {
    return { suggestedText: null }
  },

  /* --------------------------------- update --------------------------------- */
  update(__, tx) {
    const effect = tx.effects.find(e =>
      e.is(StateEffect_of_TEXT_SUGGESTION_WAS_MADE)
    )

    if (tx.state.doc && effect && tx.state.doc == effect.value.doc) {
      return { suggestedText: effect.value.suggestedText }
    }

    return { suggestedText: null }
  }
})
