import * as $CME from '_$CodeMirror'
import { _wsClient } from './wsClient'
import { useGet } from '_$Utils/_$Store'

/* -------------------------------------------------------------------------- */
/*                           useFetchTextSuggestion                           */
/* -------------------------------------------------------------------------- */

type tResponse = {
  '<type>': 'λTextSuggestion'
  value: string
}

export function useFetchTextSuggestion() {
  return new Promise<tResponse>(r =>
    _wsClient.emit(
      'command:fetchTextSuggestion',
      useGet($CME._useStoreOfEditor),
      (suggestedText: tResponse) => {
        r(suggestedText)
      }
    )
  )
}
