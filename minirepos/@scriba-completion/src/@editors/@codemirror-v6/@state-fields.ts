import * as $CMS from '@codemirror/state'

import { tLinesContext } from '_@shared_/_@types_'
import { useGetLinesContext } from './@_utils_@'

import { StateEffect_of_TEXT_SUGGESTION_WAS_MADE } from './@state-effects'

/* -------------------------------------------------------------------------- */
/*                        StateField_of_TextSuggestion                        */
/* -------------------------------------------------------------------------- */

export const StateField_of_TextSuggestion = $CMS.StateField.define<{
  suggestedTexts: null | string[]
  currentText: null | string
}>({
  /* --------------------------------- create --------------------------------- */
  create() {
    return { suggestedTexts: null, currentText: null }
  },

  /* --------------------------------- update --------------------------------- */
  update(__, tx) {
    const effect = tx.effects.find(e =>
      e.is(StateEffect_of_TEXT_SUGGESTION_WAS_MADE)
    )

    if (tx.state.doc && effect && tx.state.doc == effect.value.doc) {
      return {
        suggestedTexts: effect.value.suggestedTexts,
        currentText: effect.value.suggestedTexts[0]
      }
    }

    return { suggestedTexts: null, currentText: null }
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
