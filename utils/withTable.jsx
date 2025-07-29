import { Editor, Element, Point, Range } from 'slate';

export default function withTable(editor) {
  const { deleteBackward, deleteForward, insertBreak } = editor;

  editor.deleteBackward = (unit) => {
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      const [cell] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          n.type === 'table-cell',
      });
      if (cell) {
        const [, cellPath] = cell;
        const start = Editor.start(editor, cellPath);
        if (Point.equals(selection.anchor, start)) {
          return;
        }
      }
    }
    deleteBackward(unit);
  };
  editor.deleteForward = (unit) => {
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      const [cell] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          n.type === 'table-cell',
      });
      if (cell) {
        const [, cellPath] = cell;
        const end = Editor.end(editor, cellPath);
        if (Point.equals(selection.anchor, end)) {
          return;
        }
      }
    }
    deleteForward(unit);
  };
  editor.insertBreak = () => {
    const { selection } = editor;
    if (selection) {
      const [table] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table',
      });
      if (table) {
        return;
      }
    }
    insertBreak();
  };

  return editor;
}
