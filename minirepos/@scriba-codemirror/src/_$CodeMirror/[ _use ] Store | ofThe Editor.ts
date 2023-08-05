import { useWritable } from '_$Utils/_$Store'

/* -------------------------------------------------------------------------- */
/*                               Store_ofThe_Editor                                       */
/* -------------------------------------------------------------------------- */

export type tStore = null | {
  '<cause>': 'DOCUMENT_WAS_CHANGED'
  linesBefore: string[]
  currentLineBeforeContent: string
  currentLineAfterContent: string
  linesAfter: string[]
}

export const Store_ofThe_Editor = useWritable<tStore>(null)
