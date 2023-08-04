import * as $CMS from '@codemirror/state';

/* -------------------------------------------------------------------------- */
/*                                 StateEffect_ofMain                         */
/* -------------------------------------------------------------------------- */

export const StateEffect_ofMain = $CMS.StateEffect.define<{
  suggestedText: string | null;
  doc: Text;
}>();
