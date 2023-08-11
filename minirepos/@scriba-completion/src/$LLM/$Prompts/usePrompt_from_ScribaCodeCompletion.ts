import { useScriba } from '$LLM/$Providers'
import { ILLMPrompt } from './$Types'

/* -------------------------------------------------------------------------- */
/*                      usePrompt_from_ScribaCodeCompletion                   */
/* -------------------------------------------------------------------------- */

type ScribaProvider = ReturnType<typeof useScriba>

type usePrompt_from_ScribaCodeCompletion = <
  Provider extends ScribaProvider
>(i: {
  provider: Provider
}) => ILLMPrompt<Provider>

/**
 *
 */
export const usePrompt_from_ScribaCodeCompletion: usePrompt_from_ScribaCodeCompletion =
  i => {
    const meta: ILLMPrompt<typeof i.provider>['<meta>'] = {
      '<type>': 'LLMPrompt',
      '<provider>': i.provider
    }

    const fetchFillInTheMiddleSuggestions: ILLMPrompt<ScribaProvider>['fetchLeftToRightSuggestions'] =
      ({ linesContext }) => {
        return new Promise(r =>
          i.provider['<meta>']['<vendorCli>'].emit(
            'command:fetchCodeSuggestion',
            linesContext,
            (suggestedCode: WSResponse) => {
              r(suggestedCode.value ? [suggestedCode.value] : null)
            }
          )
        )
      }

    const fetchLeftToRightSuggestions: ILLMPrompt<ScribaProvider>['fetchLeftToRightSuggestions'] =
      ({ linesContext }) => {
        return new Promise(r =>
          i.provider['<meta>']['<vendorCli>'].emit(
            'command:fetchCodeSuggestion',
            linesContext,
            (suggestedCode: WSResponse) => {
              r(suggestedCode.value ? [suggestedCode.value] : null)
            }
          )
        )
      }

    return {
      '<meta>': meta,
      fetchFillInTheMiddleSuggestions,
      fetchLeftToRightSuggestions
    }
  }

type WSResponse = {
  '<type>': 'λCodeSuggestion'
  value: string | null
}
