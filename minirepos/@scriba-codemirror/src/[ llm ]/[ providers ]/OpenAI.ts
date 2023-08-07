import { Configuration, OpenAIApi } from 'openai'
import { ILLMProvider } from './[ @types ].mjs'

/* -------------------------------------------------------------------------- */
/*                                   OpenAI                                   */
/* -------------------------------------------------------------------------- */

type tInput = {
  API_KEY: string
  openAiConfigurationInstance?: Configuration
}

/**
 * OpenAI LLM Provider
 * @param i
 * @returns
 */
export const OpenAI = (i: tInput): ILLMProvider<OpenAIApi> => {
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
