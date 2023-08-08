import * as $CMS from '@codemirror/state'

import { ILLMPrompt } from '@llm/@prompts/@types'
import { ILLMProvider } from '@llm/@providers/@types'

/* -------------------------------------------------------------------------- */
/*                              Facet_of_LLMPrompt                            */
/* -------------------------------------------------------------------------- */

type tFacet_of_LLMPrompt = $CMS.Facet<ILLMPrompt<ILLMProvider>>

export const Facet_of_LLMPrompt: tFacet_of_LLMPrompt = $CMS.Facet.define({
  static: true
})
