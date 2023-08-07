import { Scriba } from '[ llm ]/[ providers ]'

import { ILLMPrompt } from './[ @types ]'

/* -------------------------------------------------------------------------- */
/*                      ScribaDefaultTextSuggestionPrompt                     */
/* -------------------------------------------------------------------------- */

type ScribaProvider = ReturnType<typeof Scriba>

type FnSig = <Provider extends ScribaProvider>(i: {
  provider: Provider
}) => ILLMPrompt<Provider>

/**
 *
 */
export const ScribaDefaultTextSuggestionPrompt: FnSig = i => {
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
            r([suggestedText])
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
            r([suggestedText])
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
