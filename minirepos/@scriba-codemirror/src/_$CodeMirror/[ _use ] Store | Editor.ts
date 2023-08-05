import { useWritable } from '_$Utils/_$Store'

/* -------------------------------------------------------------------------- */
/*                               Editor                                       */
/* -------------------------------------------------------------------------- */

export type tStore = null | {
  '<cause>': 'EDITOR:DOCUMENT_WAS_CHANGED'
  linesBefore: string[]
  currentLineBeforeContent: string
  currentLineAfterContent: string
  linesAfter: string[]
}

export const Editor = useWritable<tStore>(null)
