/* -------------------------------------------------------------------------- */
/*                                 ILLMPrompt                                 */
/* -------------------------------------------------------------------------- */

import { tLinesContext } from '_@shared_/_@types_'
import { ILLMProvider } from '@llm/@providers/@types'

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
