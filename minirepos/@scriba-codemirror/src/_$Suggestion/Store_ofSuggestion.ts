import { useWritable } from '_$Utils/_$Store'

export type tSuggestionStore = null | {
  textSuggestion: string | null
}

/* ----------------------- Store_ofSuggestion ----------------------- */

export const Store_ofSuggestion = useWritable<tSuggestionStore>(null)
