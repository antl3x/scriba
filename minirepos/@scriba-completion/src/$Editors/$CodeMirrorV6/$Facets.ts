import * as $CMS from '@codemirror/state'

import { ILLMPrompt } from '$LLM/$Prompts/$Types'
import { ILLMProvider } from '$LLM/$Providers/$Types'

/* -------------------------------------------------------------------------- */
/*                            useFacet_of_LLMPrompt                           */
/* -------------------------------------------------------------------------- */

type tFacet_of_LLMPrompt = $CMS.Facet<ILLMPrompt<ILLMProvider>>

export const useFacet_of_LLMPrompt: tFacet_of_LLMPrompt = $CMS.Facet.define({
  static: true
})
