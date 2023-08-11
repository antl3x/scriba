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
 *
 * **IMPORTANT**: It's not recommended to use this provider directly in client-side code,
 * as it exposes your API key to the client. This is only meant to be used in localhost scenarios,
 * where you can be sure that your API key is not exposed to the public.
 *
 * If you wish to use this prompt in client-side code, you should use it through a server-side proxy.
 *
 * Also, OpenAI implements Rate Limiting, that really does not fits well in completion-as-you-type
 * scenarios. For production usage, we recommend using Scriba's provider, or implementing your own
 * provider models on cloud infrastructure.
 *
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
