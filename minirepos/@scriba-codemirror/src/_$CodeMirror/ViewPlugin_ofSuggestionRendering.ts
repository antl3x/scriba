import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from '@codemirror/view';

import { StateField } from './StateField_ofMain';

/* ----------------------- ViewPlugin_ofSuggestionRendering ----------------------- */

export const ViewPlugin_ofSuggestionRendering = ViewPlugin.fromClass(
  class Plugin {
    decorations: DecorationSet;
    constructor() {
      this.decorations = Decoration.none;
    }

    update(update: ViewUpdate) {
      const suggestedText = update.state.field(StateField)?.suggestedText;
      if (!suggestedText) {
        this.decorations = Decoration.none;
        return;
      }

      this.decorations = __decorations(update.view, suggestedText);
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);

/* ------------------------------ __decorations ----------------------------- */

/**
 * Provides a suggestion for the next word
 */
function __decorations(view: EditorView, prefix: string) {
  const pos = view.state.selection.main.head;
  const widgets = [];
  const w = Decoration.widget({
    widget: new __widget(prefix),
    side: 1,
  });
  widgets.push(w.range(pos));
  return Decoration.set(widgets);
}

/* -------------------------------- __widget ------------------------------- */

class __widget extends WidgetType {
  suggestedText: string;
  constructor(suggestedText: string) {
    super();
    this.suggestedText = suggestedText;
  }
  toDOM() {
    const div = document.createElement('span');
    div.style.opacity = '0.4';
    div.className = 'cm-inline-text-suggestion';
    div.textContent = this.suggestedText;
    return div;
  }
}
