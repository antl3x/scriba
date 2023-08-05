import { useExtension } from '_$CodeMirror'
import * as $SuggestionService from '_$Suggestion'
import { useSettingsStore, tSettingsStore } from './_$SettingsStore'

/* -------------------------------- useScriba ------------------------------- */

type intUseScribaInput = NonNullable<tSettingsStore> & {
  codeDebounce?: number
}

/**
 * @param options Settings Options
 * @param options.apiProxyEndpoint Used to replace default `api.usescriba.com` endpoint. Useful if you use your backend to proxy requests.
 * @param options.authUserJWT The JWT of the user signed with SCRIBA_RS256_SIGNING_KEY
 * @param options.codeContext Context is a string[] that can be used to enhance code generation
 * @param options.codeDebounce debounce in milliseconds (Used to fetch suggestions after last keypress)
 * @param options.modelName Scriba code model to use [code-genesis-01]
 * @param options.modelLanguage Language of the code to be generated [javascript | typescript | python | java | go | sql]
 * @returns CodeMirror Extension
 */
export function useScriba(options: intUseScribaInput) {
  const {
    apiProxyEndpoint,
    authUserJWT,
    codeContext = [],
    codeDebounce = 275,
    modelLanguage,
    modelName
  } = options

  useSettingsStore.set({
    apiProxyEndpoint,
    authUserJWT,
    codeContext,
    codeDebounce,
    modelLanguage,
    modelName
  })

  $SuggestionService._useRegisterHandlers()

  return useExtension
}
