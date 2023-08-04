import * as $CME from '_$CodeMirror';
import { _wsClient } from './wsClient';
import { useGet } from '_$Utils/_$Store';

type tResponse = {
  '<type>': 'λCodeSuggestion';
  value: string;
};

/* -------------------------------------------------------------------------- */
/*                           useFetchCodeSuggestion                           */
/* -------------------------------------------------------------------------- */

export function useFetchCodeSuggestion() {
  return new Promise<tResponse>((r) =>
    _wsClient.emit(
      'command:fetchCodeSuggestion',
      useGet($CME._useStoreOfEditor),
      (suggestedCode: tResponse) => {
        r(suggestedCode);
      }
    )
  );
}
