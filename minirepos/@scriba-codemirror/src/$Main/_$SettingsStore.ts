import * as _$Store from '_$Utils/_$Store'

/* -------------------------------------------------------------------------- */
/*                                useSettingsStore                               */
/* -------------------------------------------------------------------------- */

export type tSettingsStore = null | {
  apiProxyEndpoint?: string
  authUserJWT: string
  codeContext?: string[]
  codeDebounce: number
  modelLanguage:
    | 'markdown'
    | 'javascript'
    | 'typescript'
    | 'python'
    | 'java'
    | 'go'
    | 'sql'
  modelName: 'code-genesis-01' | 'text-leo-01' | 'text-pegasus-01'
}

export const useSettingsStore = _$Store.useWritable<tSettingsStore>(null)
