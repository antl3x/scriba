import { Scriba } from '@llm/@providers'
import { ILLMPrompt } from './@types'

/* -------------------------------------------------------------------------- */
/*                      ScribaDefaultCodeSuggestionPrompt                     */
/* -------------------------------------------------------------------------- */

type ScribaProvider = ReturnType<typeof Scriba>

type ScribaDefaultCodeSuggestionPrompt = <Provider extends ScribaProvider>(i: {
  provider: Provider
}) => ILLMPrompt<Provider>

/**
 *
 */
export const ScribaDefaultCodeSuggestionPrompt: ScribaDefaultCodeSuggestionPrompt =
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
