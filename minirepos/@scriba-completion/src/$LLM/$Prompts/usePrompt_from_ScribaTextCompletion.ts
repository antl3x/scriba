import { useScriba } from '$LLM/$Providers'
import { ILLMPrompt } from './$Types'

/* -------------------------------------------------------------------------- */
/*                      usePrompt_from_ScribaTextCompletion                  */
/* -------------------------------------------------------------------------- */

type ScribaProvider = ReturnType<typeof useScriba>

type usePrompt_from_ScribaTextCompletion = <
  Provider extends ScribaProvider
>(i: {
  provider: Provider
}) => ILLMPrompt<Provider>

/**
 *
 */
export const usePrompt_from_ScribaTextCompletion: usePrompt_from_ScribaTextCompletion =
  i => {
    const meta: ILLMPrompt<typeof i.provider>['<meta>'] = {
      '<type>': 'LLMPrompt',
      '<provider>': i.provider
    }

    const fetchFillInTheMiddleSuggestions: ILLMPrompt<ScribaProvider>['fetchLeftToRightSuggestions'] =
      ({ linesContext }) => {
        return new Promise(r =>
          i.provider['<meta>']['<vendorCli>'].emit(
            'command:fetchTextSuggestion',
            linesContext,
            (suggestedText: string | null) => {
              r(suggestedText ? [suggestedText] : null)
            }
          )
        )
      }

    const fetchLeftToRightSuggestions: ILLMPrompt<ScribaProvider>['fetchLeftToRightSuggestions'] =
      ({ linesContext }) => {
        return new Promise(r =>
          i.provider['<meta>']['<vendorCli>'].emit(
            'command:fetchTextSuggestion',
            linesContext,
            (suggestedText: string | null) => {
              r(suggestedText ? [suggestedText] : null)
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
