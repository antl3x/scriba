import * as $CMS from '@codemirror/state'

/* -------------------------------------------------------------------------- */
/*                   useStateEffect_of_TEXT_SUGGESTION_WAS_MADE               */
/* -------------------------------------------------------------------------- */

export const useStateEffect_of_TEXT_SUGGESTION_WAS_MADE =
  $CMS.StateEffect.define<{
    suggestedTexts: string[] | null
    doc: $CMS.Text
  }>()

/* -------------------------------------------------------------------------- */
/*                     useStateEffect_of_WORD_WAS_ACCEPTED                    */
/* -------------------------------------------------------------------------- */

export const useStateEffect_of_WORD_WAS_ACCEPTED = $CMS.StateEffect.define<{
  newSuggestedTexts: string[]
  acceptedWord: string
  doc: $CMS.Text
}>()

/* -------------------------------------------------------------------------- */
/*                  useStateEffect_of_FULL_TEXT_WAS_ACCEPTED                  */
/* -------------------------------------------------------------------------- */

export const useStateEffect_of_FULL_TEXT_WAS_ACCEPTED =
  $CMS.StateEffect.define<{
    acceptedFullText: string
    doc: $CMS.Text
  }>()
