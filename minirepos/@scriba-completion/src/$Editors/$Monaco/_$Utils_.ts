import { tLinesContext } from '_$Shared_/_$Types_'
import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api'

/* -------------------------------------------------------------------------- */
/*                             useGetLinesContext                             */
/* -------------------------------------------------------------------------- */
/**
 * This function is used to extract the context of the lines before and after the
 * current cursor position.
 */

type useGetLinesContext = (i: {
  model: Monaco.editor.ITextModel
  position: Monaco.Position
  nLinesBefore?: number
  nLinesAfter?: number
}) => tLinesContext

export const useGetLinesContext: useGetLinesContext = i => {
  const currentLineNumber = i.position.lineNumber
  const { nLinesBefore, nLinesAfter } = i
  const linesBefore = []
  const linesAfter = []

  if (currentLineNumber === 1) {
    // If current line is line 1, linesBefore should be an empty array.
    // No need to calculate linesBefore.
  } else {
    const startLineBefore =
      nLinesBefore !== undefined
        ? Math.max(currentLineNumber - nLinesBefore, 1) // Adjusted line number to start from 1
        : 1

    const endLineBefore = Math.max(currentLineNumber - 1, 1) // Adjusted line number to start from 1

    for (let line = startLineBefore; line <= endLineBefore; line++) {
      const lineContent = i.model.getLineContent(line)
      linesBefore.push(lineContent)
    }
  }

  const startLineAfter = currentLineNumber + 1
  const endLineAfter =
    nLinesAfter !== undefined
      ? Math.min(currentLineNumber + nLinesAfter, i.model.getLineCount())
      : i.model.getLineCount()

  for (let line = startLineAfter; line <= endLineAfter; line++) {
    const lineContent = i.model.getLineContent(line)
    linesAfter.push(lineContent)
  }

  const currentLineBeforeContent = i.model.getValueInRange({
    startColumn: 1,
    startLineNumber: currentLineNumber,
    endColumn: i.position.column,
    endLineNumber: currentLineNumber
  })

  const currentLineAfterContent = i.model.getValueInRange({
    startColumn: i.position.column,
    startLineNumber: currentLineNumber,
    endColumn: i.model.getLineMaxColumn(currentLineNumber),
    endLineNumber: currentLineNumber
  })

  return {
    linesBefore,
    currentLineBeforeContent,
    currentLineAfterContent,
    linesAfter
  }
}
