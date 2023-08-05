import { Keymap_to_AcceptFullText } from './Keymap | to AcceptFullText'
import { Keymap_to_AcceptWordByWord } from './Keymap | to AcceptWordByWord'
import { StateField_of_TextSuggestion } from './StateField | of TextSuggestion'
import { ViewPlugin_of_Main } from './ViewPlugin | of Main'
import { ViewPlugin_of_SuggestionRendering } from './ViewPlugin | of SuggestionRendering'

/* -------------------------------------------------------------------------- */
/*                                Extension                                   */
/* -------------------------------------------------------------------------- */

export const Extension = [
  StateField_of_TextSuggestion,
  ViewPlugin_of_Main(),
  ViewPlugin_of_SuggestionRendering,
  Keymap_to_AcceptWordByWord,
  Keymap_to_AcceptFullText
]
