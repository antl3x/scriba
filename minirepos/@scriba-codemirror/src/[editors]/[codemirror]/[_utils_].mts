/* -------------------------------------------------------------------------- */
/*                             useGetLinesContext                             */
/* -------------------------------------------------------------------------- */

import { EditorState } from '@codemirror/state'
import { tLinesContext } from '[_shared_]/$Types.mjs'

/**
 * This function is used to extract the context of the lines before and after the
 * current cursor position.
 */
export function useGetLinesContext(i: {
  state: EditorState
  nLinesBefore?: number
  nLinesAfter?: number
}): tLinesContext {
  const { state, nLinesBefore, nLinesAfter } = i
  const { doc, selection } = state
  const { head: cursorHead } = selection.main

  const currentLine = doc.lineAt(cursorHead)

  const linesBefore = []
  const linesAfter = []

  if (currentLine.number === 1) {
    // If current line is line 1, linesBefore should be an empty array.
    // No need to calculate linesBefore.
  } else {
    const startLineBefore =
      nLinesBefore !== undefined
        ? Math.max(currentLine.number - nLinesBefore, 1) // Adjusted line number to start from 1
        : 1

    const endLineBefore = Math.max(currentLine.number - 1, 1) // Adjusted line number to start from 1

    for (let line = startLineBefore; line <= endLineBefore; line++) {
      const lineContent = doc.line(line).text
      linesBefore.push(lineContent)
    }
  }

  const startLineAfter = currentLine.number + 1
  const endLineAfter =
    nLinesAfter !== undefined
      ? Math.min(currentLine.number + nLinesAfter, doc.lines)
      : doc.lines

  for (let line = startLineAfter; line <= endLineAfter; line++) {
    const lineContent = doc.line(line).text
    linesAfter.push(lineContent)
  }

  const currentLineBeforeContent = state.sliceDoc(currentLine.from, cursorHead)
  const currentLineAfterContent = state.sliceDoc(cursorHead, currentLine.to)

  return {
    linesBefore,
    currentLineBeforeContent,
    currentLineAfterContent,
    linesAfter
  }
}
