import * as $CMS from '@codemirror/state'

import {
  useStateEffect_of_FULL_TEXT_WAS_ACCEPTED,
  useStateEffect_of_TEXT_SUGGESTION_WAS_MADE,
  useStateEffect_of_WORD_WAS_ACCEPTED
} from './$StateEffects'
import { tLinesContext } from '_$Shared_/_$Types_'
import { useGetLinesContext } from './$_Utils_'

/* -------------------------------------------------------------------------- */
/*                        useStateField_of_TextSuggestion                     */
/* -------------------------------------------------------------------------- */

export const useStateField_of_TextSuggestion = $CMS.StateField.define<{
  suggestedTexts: null | string[]
  currentText: null | string
}>({
  /* --------------------------------- create --------------------------------- */
  create() {
    return { suggestedTexts: null, currentText: null }
  },

  /* --------------------------------- update --------------------------------- */
  update(__, tx) {
    const effect = tx.effects.find(
      e =>
        e.is(useStateEffect_of_TEXT_SUGGESTION_WAS_MADE) ||
        e.is(useStateEffect_of_WORD_WAS_ACCEPTED) ||
        e.is(useStateEffect_of_FULL_TEXT_WAS_ACCEPTED)
    )

    if (effect?.is(useStateEffect_of_WORD_WAS_ACCEPTED)) {
      return {
        suggestedTexts: effect.value.newSuggestedTexts,
        currentText: effect.value.newSuggestedTexts[0]
      }
    }

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
/*                         useStateField_of_LinesContext                      */
/* -------------------------------------------------------------------------- */

export const useStateField_of_LinesContext =
  $CMS.StateField.define<tLinesContext>({
    /* --------------------------------- create --------------------------------- */
    create(state) {
      return useGetLinesContext({ state })
    },

    /* --------------------------------- update --------------------------------- */
    update(prevState, tx) {
      if (!tx.docChanged) return prevState
      return useGetLinesContext({ state: tx.state })
    }
  })
