import * as $CMS from '@codemirror/state'

/* -------------------------------------------------------------------------- */
/*                   useStateEffect_of_TEXT_SUGGESTION_WAS_MADE               */
/* -------------------------------------------------------------------------- */

export const useStateEffect_of_TEXT_SUGGESTION_WAS_MADE =
  $CMS.StateEffect.define<{
    suggestedTexts: string[] | null
    doc: $CMS.Text
  }>()
