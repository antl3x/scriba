import * as $CMS from '@codemirror/state'

/* -------------------------------------------------------------------------- */
/*                   StateEffect_of_TEXT_SUGGESTION_WAS_MADE                  */
/* -------------------------------------------------------------------------- */

export const StateEffect_of_TEXT_SUGGESTION_WAS_MADE = $CMS.StateEffect.define<{
  suggestedText: string | null
  doc: $CMS.Text
}>()
