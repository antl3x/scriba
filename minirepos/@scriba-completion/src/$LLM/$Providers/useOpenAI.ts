import { Configuration, OpenAIApi } from 'openai'
import { ILLMProvider } from './$Types'

/* -------------------------------------------------------------------------- */
/*                                   useOpenAI                                */
/* -------------------------------------------------------------------------- */

type useOpenAI = (i: {
  API_KEY: string
  openAiConfigurationInstance?: Configuration
}) => ILLMProvider<OpenAIApi>

/**
 * OpenAI LLM Provider
 */
export const useOpenAI: useOpenAI = i => {
  const _openAIConfigurationInstance =
    i.openAiConfigurationInstance ??
    new Configuration({
      apiKey: i.API_KEY
    })

  const meta = {
    '<vendor>': 'OpenAI' as const,
    '<vendorCli>': new OpenAIApi(_openAIConfigurationInstance)
  }

  return {
    '<meta>': meta
  }
}
