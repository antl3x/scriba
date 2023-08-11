import { useOpenAI } from '$LLM/$Providers'
import { useSleep } from '_$Shared_/_$Utils_'
import { ILLMPrompt } from './$Types'

/* -------------------------------------------------------------------------- */
/*                      usePrompt_from_OpenAICodeCompletion                   */
/* -------------------------------------------------------------------------- */

type OpenAIProvider = ReturnType<typeof useOpenAI>

type usePrompt_from_OpenAICodeCompletion = <
  Provider extends OpenAIProvider
>(i: {
  provider: Provider
}) => ILLMPrompt<Provider>

/**
 * **IMPORTANT**: Since this prompt is based on the OpenAI Provider,
 * it's not recommended to use this prompt directly in client-side code,
 * as it exposes your API key to the client. This is only meant to be used in localhost scenarios,
 * where you can be sure that your API key is not exposed to the public.
 *
 * If you wish to use this prompt in client-side code, you should use it through a server-side proxy.
 *
 * Also, OpenAI implements Rate Limiting, that really does not fits well in completion-as-you-type
 * scenarios. For production usage, we recommend using Scriba's provider, or implementing your own
 * provider models on cloud infrastructure.
 *
 *
 * This code completion prompt was based on the example given on https://openai.com/blog/gpt-4-api-general-availability for code completion.
 */
export const usePrompt_from_OpenAICodeCompletion: usePrompt_from_OpenAICodeCompletion =
  i => {
    const meta: ILLMPrompt<typeof i.provider>['<meta>'] = {
      '<type>': 'LLMPrompt',
      '<provider>': i.provider
    }

    // we use this to control concurrency scenarios and to avoid fetching suggestions when the user is typing
    let isFetching = false

    const providerCli = i.provider['<meta>']['<vendorCli>']

    /* --------------------- fetchFillInTheMiddleSuggestions -------------------- */

    // Since OpenAI models do not support fill-in-the-middle, we return null
    const fetchFillInTheMiddleSuggestions: ILLMPrompt<OpenAIProvider>['fetchLeftToRightSuggestions'] =
      async () => {
        return null
      }

    /* ----------------------- fetchLeftToRightSuggestions ---------------------- */

    const fetchLeftToRightSuggestions: ILLMPrompt<OpenAIProvider>['fetchLeftToRightSuggestions'] =
      async ({ linesContext }) => {
        try {
          await useSleep(750)

          if (isFetching) return null

          const codeBeforeCursor =
            linesContext.linesBefore.join('\n') +
            linesContext.currentLineBeforeContent

          isFetching = true

          const apiReq = await providerCli.createChatCompletion({
            messages: [
              {
                role: 'system',
                content:
                  'Complete the following code. You output must only contain code, no conversation allowed.'
              },
              { role: 'user', content: codeBeforeCursor }
            ],
            model: 'gpt-3.5-turbo'
          })

          const filteredRes = apiReq.data.choices
            .map(c => c.message?.content)
            .filter(Boolean)
            .map(msg =>
              (msg as string).replace(new RegExp(`^${codeBeforeCursor}`), '')
            )

          return filteredRes
        } catch (err) {
          console.error('Something went wrong while fetching suggestion', err)
          return null
        } finally {
          isFetching = false
        }
      }
    return {
      '<meta>': meta,
      fetchFillInTheMiddleSuggestions,
      fetchLeftToRightSuggestions
    }
  }
