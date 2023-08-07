import * as $CMS from '@codemirror/state'

import { tLinesContext } from '[ _shared_ ]/[ @types ]'

import { useGetLinesContext } from './[ _utils_ ]'
import { StateEffect_of_TEXT_SUGGESTION_WAS_MADE } from './[ state-effects ]'

/* -------------------------------------------------------------------------- */
/*                        StateField_of_TextSuggestion                        */
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

/* -------------------------------------------------------------------------- */
/*                         StateField_of_LinesContext                         */
/* -------------------------------------------------------------------------- */

export const StateField_of_LinesContext = $CMS.StateField.define<tLinesContext>(
  {
    /* --------------------------------- create --------------------------------- */
    create(state) {
      return useGetLinesContext({ state })
    },

    /* --------------------------------- update --------------------------------- */
    update(prevState, tx) {
      if (!tx.docChanged) return prevState
      return useGetLinesContext({ state: tx.state })
    }
  }
)
