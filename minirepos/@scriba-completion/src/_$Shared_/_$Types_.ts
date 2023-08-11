/* -------------------------------------------------------------------------- */
/*                               tLinesContext                                */
/* -------------------------------------------------------------------------- */

/**
 * This type is designed to represent a more context-aware version
 * of the text/document lines. It is beneficial to have this structure
 * when determining the type of suggestion to provide.
 *
 * For example, it allows us to know if a fill-in-the-middle suggestion is
 * necessary or possible. Additionally, it aids in selecting context lines
 * that are most relevant to send to the model.
 * For instance, it can select 3 lines above and 3 lines below the current
 * cursor position.
 */
export type tLinesContext = {
  linesBefore: string[]
  currentLineBeforeContent: string
  currentLineAfterContent: string
  linesAfter: string[]
}

/* -------------------------------------------------------------------------- */
/*                                   Mutable                                  */
/* -------------------------------------------------------------------------- */
/**
 * Used to remove readonly in types.
 */
export type Mutable<T> = { -readonly [k in keyof T]: T[k] }
