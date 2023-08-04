import { Keymap_toAcceptWordByWord } from './Keymap_toAcceptWordByWord';
import { Keymap_toAcceptFullText } from './Keymap_toAcceptFullText';
import { StateField_ofMain } from './StateField_ofMain';
import { ViewPlugin_ofMain } from './ViewPlugin_ofMain';
import { ViewPlugin_ofSuggestionRendering } from './ViewPlugin_ofSuggestionRendering';

/* -------------------------------------------------------------------------- */
/*                                useExtension                                */
/* -------------------------------------------------------------------------- */

export const useExtension = [
  StateField_ofMain,
  ViewPlugin_ofMain(),
  ViewPlugin_ofSuggestionRendering,
  Keymap_toAcceptWordByWord,
  Keymap_toAcceptFullText,
];
