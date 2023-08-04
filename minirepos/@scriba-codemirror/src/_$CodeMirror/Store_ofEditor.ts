import { useWritable } from "_$Utils/_$Store";

/* -------------------------------------------------------------------------- */
/*                               Store_ofEditor                               */
/* -------------------------------------------------------------------------- */

export type tStore = null | {
  '<cause>': 'EDITOR:DOCUMENT_WAS_CHANGED';
  linesBefore: string[];
  currentLineBeforeContent: string;
  currentLineAfterContent: string;
  linesAfter: string[];
};

export const Store_ofEditor = useWritable<tStore>(null);
