import { usePrompt_from_ScribaCodeCompletion } from '$LLM/$Prompts'
import { useScriba } from '$LLM/$Providers'
import { useFacet_of_LLMPrompt } from './$Facets'

export const useBasicExtension = () => [
  useFacet_of_LLMPrompt.of(
    usePrompt_from_ScribaCodeCompletion({
      provider: useScriba({
        authUserJWT: 'public'
      })
    })
  )
]
