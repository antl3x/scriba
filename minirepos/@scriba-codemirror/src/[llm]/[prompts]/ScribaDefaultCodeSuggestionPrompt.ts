import { Scriba } from '[llm]/[providers]'
import { ILLMPrompt } from './[@types].mjs'

/* -------------------------------------------------------------------------- */
/*                      ScribaDefaultCodeSuggestionPrompt                     */
/* -------------------------------------------------------------------------- */

type ScribaProvider = ReturnType<typeof Scriba>

type FnSig = <Provider extends ScribaProvider>(i: {
  provider: Provider
}) => ILLMPrompt<Provider>

/**
 *
 */
export const ScribaDefaultCodeSuggestionPrompt: FnSig = i => {
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
          (suggestedCode: string | null) => {
            r([suggestedCode])
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
          (suggestedCode: string | null) => {
            r([suggestedCode])
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
