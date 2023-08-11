/* -------------------------------------------------------------------------- */
/*                                 ILLMPrompt                                 */
/* -------------------------------------------------------------------------- */

import { ILLMProvider } from '$LLM/$Providers/$Types'
import { tLinesContext } from '_$Shared_/_$Types_'

export interface ILLMPrompt<Provider extends ILLMProvider<any>> {
  '<meta>': {
    '<type>': 'LLMPrompt'
    '<provider>': Provider
  }

  /**
   * Fetches a suggestion from the provider
   */
  fetchFillInTheMiddleSuggestions: (i: {
    linesContext: tLinesContext
  }) => Promise<string[] | null>

  /**
   * Fetches a suggestion from the provider
   */
  fetchLeftToRightSuggestions: (i: {
    linesContext: tLinesContext
  }) => Promise<string[] | null>
}
